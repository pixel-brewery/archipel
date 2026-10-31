<script setup lang="ts">
import { withBase } from 'vitepress';
import packagesData from 'virtual:packages-data';
import { computed, ref } from 'vue';

/**
 * Categories are 100% dynamic - they come from each library's
 * package.json `archipel.category` field. No static arrays here!
 */

const query = ref<string>('');

const packagesByCategory = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase();

    // Filter packages based on search query, then group by category
    return packagesData.categories
        .map((category) => {
            const filteredPackages = category.packages.filter(
                (p) =>
                    !normalizedQuery ||
                    p.slug.toLowerCase().includes(normalizedQuery) ||
                    p.description.toLowerCase().includes(normalizedQuery) ||
                    p.keywords.some((kw) => kw.toLowerCase().includes(normalizedQuery)),
            );

            return { ...category, packages: filteredPackages };
        })
        .filter((c) => c.packages.length > 0);
});
</script>

<template>
    <div class="packages-overview">
        <p>
            Archipel is organized into <strong>{{ packagesData.count }}</strong> independent NestJS modules. Each package can be installed and used on its own —
            you only pull in what you need.
        </p>
        <p>
            Every package follows the same structure: a dynamic NestJS module with <code>register()</code> configuration, abstract ports for contracts you
            implement, and concrete services you consume.
        </p>

        <div class="packages-search">
            <input v-model="query" type="text" placeholder="Filter packages..." class="packages-search-input" />
        </div>

        <template v-for="category in packagesByCategory" :key="category.title">
            <h2>{{ category.title }}</h2>
            <table class="packages-table">
                <thead>
                    <tr>
                        <th>Package</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pkg in category.packages" :key="pkg.slug">
                        <td>
                            <a :href="withBase(`/packages/${pkg.slug}/api/`)"
                                ><code>{{ pkg.slug }}</code></a
                            >
                        </td>
                        <td>{{ pkg.description }}</td>
                    </tr>
                </tbody>
            </table>
        </template>
    </div>
</template>

<style scoped>
.packages-overview {
    margin-top: 1rem;
}

.packages-search {
    margin: 1.5rem 0;
}

.packages-search-input {
    width: 100%;
    max-width: 400px;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--archipel-border-subtle);
    border-radius: 8px;
    background: var(--archipel-bg-elevated);
    color: var(--archipel-text);
    font-size: 0.9rem;
    outline: none;
    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}

.packages-search-input:focus {
    border-color: var(--sw-electric-cyan);
    box-shadow: 0 0 8px rgba(0, 240, 255, 0.2);
}

.packages-search-input::placeholder {
    color: var(--archipel-text-faint);
}

.packages-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0 2rem;
}

.packages-table th,
.packages-table td {
    padding: 0.5rem 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--archipel-border-subtle);
}

.packages-table th {
    font-family: var(--archipel-font-display);
    font-weight: 600;
    color: var(--sw-neon-magenta);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
}

.packages-table td:first-child {
    white-space: nowrap;
}

.packages-table td a {
    color: var(--sw-electric-cyan);
    text-decoration: none;
    transition: text-shadow 0.15s ease;
}

.packages-table td a:hover {
    text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}
</style>
