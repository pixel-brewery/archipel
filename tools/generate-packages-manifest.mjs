#!/usr/bin/env node
/**
 * Generates a `packages-manifest.json` from `.docs/packages/` frontmatter.
 *
 * This manifest is consumed by external systems (e.g., WordPress) that need
 * a dynamic list of all Archipel platform packages without manually maintaining
 * a hardcoded array.
 *
 * Usage:
 *   node tools/generate-packages-manifest.mjs
 *
 * Output:
 *   dist/packages-manifest.json
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const DOCS_PACKAGES_DIR = path.join(ROOT_DIR, '.docs', 'packages');
const OUTPUT_DIR = path.join(ROOT_DIR, 'dist');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'packages-manifest.json');

/**
 * Parses YAML frontmatter from a markdown file.
 * @param {string} content - The file content.
 * @returns {Record<string, unknown>} The parsed frontmatter.
 */
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};

    const yaml = match[1];
    const data = {};

    for (const line of yaml.split('\n')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // Handle arrays like [tag1, tag2, tag3]
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value
                .slice(1, -1)
                .split(',')
                .map((v) => v.trim());
        }
        // Handle quoted strings
        else if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
            value = value.slice(1, -1);
        }
        // Handle numbers
        else if (!isNaN(Number(value)) && value !== '') {
            value = Number(value);
        }

        data[key] = value;
    }

    return data;
}

/**
 * Determines the emoji icon for a package based on its name/tags.
 * @param {string} name - Package name.
 * @param {string[]} tags - Package tags.
 * @returns {string} An emoji representing the package.
 */
function getPackageIcon(name, tags = []) {
    const iconMap = {
        'platform-core': '⚡',
        'platform-analytics': '📡',
        'platform-authentication': '🔐',
        'platform-blob-storage': '☁️',
        'platform-bootstrap': '🚀',
        'platform-caching': '🗃️',
        'platform-configuration': '⚙️',
        'platform-cryptography': '🔑',
        'platform-database': '🗄️',
        'platform-documents': '📄',
        'platform-esigning': '✍️',
        'platform-feature-flags': '🚩',
        'platform-health': '💚',
        'platform-intelligence': '🧠',
        'platform-logging': '📝',
        'platform-mailing': '✉️',
        'platform-mapping': '🗺️',
        'platform-mcp': '🔌',
        'platform-openapi': '📖',
        'platform-payments': '💳',
        'platform-queue': '📬',
        'platform-reporting': '📊',
        'platform-resources': '📦',
        'platform-telemetry': '📈',
    };

    return iconMap[name] || '📦';
}

/**
 * Main function to generate the packages manifest.
 */
function main() {
    if (!fs.existsSync(DOCS_PACKAGES_DIR)) {
        console.error(`Error: Documentation directory not found: ${DOCS_PACKAGES_DIR}`);
        process.exit(1);
    }

    const entries = fs.readdirSync(DOCS_PACKAGES_DIR, { withFileTypes: true });
    const packages = [];

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const indexPath = path.join(DOCS_PACKAGES_DIR, entry.name, 'index.md');
        if (!fs.existsSync(indexPath)) continue;

        const content = fs.readFileSync(indexPath, 'utf-8');
        const frontmatter = parseFrontmatter(content);

        const name = entry.name;
        const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

        packages.push({
            name,
            title: frontmatter.title || name,
            description: frontmatter.description || '',
            package: frontmatter.package || `@pixel-brewery/archipel-${name}`,
            order: typeof frontmatter.order === 'number' ? frontmatter.order : 999,
            tags,
            icon: getPackageIcon(name, tags),
            status: 'STABLE',
            docsUrl: `https://pixel-brewery.github.io/archipel/packages/${name}/`,
            npmUrl: `https://github.com/orgs/pixel-brewery/packages/npm/package/archipel-${name}`,
        });
    }

    // Sort by order, then alphabetically by name
    packages.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.name.localeCompare(b.name);
    });

    const manifest = {
        generatedAt: new Date().toISOString(),
        count: packages.length,
        packages,
    };

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

    console.log(`✅ Generated packages manifest with ${packages.length} packages`);
    console.log(`   Output: ${OUTPUT_FILE}`);

    // Also output to stdout for CI pipelines
    console.log('\nPackages (sorted by order):');
    for (const pkg of packages) {
        console.log(`  ${pkg.icon} ${pkg.name} (order: ${pkg.order})`);
    }
}

main();
