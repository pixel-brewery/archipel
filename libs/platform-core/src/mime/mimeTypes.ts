// #region Imports

import { lookup } from 'mime-types';

// #endregion

/**
 * Get MIME type by file name or extension.
 *
 * @public
 * @param args - Arguments for mime-types lookup
 * @returns MIME type or false if not found
 */
export function getMimeTypeByFileNameOrExtension(...args: Parameters<typeof lookup>): ReturnType<typeof lookup> {
    return lookup(...args);
}
