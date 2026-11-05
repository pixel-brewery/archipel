// cspell:ignore versionid
import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Logger } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { Readable } from 'node:stream';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobStoragePreconditionFailedError } from '../../errors/BlobStoragePreconditionFailedError.js';
import { BlobStorageUnavailableError } from '../../errors/BlobStorageUnavailableError.js';
import { BlobStorageUnsupportedOperationError } from '../../errors/BlobStorageUnsupportedOperationError.js';
import { AzureBlobStorageStrategy } from './AzureBlobStorageStrategy.js';
import { AZURE_BLOB_CONNECTION_STRING, AZURE_BLOB_CONTAINER_NAME } from './env.js';

const sdk = vi.hoisted(() => ({
    packageMetadata: vi.fn<() => unknown>(),
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
    download: vi.fn(),
    parseSasPermissions: vi.fn(),
    signVersionedUrl: vi.fn(),
}));

vi.mock('node:module', async (importOriginal) => {
    const actual = await importOriginal<typeof import('node:module')>();
    return {
        ...actual,
        createRequire: (filename: string | URL): NodeRequire =>
            new Proxy(actual.createRequire(filename), {
                apply: (load: NodeRequire, thisArg: unknown, args: unknown[]): unknown =>
                    args[0] === '@azure/storage-blob/package.json' ? sdk.packageMetadata() : Reflect.apply(load, thisArg, args),
            }),
    };
});

vi.mock('@azure/storage-blob', () => ({
    BlobServiceClient: { fromConnectionString: sdk.fromConnectionString },
    BlockBlobClient: class {},
    BlobSASPermissions: { parse: sdk.parseSasPermissions },
}));

