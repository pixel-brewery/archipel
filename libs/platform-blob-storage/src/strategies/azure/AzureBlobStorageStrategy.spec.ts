import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Test, type TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobStoragePreconditionFailedError } from '../../errors/BlobStoragePreconditionFailedError.js';
import { BlobStorageUnavailableError } from '../../errors/BlobStorageUnavailableError.js';
import { AzureBlobStorageStrategy } from './AzureBlobStorageStrategy.js';
import { AZURE_BLOB_CONNECTION_STRING, AZURE_BLOB_CONTAINER_NAME } from './env.js';

const sdk = vi.hoisted(() => ({
    fromConnectionString: vi.fn(),
    getContainerClient: vi.fn(),
    getBlobClient: vi.fn(),
    getBlockBlobClient: vi.fn(),
    withVersion: vi.fn(),
    withSnapshot: vi.fn(),
    baseDelete: vi.fn(),
    versionDelete: vi.fn(),
    snapshotDelete: vi.fn(),
    baseExists: vi.fn(),
    versionExists: vi.fn(),
    listBlobsFlat: vi.fn(),
    byPage: vi.fn(),
    next: vi.fn(),
    upload: vi.fn(),
}));

vi.mock('@azure/storage-blob', () => ({
    BlobServiceClient: { fromConnectionString: sdk.fromConnectionString },
    BlockBlobClient: class {},
}));

