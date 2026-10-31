import matter from 'gray-matter';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { IPackageDoc } from './models/IPackageDoc.js';

/**
 * Loads and indexes Archipel platform documentation from the `.docs/packages/`
 * directory (monorepo dev) or from the bundled `data/packages/` directory
 * (published npm package).
 */
export class DocsLoader {
    // #region Fields

    private readonly _packages = new Map<string, IPackageDoc>();

    // #endregion

    // #region Properties

    public get packages(): ReadonlyMap<string, IPackageDoc> {
        return this._packages;
    }

    // #endregion

    // #region Methods

    public load(): void {
        const docsDirectory = this.resolveDocsDirectory();

        if (!docsDirectory) {
            process.stderr.write('[archipel-mcp] Warning: Could not locate documentation directory.\n');

            return;
        }

        const entries = fs.readdirSync(docsDirectory, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isDirectory()) {
                continue;
            }

            const packageDirectory = path.join(docsDirectory, entry.name);
            const indexPath = path.join(packageDirectory, 'index.md');
            const apiDirectory = path.join(packageDirectory, 'api');
            const apiIndexPath = path.join(apiDirectory, 'index.md');
            const overviewPath = fs.existsSync(indexPath) ? indexPath : apiIndexPath;

            if (!fs.existsSync(overviewPath)) {
                continue;
            }

            const raw = fs.readFileSync(overviewPath, 'utf-8');
            const parsed = matter(raw);

            const apiContent = fs.existsSync(apiDirectory) ? this.loadApiDocs(apiDirectory, overviewPath === apiIndexPath ? 'index.md' : undefined) : '';

            this._packages.set(entry.name, {
                name: entry.name,
                title: (parsed.data['title'] as string) || entry.name,
                description: (parsed.data['description'] as string) || '',
                tags: (parsed.data['tags'] as string[]) || [],
                packageScope: (parsed.data['package'] as string) || `@pixel-brewery/archipel-${entry.name}`,
                content: parsed.content.trim(),
                apiContent,
            });
        }

        process.stderr.write(`[archipel-mcp] Loaded documentation for ${this._packages.size} package(s)\n`);
    }

    public search(query: string): IPackageDoc[] {
        const lowerQuery = query.toLowerCase();
        const results: IPackageDoc[] = [];

        for (const packageDoc of this._packages.values()) {
            if (
                packageDoc.name.toLowerCase().includes(lowerQuery) ||
                packageDoc.description.toLowerCase().includes(lowerQuery) ||
                packageDoc.content.toLowerCase().includes(lowerQuery) ||
                packageDoc.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
            ) {
                results.push(packageDoc);
            }
        }

        return results;
    }

    private loadApiDocs(apiDirectory: string, excludedFile?: string): string {
        const parts: string[] = [];
        const files = fs
            .readdirSync(apiDirectory)
            .filter((file) => file.endsWith('.md') && file !== excludedFile)
            .sort();

        for (const file of files) {
            const raw = fs.readFileSync(path.join(apiDirectory, file), 'utf-8');
            const parsed = matter(raw);
            parts.push(parsed.content.trim());
        }

        return parts.join('\n\n---\n\n');
    }

    private resolveDocsDirectory(): string | null {
        // 1. Bundled data (published npm package)
        const bundledPath = path.resolve(import.meta.dirname, '..', 'data', 'packages');

        if (fs.existsSync(bundledPath)) {
            return bundledPath;
        }

        // 2. Workspace root (monorepo dev)
        const cwdPath = path.resolve(process.cwd(), '.docs', 'packages');

        if (fs.existsSync(cwdPath)) {
            return cwdPath;
        }

        // 3. Relative from compiled source (dist/tools/mcp/src/)
        const relativePath = path.resolve(import.meta.dirname, '..', '..', '..', '..', '.docs', 'packages');

        if (fs.existsSync(relativePath)) {
            return relativePath;
        }

        return null;
    }

    // #endregion
}
