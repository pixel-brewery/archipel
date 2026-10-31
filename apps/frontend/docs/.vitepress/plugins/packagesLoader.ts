/**
 * packagesLoader.ts
 *
 * Build-time loader that scans libs/platform-{name}/package.json and extracts metadata.
 * This runs ONCE at VitePress build time, not at runtime.
 *
 * **100% Dynamic**: All package metadata comes directly from each library's
 * package.json. No static arrays to maintain here.
 *
 * Required package.json fields (under `archipel` namespace):
 * - `archipel.category`: Category name (e.g., "Foundation", "Infrastructure")
 * - `archipel.featured`: Optional boolean to highlight important packages
 */

import fs from 'node:fs';
import path from 'node:path';

export interface IPackageInfo {
    slug: string;
    name: string;
    description: string;
    keywords: string[];
    category: string;
    featured: boolean;
}

export interface ICategoryInfo {
    title: string;
    packages: IPackageInfo[];
}

export interface IPackagesData {
    packages: IPackageInfo[];
    categories: ICategoryInfo[];
    count: number;
}

/**
 * Loads all package metadata from libs at build time.
 * This function is called ONCE during VitePress build, not at runtime.
 */
export function loadPackagesAtBuildTime(_docsRoot: string, configDir: string): IPackagesData {
    // Go from .vitepress → docs → frontend → apps → root → libs
    const libsDir = path.resolve(configDir, '../../../../libs');
    const packages: IPackageInfo[] = [];

    if (!fs.existsSync(libsDir)) {
        console.warn('[packagesLoader] Libs directory not found:', libsDir);
        return { packages: [], categories: [], count: 0 };
    }

    const dirs = fs
        .readdirSync(libsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name.startsWith('platform-'))
        .map((d) => d.name)
        .sort();

    for (const dir of dirs) {
        const packageJsonPath = path.join(libsDir, dir, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            console.warn('[packagesLoader] Missing package.json for', dir);
            continue;
        }

        const content = fs.readFileSync(packageJsonPath, 'utf-8');
        const pkg = JSON.parse(content) as {
            name?: string;
            description?: string;
            keywords?: string[];
            archipel?: {
                category?: unknown;
                featured?: unknown;
            };
        };

        const archipelConfig = pkg.archipel;
        if (!archipelConfig || typeof archipelConfig.category !== 'string' || archipelConfig.category.trim().length === 0) {
            throw new Error(`[packagesLoader] ${dir}/package.json is missing required archipel.category metadata.`);
        }

        if (archipelConfig.featured !== undefined && typeof archipelConfig.featured !== 'boolean') {
            throw new Error(`[packagesLoader] ${dir}/package.json archipel.featured must be a boolean when present.`);
        }

        packages.push({
            slug: dir,
            name: pkg.name || '@pixel-brewery/archipel-' + dir,
            description: pkg.description || '',
            keywords: Array.isArray(pkg.keywords) ? pkg.keywords : [],
            category: archipelConfig.category,
            featured: archipelConfig.featured === true,
        });
    }

    // Sort: featured first, then alphabetically
    packages.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.slug.localeCompare(b.slug);
    });

    // Build categories from package data
    const categoryMap = new Map<string, IPackageInfo[]>();
    for (const pkg of packages) {
        const categoryPackages = categoryMap.get(pkg.category);
        if (categoryPackages) {
            categoryPackages.push(pkg);
        } else {
            categoryMap.set(pkg.category, [pkg]);
        }
    }

    // Convert map to array, sorting categories alphabetically.
    const categories: ICategoryInfo[] = [];
    const sortedCategoryNames = [...categoryMap.keys()].sort((firstCategory, secondCategory) => firstCategory.localeCompare(secondCategory));

    for (const catName of sortedCategoryNames) {
        const pkgs = categoryMap.get(catName);
        if (pkgs && pkgs.length > 0) {
            categories.push({
                title: catName,
                packages: pkgs,
            });
        }
    }

    console.log('[packagesLoader] Loaded', packages.length, 'packages in', categories.length, 'categories from libs/');

    return { packages, categories, count: packages.length };
}
