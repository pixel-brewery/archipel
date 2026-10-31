import { DocumentErrorBase } from './abstracts/DocumentErrorBase.js';

/**
 * Thrown when image processing fails.
 *
 * @public
 */
export class ImageProcessingError extends DocumentErrorBase {
    // #region Ctor

    public constructor(message: string, cause?: unknown) {
        super(message, 'IMAGE_PROCESSING', cause);
        this.name = 'ImageProcessingError';
    }

    // #endregion
}
