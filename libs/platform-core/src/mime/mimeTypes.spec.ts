// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMimeTypeByFileNameOrExtension } from './mimeTypes.js';

// #endregion

// #region Tests

describe('getMimeTypeByFileNameOrExtension', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return the MIME type for a known file extension', () => {
        // act
        const result = getMimeTypeByFileNameOrExtension('.json');

        // assert
        expect(result).toBe('application/json');
    });

    it('should return the MIME type for a filename', () => {
        // act
        const result = getMimeTypeByFileNameOrExtension('image.png');

        // assert
        expect(result).toBe('image/png');
    });

    it('should return the MIME type for html', () => {
        // act
        const result = getMimeTypeByFileNameOrExtension('page.html');

        // assert
        expect(result).toBe('text/html');
    });

    it('should return false for an unknown extension', () => {
        // act
        const result = getMimeTypeByFileNameOrExtension('.xyz_unknown');

        // assert
        expect(result).toBe(false);
    });

    it('should return the MIME type for pdf', () => {
        // act
        const result = getMimeTypeByFileNameOrExtension('document.pdf');

        // assert
        expect(result).toBe('application/pdf');
    });
});

// #endregion
