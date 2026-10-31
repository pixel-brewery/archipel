// #region Imports

import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import type { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BlobDownloadResponseTypes } from '../../interfaces/IBlobProvider.js';
import { VERCEL_BLOB_BUCKET, VERCEL_BLOB_PUBLIC_URL, VERCEL_BLOB_READ_WRITE_TOKEN, VERCEL_BLOB_REGION, VERCEL_BLOB_URL } from './env.js';
import { VercelBlobStorageStrategy } from './VercelBlobStorageStrategy.js';

// #endregion

describe('VercelBlobStorageStrategy', () => {
    // #region Fields

    let get: ReturnType<typeof vi.fn>;
    let strategy: VercelBlobStorageStrategy;

    // #endregion

    // #region Methods

    beforeEach(() => {
        get = vi.fn().mockReturnValue(
            of({
                data: Buffer.from('data'),
                headers: { 'content-length': '4', 'content-type': 'application/octet-stream' },
            }),
        );
        const configService = {
            get: vi.fn((key: string) => {
                if (key === VERCEL_BLOB_URL.key) return 'https://api.example.test';
                if (key === VERCEL_BLOB_READ_WRITE_TOKEN.key) return 'secret';
                return undefined;
            }),
            tryGet: vi.fn((key: string) => {
                if (key === VERCEL_BLOB_BUCKET.key) return '';
                if (key === VERCEL_BLOB_REGION.key) return '';
                if (key === VERCEL_BLOB_PUBLIC_URL.key) return '';
                return undefined;
            }),
        };

        strategy = new VercelBlobStorageStrategy({ get } as unknown as HttpService, configService as unknown as ConfigService);
    });

    describe('downloadObject', () => {
        it('should download unspecified blob content as binary data', async () => {
            // act
            await strategy.downloadObject({ key: 'documents/report.pdf' });

            // assert
            expect(get).toHaveBeenCalledWith('https://api.example.test/documents/report.pdf', expect.objectContaining({ responseType: 'arraybuffer' }));
        });

        it('should preserve an explicitly requested JSON response type', async () => {
            // act
            await strategy.downloadObject({
                key: 'documents/metadata.json',
                responseType: BlobDownloadResponseTypes.Json,
            });

            // assert
            expect(get).toHaveBeenCalledWith('https://api.example.test/documents/metadata.json', expect.objectContaining({ responseType: 'json' }));
        });
    });

    // #endregion

    describe('listObjects', () => {
        it('should map the provider listing onto the storage contract', async () => {
            get.mockReturnValue(
                of({
                    data: {
                        blobs: [
                            { pathname: 'leads/7/a.pdf', size: 12, uploadedAt: '2026-08-01T10:00:00.000Z' },
                            { pathname: 'leads/8/b.pdf', size: 34 },
                        ],
                        cursor: 'next-cursor',
                        hasMore: true,
                    },
                }),
            );

            const result = await strategy.listObjects({ prefix: 'leads/', maxKeys: 50 });

            expect(get).toHaveBeenCalledWith(
                'https://api.example.test/',
                expect.objectContaining({ params: { prefix: 'leads/', cursor: undefined, limit: 50 } }),
            );
            expect(result.entries).toEqual([
                { key: 'leads/7/a.pdf', size: 12, lastModified: new Date('2026-08-01T10:00:00.000Z') },
                { key: 'leads/8/b.pdf', size: 34, lastModified: undefined },
            ]);
            expect(result.continuationToken).toBe('next-cursor');
        });

        it('should end the listing when the provider reports no further page', async () => {
            get.mockReturnValue(of({ data: { blobs: [], cursor: 'ignored', hasMore: false } }));

            const result = await strategy.listObjects({});

            expect(result.entries).toEqual([]);
            expect(result.continuationToken).toBeUndefined();
        });

        it('should tolerate a response without a blobs array', async () => {
            get.mockReturnValue(of({ data: {} }));

            const result = await strategy.listObjects({});

            expect(result.entries).toEqual([]);
        });
    });
});
