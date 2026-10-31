<script setup lang="ts">
import { withBase } from 'vitepress';
import { computed, onMounted, ref } from 'vue';

interface IApiIndexEntry {
    id: string;
    name: string;
    kind: string;
    kindLabel: string;
    packageName: string;
    packageSlug: string;
    title: string;
    description: string;
    link: string;
}

interface IApiIndexPayload {
    total: number;
    byKind: Record<string, number>;
    byPackage: Record<string, number>;
    entries: IApiIndexEntry[];
}

const KIND_ABBREVIATIONS: Record<string, string> = {
    class: 'C',
    interface: 'I',
    'type-alias': 'T',
    namespace: 'N',
    function: 'F',
    enum: 'E',
    variable: 'V',
    other: 'O',
};

const query = ref<string>('');
const selectedPackage = ref<string>('all');
const activeKind = ref<string>('all');
const isLoading = ref<boolean>(true);
const loadingError = ref<string>('');
const payload = ref<IApiIndexPayload | null>(null);

const packageOptions = computed((): string[] => {
    if (!payload.value) {
        return [];
    }

    return Object.keys(payload.value.byPackage).sort((left, right) => left.localeCompare(right));
});

const kindOptions = computed((): Array<{ key: string; label: string; abbreviation: string; count: number }> => {
    if (!payload.value) {
        return [];
    }

    return Object.keys(payload.value.byKind)
        .sort((left, right) => left.localeCompare(right))
        .map((key) => ({
            key,
            label: key.replace('-', ' '),
            abbreviation: KIND_ABBREVIATIONS[key] ?? key.charAt(0).toUpperCase(),
            count: payload.value!.byKind[key],
        }));
});

const filteredEntries = computed((): IApiIndexEntry[] => {
    if (!payload.value) {
        return [];
    }

    const normalizedQuery = query.value.trim().toLowerCase();

    return payload.value.entries.filter((entry) => {
        if (selectedPackage.value !== 'all' && entry.packageSlug !== selectedPackage.value) {
            return false;
        }

        if (activeKind.value !== 'all' && entry.kind !== activeKind.value) {
            return false;
        }

        if (!normalizedQuery) {
            return true;
        }

        const searchable = `${entry.name} ${entry.kindLabel} ${entry.packageSlug} ${entry.description}`.toLowerCase();
        return searchable.includes(normalizedQuery);
    });
});

const groupedEntries = computed((): Array<{ packageSlug: string; packageName: string; entries: IApiIndexEntry[] }> => {
    const groups = new Map<string, { packageName: string; entries: IApiIndexEntry[] }>();

    for (const entry of filteredEntries.value) {
        let group = groups.get(entry.packageSlug);

        if (!group) {
            group = { packageName: entry.packageName, entries: [] };
            groups.set(entry.packageSlug, group);
        }

        group.entries.push(entry);
    }

    return Array.from(groups.entries())
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([slug, data]) => ({ packageSlug: slug, ...data }));
});

const resultCount = computed((): number => filteredEntries.value.length);

function toggleKind(kind: string): void {
    activeKind.value = activeKind.value === kind ? 'all' : kind;
}

function getAbbreviation(kind: string): string {
    return KIND_ABBREVIATIONS[kind] ?? kind.charAt(0).toUpperCase();
}

onMounted(async () => {
    try {
        const response = await fetch(withBase('/api/api-index.json'));

        if (!response.ok) {
            throw new Error(`Unable to load API index (${response.status}).`);
        }

        payload.value = (await response.json()) as IApiIndexPayload;
    } catch (error: unknown) {
        loadingError.value = error instanceof Error ? error.message : 'Unknown error while loading API index.';
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <section class="api-ref">
        <header class="api-ref__header">
            <h1 class="api-ref__title">API Reference</h1>
        </header>

        <div class="api-ref__toolbar">
            <div class="api-ref__search-row">
                <div class="api-ref__search-field">
                    <svg
                        class="api-ref__search-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input v-model="query" type="search" class="api-ref__search-input" placeholder="Filter" />
                </div>

                <select v-model="selectedPackage" class="api-ref__package-select">
                    <option value="all">All Packages</option>
                    <option v-for="packageName in packageOptions" :key="packageName" :value="packageName">
                        {{ packageName }}
                    </option>
                </select>
            </div>

            <p class="api-ref__filter-label">Filter by Identifier type</p>

            <div class="api-ref__kind-chips" role="listbox" aria-label="Kind selection">
                <button
                    v-for="kind in kindOptions"
                    :key="kind.key"
                    :class="['api-ref__kind-chip', `api-ref__kind-chip--${kind.key}`, { 'api-ref__kind-chip--active': activeKind === kind.key }]"
                    role="option"
                    :aria-selected="activeKind === kind.key"
                    @click="toggleKind(kind.key)"
                >
                    <span class="api-ref__kind-abbr">{{ kind.abbreviation }}</span>
                    <span class="api-ref__kind-name">{{ kind.label }}</span>
                </button>
            </div>
        </div>

        <p v-if="loadingError" class="api-ref__error">{{ loadingError }}</p>

        <div v-if="isLoading" class="api-ref__loading">Loading API index…</div>

        <div v-else-if="groupedEntries.length > 0" class="api-ref__results">
            <p class="api-ref__count">{{ resultCount }} results</p>

            <section v-for="group in groupedEntries" :key="group.packageSlug" class="api-ref__group">
                <header class="api-ref__group-header">
                    <h3 class="api-ref__group-title">
                        <a :href="withBase(`/packages/${group.packageSlug}/`)">{{ group.packageName }}</a>
                    </h3>
                </header>

                <ul class="api-ref__group-list">
                    <li v-for="entry in group.entries" :key="entry.id" class="api-ref__entry">
                        <a :href="withBase(`${entry.link}.html`)" class="api-ref__entry-link">
                            <span :class="['api-ref__entry-badge', `api-ref__entry-badge--${entry.kind}`]">{{ getAbbreviation(entry.kind) }}</span>
                            <span class="api-ref__entry-name">{{ entry.name }}</span>
                        </a>
                    </li>
                </ul>
            </section>
        </div>

        <p v-else class="api-ref__empty">No API symbols match your current filters.</p>
    </section>
</template>