describe('AzureBlobStorageStrategy', () => {
    let strategy: AzureBlobStorageStrategy;
    let module: TestingModule | undefined;
    const resourceId = 'https://account.blob.core.windows.net/objects';
    const key = 'files/original.pdf';

    beforeEach(async () => {
        vi.resetAllMocks();
        sdk.baseDelete.mockResolvedValue(undefined);
        sdk.versionDelete.mockResolvedValue(undefined);
        sdk.snapshotDelete.mockResolvedValue(undefined);
        sdk.baseExists.mockResolvedValue(true);
        sdk.versionExists.mockResolvedValue(false);
        sdk.withVersion.mockReturnValue({ delete: sdk.versionDelete, exists: sdk.versionExists });
        sdk.withSnapshot.mockReturnValue({ delete: sdk.snapshotDelete });
        sdk.getBlobClient.mockReturnValue({
            delete: sdk.baseDelete,
            exists: sdk.baseExists,
            withVersion: sdk.withVersion,
            withSnapshot: sdk.withSnapshot,
        });
        sdk.upload.mockResolvedValue({ versionId: 'uploaded-version', etag: '"uploaded-etag"' });
        sdk.getBlockBlobClient.mockReturnValue({ upload: sdk.upload });
        sdk.next.mockResolvedValue({ done: false, value: { segment: { blobItems: [] } } });
        sdk.byPage.mockReturnValue({ next: sdk.next });
        sdk.listBlobsFlat.mockReturnValue({ byPage: sdk.byPage });
        sdk.getContainerClient.mockReturnValue({
            url: 'https://test-user:test-password@account.blob.core.windows.net/objects?sig=test-signature#fragment',
            getBlobClient: sdk.getBlobClient,
            getBlockBlobClient: sdk.getBlockBlobClient,
            listBlobsFlat: sdk.listBlobsFlat,
        });
        sdk.fromConnectionString.mockReturnValue({ getContainerClient: sdk.getContainerClient });
        const configuration = new Map([
            [AZURE_BLOB_CONNECTION_STRING.key, 'test-only-connection-string'],
            [AZURE_BLOB_CONTAINER_NAME.key, 'objects'],
        ]);
        module = await Test.createTestingModule({
            providers: [
                { provide: ConfigService, useValue: { get: (name: string) => configuration.get(name) } },
                { provide: AzureBlobStorageStrategy, useFactory: (config: ConfigService) => new AzureBlobStorageStrategy(config), inject: [ConfigService] },
            ],
        }).compile();
        strategy = module.get(AzureBlobStorageStrategy);
    });

    afterEach(async () => {
        await module?.close();
        module = undefined;
        vi.restoreAllMocks();
    });

    it('deletes the selected historical version without deleting the base object or its snapshots', async () => {
        // arrange
        const request = { key, versionId: 'older-version' };

        // act
        await strategy.deleteObject(request);

        // assert
        expect(sdk.withVersion).toHaveBeenCalledWith('older-version');
        expect(sdk.versionDelete).toHaveBeenCalledWith(undefined);
        expect(sdk.baseDelete).not.toHaveBeenCalled();
    });

    it('retains the ordinary base deletion and snapshot inclusion when no version is selected', async () => {
        // act
        await strategy.deleteObject({ key });

        // assert
        expect(sdk.baseDelete).toHaveBeenCalledWith({ deleteSnapshots: 'include' });
        expect(sdk.withVersion).not.toHaveBeenCalled();
    });

    it('reports the selected version as absent even while the base object exists', async () => {
        // act
        const exists = await strategy.objectExists({ key, versionId: 'missing-version' });

        // assert
        expect(exists).toBe(false);
        expect(sdk.withVersion).toHaveBeenCalledWith('missing-version');
        expect(sdk.versionExists).toHaveBeenCalledOnce();
        expect(sdk.baseExists).not.toHaveBeenCalled();
    });

    it.each(['delete', 'exists'] as const)('never broadens an empty legacy version selector during %s', async (operation) => {
        // act
        const result = operation === 'delete' ? strategy.deleteObject({ key, versionId: '' }) : strategy.objectExists({ key, versionId: '' });

        // assert
        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
        expect(sdk.baseDelete).not.toHaveBeenCalled();
    });

    it('observes only the exact key with version, snapshot and soft-deletion facts while retaining pagination', async () => {
        // arrange
        const deletedAt = new Date('2026-10-01T00:00:00.000Z');
        sdk.next.mockResolvedValueOnce({
            done: false,
            value: {
                continuationToken: 'following-page',
                segment: {
                    blobItems: [
                        {
                            name: key,
                            versionId: 'older-version',
                            isCurrentVersion: false,
                            deleted: true,
                            snapshot: '',
                            properties: { etag: '"older-etag"', deletedOn: deletedAt, remainingRetentionDays: 12 },
                        },
                        { name: key, snapshot: 'snapshot-time', deleted: false, properties: { etag: '"snapshot-etag"' } },
                        { name: `${key}.new`, versionId: 'unrelated', deleted: false, properties: {} },
                    ],
                },
            },
        });

        // act
        const result = await strategy.inspectObjectHistory({ key, maxKeys: 2, continuationToken: 'previous-page' });

        // assert
        expect(result).toEqual({
            providerId: 'azure',
            resourceId,
            bucket: 'objects',
            continuationToken: 'following-page',
            entries: [
                {
                    key,
                    versionId: 'older-version',
                    isCurrentVersion: false,
                    deleted: true,
                    snapshotId: undefined,
                    etag: '"older-etag"',
                    deletedAt,
                    remainingRetentionDays: 12,
                },
                {
                    key,
                    versionId: undefined,
                    isCurrentVersion: undefined,
                    deleted: false,
                    snapshotId: 'snapshot-time',
                    etag: '"snapshot-etag"',
                    deletedAt: undefined,
                    remainingRetentionDays: undefined,
                },
            ],
        });
        expect(sdk.listBlobsFlat).toHaveBeenCalledWith(
            expect.objectContaining({ prefix: key, includeVersions: true, includeSnapshots: true, includeDeleted: true, includeDeletedWithVersions: true }),
        );
        expect(sdk.byPage).toHaveBeenCalledWith({ continuationToken: 'previous-page', maxPageSize: 2 });
        expect(sdk.baseDelete).not.toHaveBeenCalled();
    });

    it('retains continuation when a page contains only neighboring keys', async () => {
        // arrange
        sdk.next.mockResolvedValueOnce({
            done: false,
            value: { continuationToken: 'more', segment: { blobItems: [{ name: `${key}.other`, properties: {} }] } },
        });

        // act
        const result = await strategy.inspectObjectHistory({ key });

        // assert
        expect(result.entries).toEqual([]);
        expect(result.continuationToken).toBe('more');
    });

    it('does not convert a failed listing into successful absence', async () => {
        // arrange
        const failure = { statusCode: 403, code: 'AuthorizationPermissionMismatch' };
        sdk.next.mockRejectedValueOnce(failure);

        // act
        const result = strategy.inspectObjectHistory({ key });

        // assert
        await expect(result).rejects.toBe(failure);
    });

    it('reports the actual upload resource without authentication material or a falsely requested bucket', async () => {
        // act
        const result = await strategy.uploadObject({ key, body: Buffer.from('data'), bucket: 'ignored-alternate' });

        // assert
        expect(result.metadata).toMatchObject({
            provider: 'azure',
            resourceId,
            bucket: 'objects',
            key,
            versionId: 'uploaded-version',
            etag: '"uploaded-etag"',
        });
    });

    it.each([{}, { versionId: 'older-version' }, { snapshotId: 'snapshot-time' }])(
        'conditionally deletes only the selected exact ETag and object %j',
        async (selector) => {
            // arrange
            const selected = 'versionId' in selector ? sdk.versionDelete : 'snapshotId' in selector ? sdk.snapshotDelete : sdk.baseDelete;

            // act
            await strategy.deleteObjectConditionally({ key, resourceId, ifMatch: '"original-etag"', ...selector });

            // assert
            expect(selected).toHaveBeenCalledWith(
                expect.objectContaining({ conditions: { ifMatch: '"original-etag"' }, abortSignal: expect.any(AbortSignal) }),
            );
            if ('versionId' in selector || 'snapshotId' in selector) {
                expect(sdk.baseDelete).not.toHaveBeenCalled();
                expect(selected.mock.calls[0]?.[0]).not.toHaveProperty('deleteSnapshots');
            }
        },
    );

    it('maps a changed object to a stable precondition failure without deleting a different generation', async () => {
        // arrange
        sdk.versionDelete.mockRejectedValueOnce({ statusCode: 412, code: 'ConditionNotMet' });

        // act
        const result = strategy.deleteObjectConditionally({ key, versionId: 'older-version', ifMatch: '"original-etag"' });

        // assert
        await expect(result).rejects.toBeInstanceOf(BlobStoragePreconditionFailedError);
        expect(sdk.baseDelete).not.toHaveBeenCalled();
        expect(sdk.snapshotDelete).not.toHaveBeenCalled();
    });

    it('rejects a different resource before selecting or deleting any object', async () => {
        // act
        const result = strategy.deleteObjectConditionally({ key, resourceId: 'https://different.blob.core.windows.net/objects', ifMatch: '"original-etag"' });

        // assert
        await expect(result).rejects.toBeInstanceOf(BlobStoragePreconditionFailedError);
        expect(sdk.getBlobClient).not.toHaveBeenCalled();
        expect(sdk.baseDelete).not.toHaveBeenCalled();
        expect(sdk.versionDelete).not.toHaveBeenCalled();
        expect(sdk.snapshotDelete).not.toHaveBeenCalled();
    });

    it.each(['', '*', 'W/"weak"', '"one", "two"'])('rejects unsafe ETag %j before provider access', async (ifMatch) => {
        // act
        const result = strategy.deleteObjectConditionally({ key, ifMatch });

        // assert
        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
    });

    it.each([
        { versionId: '', snapshotId: undefined },
        { versionId: undefined, snapshotId: '' },
        { versionId: 'version', snapshotId: 'snapshot' },
    ])('rejects ambiguous or empty selectors %j before provider access', async (selector) => {
        // act
        const result = strategy.deleteObjectConditionally({ key, ifMatch: '"original-etag"', ...selector });

        // assert
        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
    });

    it.each(['history', 'delete'] as const)('rejects an alternate bucket for %s before provider access', async (operation) => {
        // act
        const result =
            operation === 'history'
                ? strategy.inspectObjectHistory({ key, bucket: 'different' })
                : strategy.deleteObjectConditionally({ key, bucket: 'different', ifMatch: '"original-etag"' });

        // assert
        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
    });

    it.each([0, 5001, Number.NaN, 1.5])('rejects invalid history page limit %s before provider access', async (maxKeys) => {
        // act
        const result = strategy.inspectObjectHistory({ key, maxKeys });

        // assert
        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
    });

    it.each([0, 30_001, Number.NaN, 1.5])('rejects invalid request timeout %s before provider access', async (timeoutMs) => {
        // act
        const result = strategy.deleteObjectConditionally({ key, ifMatch: '"original-etag"', timeoutMs });

        // assert
        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
    });

    it('forwards caller cancellation into the active history pager', async () => {
        // arrange
        const cancellation = new AbortController();
        let started: (signal: AbortSignal) => void = () => undefined;
        const requested = new Promise<AbortSignal>((resolve) => {
            started = resolve;
        });
        let effectiveSignal: AbortSignal | undefined;
        sdk.listBlobsFlat.mockImplementationOnce((options: { abortSignal: AbortSignal }) => {
            effectiveSignal = options.abortSignal;
            started(options.abortSignal);
            return { byPage: sdk.byPage };
        });
        sdk.next.mockImplementationOnce(
            () =>
                new Promise((_resolve, reject) => {
                    effectiveSignal?.addEventListener('abort', () => reject(new Error('SDK request aborted')), { once: true });
                }),
        );

        // act
        const result = strategy.inspectObjectHistory({ key, abortSignal: cancellation.signal });
        const signal = await requested;
        cancellation.abort();

        // assert
        await expect(result).rejects.toBeInstanceOf(BlobStorageUnavailableError);
        expect(signal.aborted).toBe(true);
    });

    it('enforces the default deadline through the active SDK deletion signal', async () => {
        // arrange
        const deadline = new AbortController();
        const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(deadline.signal);
        let started: () => void = () => undefined;
        const requested = new Promise<void>((resolve) => {
            started = resolve;
        });
        sdk.baseDelete.mockImplementationOnce(
            (options: { abortSignal: AbortSignal }) =>
                new Promise((_resolve, reject) => {
                    options.abortSignal.addEventListener('abort', () => reject(new Error('SDK deadline reached')), { once: true });
                    started();
                }),
        );

        // act
        const result = strategy.deleteObjectConditionally({ key, ifMatch: '"original-etag"' });
        await requested;
        deadline.abort();

        // assert
        await expect(result).rejects.toBeInstanceOf(BlobStorageUnavailableError);
        expect(timeout).toHaveBeenCalledWith(30_000);
    });

    it('honors a shorter budget and an already cancelled caller without starting a mutation', async () => {
        // arrange
        const timeout = vi.spyOn(AbortSignal, 'timeout');
        const cancellation = new AbortController();
        cancellation.abort();

        // act
        const result = strategy.deleteObjectConditionally({ key, ifMatch: '"original-etag"', timeoutMs: 1000, abortSignal: cancellation.signal });

        // assert
        await expect(result).rejects.toBeInstanceOf(BlobStorageUnavailableError);
        expect(timeout).toHaveBeenCalledWith(1000);
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
        expect(sdk.baseDelete).not.toHaveBeenCalled();
    });
});
