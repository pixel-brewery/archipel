// #region Imports

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// #endregion

// #region Interfaces

interface IPackageManifest {
    readonly type?: string;
}

interface ITsConfig {
    readonly compilerOptions?: {
        readonly module?: string;
    };
}

// #endregion

// #region Constants

const SOURCE_ROOT = import.meta.dirname;
const PACKAGE_ROOT = resolve(SOURCE_ROOT, '..');
const COMMON_JS_RUNTIME_PATTERN =
    /\brequire\s*\(|\bmodule\.exports\b|\bexports\.[A-Za-z_$]|\b__dirname\b|\b__filename\b|import\s+[A-Za-z_$][\w$]*\s*=\s*require\s*\(/g;

// #endregion

// #region Methods

function collectRuntimeSourceFiles(directory: string): ReadonlyArray<string> {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);

        if (entry.isDirectory()) {
            return collectRuntimeSourceFiles(path);
        }

        return entry.isFile() && path.endsWith('.ts') && !path.endsWith('.spec.ts') && !path.endsWith('.d.ts') ? [path] : [];
    });
}

function readJson<TValue>(path: string): TValue {
    return JSON.parse(readFileSync(path, 'utf8')) as TValue;
}

// #endregion

describe('ESM-only package compatibility', () => {
    // #region Methods

    it('should declare an ESM package and NodeNext TypeScript output', () => {
        // arrange
        const packageManifest = readJson<IPackageManifest>(resolve(PACKAGE_ROOT, 'package.json'));
        const tsconfig = readJson<ITsConfig>(resolve(PACKAGE_ROOT, 'tsconfig.json'));

        // act
        const moduleConfiguration = {
            packageType: packageManifest.type?.toLowerCase(),
            typescriptModule: tsconfig.compilerOptions?.module?.toLowerCase(),
        };

        // assert
        expect(moduleConfiguration).toEqual({
            packageType: 'module',
            typescriptModule: 'nodenext',
        });
    });

    it('should contain no CommonJS runtime constructs', () => {
        // arrange
        const files = collectRuntimeSourceFiles(SOURCE_ROOT);

        // act
        const violations = files.flatMap((file) => {
            const source = readFileSync(file, 'utf8');

            return Array.from(source.matchAll(COMMON_JS_RUNTIME_PATTERN)).map((match) => `${relative(SOURCE_ROOT, file)}: ${match[0]}`);
        });

        // assert
        expect(violations).toEqual([]);
    });

    // #endregion
});