describe('AzureBlobStorageStrategy', () => {
    let strategy: AzureBlobStorageStrategy;
    let module: TestingModule | undefined;
    const resourceId = 'https://account.blob.core.windows.net/objects';
    const key = 'files/original.pdf';

    beforeEach(async () => {
        vi.resetAllMocks();
        sdk.packageMetadata.mockReturnValue({ version: '12.34.0' });
        sdk.baseDelete.mockResolvedValue(undefined);
        sdk.versionDelete.mockResolvedValue(undefined);
        sdk.snapshotDelete.mockResolvedValue(undefined);
        sdk.baseExists.mockResolvedValue(true);
        sdk.versionExists.mockResolvedValue(false);
        sdk.withVersion.mockReturnValue({ delete: sdk.versionDelete, exists: sdk.versionExists, generateSasUrl: sdk.signVersionedUrl });
        sdk.withSnapshot.mockReturnValue({ delete: sdk.snapshotDelete });
        sdk.getBlobClient.mockReturnValue({
            delete: sdk.baseDelete,
            download: sdk.download,
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

    it.each(['upload', 'delete'] as const)('does not log private object paths, container identity or payload during %s', async (operation) => {
        const privateKey = 'private-object-path/sensitive-name.bin';
        const debug = vi.spyOn(Logger.prototype, 'debug').mockImplementation(() => undefined);

        if (operation === 'upload') {
            const result = await strategy.uploadObject({
                key: privateKey,
                body: Buffer.from('private-content'),
                metadata: { privateField: 'sensitive-metadata' },
            });
            expect(result.metadata.key).toBe(privateKey);
            expect(result.metadata.versionId).toBe('uploaded-version');
        } else {
            await expect(strategy.deleteObject({ key: privateKey })).resolves.toBeUndefined();
            expect(sdk.baseDelete).toHaveBeenCalledWith({ deleteSnapshots: 'include' });
        }

        expect(debug).toHaveBeenCalledExactlyOnceWith({ operation: `blobObject.${operation}`, providerId: 'azure', result: 'succeeded' });
        const logged = JSON.stringify(debug.mock.calls);
        for (const privateValue of [privateKey, 'objects', 'private-content', 'sensitive-metadata', 'test-password', 'test-signature'])
            expect(logged).not.toContain(privateValue);
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

    it.each(['delete', 'exists', 'conditional delete'] as const)(
        'does not fall back to the base blob when an older SDK cannot select a version for %s',
        async (operation) => {
            // arrange
            sdk.getBlobClient.mockReturnValueOnce({ delete: sdk.baseDelete, exists: sdk.baseExists });
            const request = { key, versionId: 'older-version' };

            // act
            const result =
                operation === 'delete'
                    ? strategy.deleteObject(request)
                    : operation === 'exists'
                      ? strategy.objectExists(request)
                      : strategy.deleteObjectConditionally({ ...request, ifMatch: '"0x8DBCE24D4341AC3"' });

            // assert
            await expect(result).rejects.toBeInstanceOf(BlobStorageUnsupportedOperationError);
            expect(sdk.baseDelete).not.toHaveBeenCalled();
            expect(sdk.baseExists).not.toHaveBeenCalled();
        },
    );

    it('signs the selected version and returns its version-scoped URL', async () => {
        // arrange
        const versionId = '2023-10-16T08:49:37.8855337Z';
        sdk.parseSasPermissions.mockReturnValueOnce({ read: true });
        sdk.signVersionedUrl.mockResolvedValueOnce(`${resourceId}/${key}?versionid=${encodeURIComponent(versionId)}&sr=bv&sig=test-only`);

        // act
        const url = new URL(await strategy.createSignedUrl({ key, versionId }));

        // assert
        expect(url.searchParams.get('versionid')).toBe(versionId);
        expect(url.searchParams.get('sr')).toBe('bv');
        expect(sdk.withVersion).toHaveBeenCalledExactlyOnceWith(versionId);
        expect(sdk.signVersionedUrl).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ permissions: { read: true } }));
    });

    it('rejects versioned signing when the selected client cannot sign the version', async () => {
        // arrange
        sdk.withVersion.mockReturnValueOnce({ exists: sdk.versionExists });

        // act
        const result = strategy.createSignedUrl({ key, versionId: 'older-version' });

        // assert
        await expect(result).rejects.toBeInstanceOf(BlobStorageUnsupportedOperationError);
        expect(sdk.signVersionedUrl).not.toHaveBeenCalled();
    });

    it('rejects versioned signing for an alternate bucket before provider access', async () => {
        // act
        const result = strategy.createSignedUrl({ key, bucket: 'other', versionId: 'older-version' });

        // assert
        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
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

    it('retains a deleted root’s observed version without claiming a live base or returning an unusable ETag', async () => {
        // arrange
        sdk.packageMetadata.mockReturnValueOnce({ version: '12.8.0' });
        const versionId = '2023-10-16T08:49:37.8855337Z';
        sdk.next.mockResolvedValueOnce({
            done: false,
            value: {
                continuationToken: 'more',
                segment: {
                    blobItems: [
                        { name: key, versionId, isCurrentVersion: true, hasVersionsOnly: true, properties: { etag: '0x8DBCE24D4341AC3' } },
                        { name: key, hasVersionsOnly: true },
                    ],
                },
            },
        });

        // act
        const result = await strategy.inspectObjectHistory({ key });

        // assert
        expect(result.entries).toEqual([expect.objectContaining({ key, versionId, isCurrentVersion: false, deleted: false, etag: '"0x8DBCE24D4341AC3"' })]);
        expect(result.continuationToken).toBe('more');
    });

    it.each(['12.0.0', '12.7.0', '12.8.0-beta.1'])('does not report incomplete object history with SDK %s', async (version) => {
        // arrange
        sdk.packageMetadata.mockReturnValueOnce({ version });

        // act
        const result = strategy.inspectObjectHistory({ key });

        // assert
        await expect(result).rejects.toBeInstanceOf(BlobStorageUnsupportedOperationError);
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
        expect(sdk.listBlobsFlat).not.toHaveBeenCalled();
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

    it('reports the actual upload resource without authentication material for the configured bucket', async () => {
        // act
        const result = await strategy.uploadObject({ key, body: Buffer.from('data'), bucket: 'objects' });

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

    it('keeps the legacy upload bucket alias without claiming a verified resource identity', async () => {
        // act
        const result = await strategy.uploadObject({ key, body: Buffer.from('data'), bucket: 'legacy-alias' });

        // assert
        expect(result.metadata.bucket).toBe('legacy-alias');
        expect(result.metadata).not.toHaveProperty('resourceId');
        expect(sdk.getContainerClient).toHaveBeenCalledExactlyOnceWith('objects');
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
            expect(selected.mock.calls[0]?.[0]).not.toHaveProperty('deleteSnapshots');
            if ('versionId' in selector || 'snapshotId' in selector) {
                expect(sdk.baseDelete).not.toHaveBeenCalled();
            }
        },
    );

    it('preserves unselected snapshots when Azure refuses a conditional base deletion', async () => {
        // arrange
        const snapshots = new Set(['first-snapshot', 'second-snapshot']);
        const conflict = Object.assign(new Error('The base object has snapshots.'), {
            statusCode: 409,
            code: 'SnapshotsPresent',
        });
        sdk.baseDelete.mockImplementationOnce(async (options: { deleteSnapshots?: string }) => {
            if (options.deleteSnapshots === 'include') {
                snapshots.clear();
                return;
            }
            throw conflict;
        });

        // act
        const deletion = strategy.deleteObjectConditionally({ key, resourceId, ifMatch: '"original-etag"' });

        // assert
        await expect(deletion).rejects.toBe(conflict);
        expect(snapshots).toEqual(new Set(['first-snapshot', 'second-snapshot']));
        expect(sdk.baseDelete).toHaveBeenCalledOnce();
        expect(sdk.versionDelete).not.toHaveBeenCalled();
        expect(sdk.snapshotDelete).not.toHaveBeenCalled();
    });

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
    it('cancels an active upload through the actual SDK signal without pretending to undo provider acceptance', async () => {
        const cancellation = new AbortController();
        const timeout = vi.spyOn(AbortSignal, 'timeout');
        let started: () => void = () => undefined;
        const requested = new Promise<void>((resolve) => {
            started = resolve;
        });
        let activeSignal: AbortSignal | undefined;
        sdk.upload.mockImplementationOnce(
            (_body: Buffer, _length: number, options: { abortSignal: AbortSignal }) =>
                new Promise((_resolve, reject) => {
                    activeSignal = options.abortSignal;
                    options.abortSignal.addEventListener('abort', () => reject(new Error('SDK upload cancelled')), { once: true });
                    started();
                }),
        );

        const result = strategy.uploadObject({ key, body: Buffer.from('data'), execution: { timeoutMs: 1000, abortSignal: cancellation.signal } });
        await requested;
        cancellation.abort();

        await expect(result).rejects.toBeInstanceOf(BlobStorageUnavailableError);
        expect(activeSignal?.aborted).toBe(true);
        expect(timeout).toHaveBeenCalledWith(1000);
    });

    it('cancels an active ordinary listing page and does not return incomplete absence', async () => {
        const cancellation = new AbortController();
        let started: () => void = () => undefined;
        const requested = new Promise<void>((resolve) => {
            started = resolve;
        });
        let activeSignal: AbortSignal | undefined;
        sdk.listBlobsFlat.mockImplementationOnce((options: { abortSignal: AbortSignal }) => {
            activeSignal = options.abortSignal;
            return { byPage: sdk.byPage };
        });
        sdk.next.mockImplementationOnce(
            () =>
                new Promise((_resolve, reject) => {
                    activeSignal?.addEventListener('abort', () => reject(new Error('SDK listing cancelled')), { once: true });
                    started();
                }),
        );

        const result = strategy.listObjects({ prefix: 'records/', maxKeys: 10, execution: { abortSignal: cancellation.signal } });
        await requested;
        cancellation.abort();

        await expect(result).rejects.toBeInstanceOf(BlobStorageUnavailableError);
        expect(activeSignal?.aborted).toBe(true);
        expect(sdk.byPage).toHaveBeenCalledWith({ continuationToken: undefined, maxPageSize: 10 });
    });

    it('reads actual bytes at an explicitly bounded download limit', async () => {
        const content = Buffer.from('{"value":1}');
        const body = Readable.from([content]);
        sdk.download.mockResolvedValueOnce({ readableStreamBody: body, contentLength: content.length, contentType: 'application/json' });

        const result = await strategy.downloadObject<string>({ key, responseType: 'text', maxBytes: content.length, execution: { timeoutMs: 1000 } });

        expect(result.data).toBe(content.toString('utf8'));
        expect(result.contentLength).toBe(content.length);
        expect(sdk.download.mock.calls[0]?.[2]).toMatchObject({ abortSignal: expect.any(AbortSignal) });
    });

    it('keeps continuation on an empty bounded listing page', async () => {
        sdk.next.mockResolvedValueOnce({ done: false, value: { segment: { blobItems: [] }, continuationToken: 'following' } });

        const page = await strategy.listObjects({ prefix: 'records/', maxKeys: 10, execution: {} });

        expect(page).toEqual({ entries: [], continuationToken: 'following' });
    });

    it('stops a download stream whose actual chunks exceed its byte limit despite a smaller declared length', async () => {
        const body = Readable.from([Buffer.from('abc'), Buffer.from('def')]);
        sdk.download.mockResolvedValueOnce({ readableStreamBody: body, contentLength: 1 });

        const result = strategy.downloadObject({ key, maxBytes: 5 });

        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_RESPONSE_TOO_LARGE' });
        expect(body.destroyed).toBe(true);
    });

    it('rejects an oversized declared response without consuming its body', async () => {
        let reads = 0;
        const body = new Readable({
            read() {
                reads++;
            },
        });
        sdk.download.mockResolvedValueOnce({ readableStreamBody: body, contentLength: 11 });

        const result = strategy.downloadObject({ key, maxBytes: 10 });

        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_RESPONSE_TOO_LARGE' });
        expect(reads).toBe(0);
        expect(body.destroyed).toBe(true);
    });

    it('keeps the deadline effective after download headers by destroying the stalled response stream', async () => {
        const deadline = new AbortController();
        const timeout = vi.spyOn(AbortSignal, 'timeout').mockReturnValue(deadline.signal);
        let started: () => void = () => undefined;
        const reading = new Promise<void>((resolve) => {
            started = resolve;
        });
        const body = new Readable({
            read() {
                started();
            },
        });
        sdk.download.mockResolvedValueOnce({ readableStreamBody: body });

        const result = strategy.downloadObject({ key, maxBytes: 1024, execution: { timeoutMs: 500 } });
        await reading;
        deadline.abort();

        await expect(result).rejects.toBeInstanceOf(BlobStorageUnavailableError);
        expect(body.destroyed).toBe(true);
        expect(timeout).toHaveBeenCalledWith(500);
    });

    it.each(['uploadObject', 'downloadObject', 'listObjects'] as const)('rejects already cancelled %s before SDK access', async (operation) => {
        const cancellation = new AbortController();
        cancellation.abort();
        const execution = { abortSignal: cancellation.signal };

        const result =
            operation === 'uploadObject'
                ? strategy.uploadObject({ key, body: Buffer.from('data'), execution })
                : operation === 'downloadObject'
                  ? strategy.downloadObject({ key, execution })
                  : strategy.listObjects({ prefix: 'records/', execution });

        await expect(result).rejects.toBeInstanceOf(BlobStorageUnavailableError);
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
    });

    it.each([-1, Number.NaN, Number.MAX_SAFE_INTEGER + 1])('rejects invalid download byte limit %s before SDK access', async (maxBytes) => {
        const result = strategy.downloadObject({ key, maxBytes });

        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
    });

    it.each(['uploadObject', 'downloadObject', 'listObjects'] as const)('rejects invalid execution budget for %s before SDK access', async (operation) => {
        const execution = { timeoutMs: 0 };

        const result =
            operation === 'uploadObject'
                ? strategy.uploadObject({ key, body: Buffer.from('data'), execution })
                : operation === 'downloadObject'
                  ? strategy.downloadObject({ key, execution })
                  : strategy.listObjects({ prefix: 'records/', execution });

        await expect(result).rejects.toMatchObject({ code: 'BLOB_STORAGE_INVALID_REQUEST' });
        expect(sdk.fromConnectionString).not.toHaveBeenCalled();
    });
});
