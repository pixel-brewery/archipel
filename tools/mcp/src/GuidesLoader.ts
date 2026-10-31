import matter from 'gray-matter';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { IGuideDoc } from './models/IGuideDoc.js';

/**
 * Loads and indexes Archipel platform guides from the `.docs/guides/`
 * directory (monorepo dev) or from the bundled `data/guides/` directory
 * (published npm package).
 */
export class GuidesLoader {
    // #region Fields

    private readonly _guides = new Map<string, IGuideDoc>();

    // #endregion

    // #region Properties

    public get guides(): ReadonlyMap<string, IGuideDoc> {
        return this._guides;
    }

    // #endregion

    // #region Methods

    public load(): void {
        const guidesDirectory = this.resolveGuidesDirectory();

        if (!guidesDirectory) {
            process.stderr.write('[archipel-mcp] Warning: Could not locate guides directory.\n');

            return;
        }

        const files = fs.readdirSync(guidesDirectory).filter((file) => file.endsWith('.md') && file !== 'index.md');

        for (const file of files) {
            const filePath = path.join(guidesDirectory, file);
            const raw = fs.readFileSync(filePath, 'utf-8');
            const parsed = matter(raw);
            const name = path.basename(file, '.md');

            this._guides.set(name, {
                name,
                title: (parsed.data['title'] as string) || name,
                description: (parsed.data['description'] as string) || '',
                order: (parsed.data['order'] as number) || 999,
                content: parsed.content.trim(),
            });
        }

        process.stderr.write(`[archipel-mcp] Loaded ${this._guides.size} guide(s)\n`);
    }

    public search(query: string): IGuideDoc[] {
        const lowerQuery = query.toLowerCase();
        const results: IGuideDoc[] = [];

        for (const guide of this._guides.values()) {
            if (
                guide.name.toLowerCase().includes(lowerQuery) ||
                guide.title.toLowerCase().includes(lowerQuery) ||
                guide.description.toLowerCase().includes(lowerQuery) ||
                guide.content.toLowerCase().includes(lowerQuery)
            ) {
                results.push(guide);
            }
        }

        return results.sort((a, b) => a.order - b.order);
    }

    private resolveGuidesDirectory(): string | null {
        // 1. Bundled data (published npm package)
        const bundledPath = path.resolve(import.meta.dirname, '..', 'data', 'guides');

        if (fs.existsSync(bundledPath)) {
            return bundledPath;
        }

        // 2. Workspace root (monorepo dev)
        const cwdPath = path.resolve(process.cwd(), '.docs', 'guides');

        if (fs.existsSync(cwdPath)) {
            return cwdPath;
        }

        // 3. Relative from compiled source (dist/tools/mcp/src/)
        const relativePath = path.resolve(import.meta.dirname, '..', '..', '..', '..', '.docs', 'guides');

        if (fs.existsSync(relativePath)) {
            return relativePath;
        }

        return null;
    }

    // #endregion
}
