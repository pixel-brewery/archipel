// #region Imports

import { readFileSync } from 'node:fs';
import { z } from 'zod';

// #endregion

// #region Fields

const packageMetadataSchema = z
    .object({
        name: z.literal('@pixel-brewery/archipel-mcp'),
        version: z
            .string()
            .max(128)
            .regex(
                /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*)?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?(?![\s\S])/,
            ),
    })
    .passthrough();

// #endregion

// #region Methods

/**
 * Reads the version advertised by this MCP package from its own package manifest.
 *
 * @public
 * @param moduleUrl - The reader module URL; defaults to this source or installed module.
 * @returns The package's validated semantic version, including any prerelease or build identifiers.
 * @throws An Error when the package manifest is unreadable, invalid JSON, or invalid package metadata.
 * @remarks The fixed relative path supports source, build and installed layouts without using the working directory or searching ancestor packages.
 */
export function readPackageVersion(moduleUrl: string = import.meta.url): string {
    let rawMetadata: unknown;

    try {
        rawMetadata = JSON.parse(readFileSync(new URL('../../package.json', moduleUrl), 'utf8'));
    } catch (cause: unknown) {
        throw new Error('The Archipel MCP package metadata could not be read.', { cause });
    }

    const metadata = packageMetadataSchema.safeParse(rawMetadata);

    if (!metadata.success) {
        throw new Error('The Archipel MCP package metadata is invalid.');
    }

    return metadata.data.version;
}

// #endregion
