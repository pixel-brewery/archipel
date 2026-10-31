// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { BlobTemplateFetchStrategy } from './BlobTemplateFetchStrategy.js';

// #endregion

// #region Tests

describe('BlobTemplateFetchStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should load html and txt templates from blob storage', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockImplementation((key: string) => {
                if (key === 'templates/templates.json') {
                    return Promise.resolve({ data: ['templates/Welcome.html', 'templates/Welcome.txt'] });
                }
                if (key === 'templates/Welcome.html') {
                    return Promise.resolve({ data: '<h1>Welcome</h1>' });
                }
                if (key === 'templates/Welcome.txt') {
                    return Promise.resolve({ data: 'Welcome' });
                }
                return Promise.resolve({ data: '' });
            }),
        } as never;
        const strategy = new BlobTemplateFetchStrategy(blobService);

        // act
        const result = await strategy.load();

        // assert
        expect(result['Welcome']).toBeDefined();
        expect(result['Welcome'].html).toBe('<h1>Welcome</h1>');
        expect(result['Welcome'].txt).toBe('Welcome');
    });

    it('should handle empty file list', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockResolvedValue({ data: [] }),
        } as never;
        const strategy = new BlobTemplateFetchStrategy(blobService);

        // act
        const result = await strategy.load();

        // assert
        expect(Object.keys(result)).toHaveLength(0);
    });

    it('should group html and txt variants under the same template name', async () => {
        // arrange
        const blobService = {
            downloadFile: vi.fn().mockImplementation((key: string) => {
                if (key === 'templates/templates.json') {
                    return Promise.resolve({ data: ['Auth.html', 'Auth.txt', 'Invite.html'] });
                }
                if (key === 'Auth.html') return Promise.resolve({ data: '<p>Auth HTML</p>' });
                if (key === 'Auth.txt') return Promise.resolve({ data: 'Auth text' });
                if (key === 'Invite.html') return Promise.resolve({ data: '<p>Invite</p>' });
                return Promise.resolve({ data: '' });
            }),
        } as never;
        const strategy = new BlobTemplateFetchStrategy(blobService);

        // act
        const result = await strategy.load();

        // assert
        expect(result['Auth'].html).toBe('<p>Auth HTML</p>');
        expect(result['Auth'].txt).toBe('Auth text');
        expect(result['Invite'].html).toBe('<p>Invite</p>');
        expect(result['Invite'].txt).toBeUndefined();
    });
});

// #endregion
