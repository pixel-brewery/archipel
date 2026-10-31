import matter from 'gray-matter';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { IPatternDoc } from './models/IPatternDoc.js';

/**
 * Loads and indexes Archipel code patterns from the `.docs/patterns/`
 * directory (monorepo dev) or from the bundled `data/patterns/` directory
 * (published npm package).
 */
export class PatternsLoader {
    // #region Fields

    private readonly _patterns = new Map<string, IPatternDoc>();

    // #endregion

    // #region Properties

    public get patterns(): ReadonlyMap<string, IPatternDoc> {
        return this._patterns;
    }

    // #endregion

    // #region Methods

    public load(): void {
        const patternsDirectory = this.resolvePatternsDirectory();

        if (!patternsDirectory) {
            process.stderr.write('[archipel-mcp] Warning: Could not locate patterns directory.\n');

            return;
        }

        const files = fs.readdirSync(patternsDirectory).filter((file) => file.endsWith('.md') && file !== 'index.md');

        for (const file of files) {
            const filePath = path.join(patternsDirectory, file);
            const raw = fs.readFileSync(filePath, 'utf-8');
            const parsed = matter(raw);
            const name = path.basename(file, '.md');

            this._patterns.set(name, {
                name,
                title: (parsed.data['title'] as string) || name,
                description: (parsed.data['description'] as string) || '',
                order: (parsed.data['order'] as number) || 999,
                content: parsed.content.trim(),
            });
        }

        process.stderr.write(`[archipel-mcp] Loaded ${this._patterns.size} pattern(s)\n`);
    }

    private resolvePatternsDirectory(): string | null {
        // 1. Bundled data (published npm package)
        const bundledPath = path.resolve(import.meta.dirname, '..', 'data', 'patterns');

        if (fs.existsSync(bundledPath)) {
            return bundledPath;
        }

        // 2. Workspace root (monorepo dev)
        const cwdPath = path.resolve(process.cwd(), '.docs', 'patterns');

        if (fs.existsSync(cwdPath)) {
            return cwdPath;
        }

        // 3. Relative from compiled source (dist/tools/mcp/src/)
        const relativePath = path.resolve(import.meta.dirname, '..', '..', '..', '..', '.docs', 'patterns');

        if (fs.existsSync(relativePath)) {
            return relativePath;
        }

        return null;
    }

    // #endregion
}
