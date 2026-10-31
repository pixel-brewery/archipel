// #region Imports

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readPackageVersion } from './readPackageVersion.js';

// #endregion

describe('readPackageVersion', () => {
    // #region Fields

    let temporaryDirectory: string;

    // #endregion

    // #region Methods

    beforeEach(() => {
        temporaryDirectory = mkdtempSync(path.join(tmpdir(), 'archipel-mcp-version-'));
        writeFileSync(path.join(temporaryDirectory, 'package.json'), JSON.stringify({ name: 'unrelated-workspace', version: '9.9.9' }));
    });

    afterEach(() => {
        rmSync(temporaryDirectory, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    function createPackage(metadata: unknown, packagePath = 'package', moduleName = 'readPackageVersion.js'): string {
        const packageDirectory: string = path.join(temporaryDirectory, packagePath);
        const modulePath: string = path.join(packageDirectory, 'src', 'utils', moduleName);
        mkdirSync(path.dirname(modulePath), { recursive: true });
        writeFileSync(path.join(packageDirectory, 'package.json'), JSON.stringify(metadata));

        return pathToFileURL(modulePath).href;
    }

    it.each([
        ['source', 'tools/mcp', 'readPackageVersion.ts'],
        ['build', 'dist/tools/mcp', 'readPackageVersion.js'],
        ['installed package', 'project with spaces/node_modules/@pixel-brewery/archipel-mcp', 'readPackageVersion.js'],
    ])('reads its own manifest in the %s layout', (_layout: string, packagePath: string, moduleName: string) => {
        // Arrange
        const moduleUrl: string = createPackage(
            { name: '@pixel-brewery/archipel-mcp', version: '2.4.6', description: 'Package metadata' },
            packagePath,
            moduleName,
        );

        // Act
        const version: string = readPackageVersion(moduleUrl);

        // Assert
        expect(version).toBe('2.4.6');
    });

    it.each(['0.1.23', '0.1.24', '1.2.3-rc.2+build.4'])('advertises the manifest version %s without replacing it', (expectedVersion: string) => {
        // Arrange
        const moduleUrl: string = createPackage({ name: '@pixel-brewery/archipel-mcp', version: expectedVersion });

        // Act
        const version: string = readPackageVersion(moduleUrl);

        // Assert
        expect(version).toBe(expectedVersion);
    });

    it.each(
        [
            null,
            [],
            'invalid metadata',
            { version: '1.2.3' },
            { name: 'unrelated-package', version: '1.2.3' },
            { name: '@pixel-brewery/archipel-mcp' },
            { name: '@pixel-brewery/archipel-mcp', version: 123 },
            { name: '@pixel-brewery/archipel-mcp', version: '' },
            { name: '@pixel-brewery/archipel-mcp', version: 'v1.2.3' },
            { name: '@pixel-brewery/archipel-mcp', version: '1.2' },
            { name: '@pixel-brewery/archipel-mcp', version: '01.2.3' },
            { name: '@pixel-brewery/archipel-mcp', version: '1.2.3-01' },
            { name: '@pixel-brewery/archipel-mcp', version: '1.2.3+' },
            { name: '@pixel-brewery/archipel-mcp', version: '1.2.3\n' },
            { name: '@pixel-brewery/archipel-mcp', version: ' 1.2.3' },
            { name: '@pixel-brewery/archipel-mcp', version: `1.2.3+${'a'.repeat(128)}` },
        ].map((metadata: unknown): [unknown] => [metadata]),
    )('rejects invalid package metadata %#', (metadata: unknown) => {
        // Arrange
        const moduleUrl: string = createPackage(metadata);

        // Act & Assert
        expect(() => readPackageVersion(moduleUrl)).toThrow('The Archipel MCP package metadata is invalid.');
    });

    it('rejects a missing manifest without using an ancestor package', () => {
        // Arrange
        const moduleUrl: string = pathToFileURL(path.join(temporaryDirectory, 'package', 'src', 'utils', 'readPackageVersion.js')).href;

        // Act & Assert
        expect(() => readPackageVersion(moduleUrl)).toThrow(/^The Archipel MCP package metadata could not be read\.$/);
    });

    it('rejects malformed JSON without including its contents in the error message', () => {
        // Arrange
        const moduleUrl: string = createPackage({});
        writeFileSync(new URL('../../package.json', moduleUrl), '{ invalid package metadata');

        // Act & Assert
        expect(() => readPackageVersion(moduleUrl)).toThrow(/^The Archipel MCP package metadata could not be read\.$/);
    });

    // #endregion
});
