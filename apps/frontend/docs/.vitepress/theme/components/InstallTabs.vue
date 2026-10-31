<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, ref } from 'vue';

const { frontmatter } = useData();

const packageName = computed(() => (frontmatter.value.package as string) ?? '');

const tabs = computed(() => [
    { label: 'npm', command: `npm install ${packageName.value}` },
    { label: 'yarn', command: `yarn add ${packageName.value}` },
    { label: 'pnpm', command: `pnpm add ${packageName.value}` },
]);

const activeTab = ref(0);
const copied = ref(false);

function selectTab(index: number): void {
    activeTab.value = index;
    copied.value = false;
}

async function copyCommand(): Promise<void> {
    await navigator.clipboard.writeText(tabs.value[activeTab.value].command);
    copied.value = true;
    setTimeout(() => {
        copied.value = false;
    }, 2000);
}
</script>

<template>
    <div v-if="packageName" class="install-tabs">
        <div class="install-tabs__header">
            <div class="install-tabs__labels">
                <button v-for="(tab, i) in tabs" :key="tab.label" :class="['install-tabs__label', { active: activeTab === i }]" @click="selectTab(i)">
                    {{ tab.label }}
                </button>
            </div>
            <button class="install-tabs__copy" :title="copied ? 'Copied!' : 'Copy to clipboard'" @click="copyCommand">
                <span v-if="copied" class="install-tabs__copy-icon">✓</span>
                <span v-else class="install-tabs__copy-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                </span>
            </button>
        </div>
        <div class="install-tabs__code">
            <code>{{ tabs[activeTab].command }}</code>
        </div>
    </div>
</template>

<style scoped>
.install-tabs {
    margin: 16px 0 24px;
    border-radius: 8px;
    border: 1px solid var(--vp-c-divider);
    overflow: hidden;
    font-family: var(--vp-font-family-mono);
    font-size: 0.85rem;
    background: var(--vp-code-bg);
}

.install-tabs__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-alt);
    padding: 0 12px;
}

.install-tabs__labels {
    display: flex;
    gap: 0;
}

.install-tabs__label {
    padding: 8px 14px;
    border: none;
    background: none;
    color: var(--vp-c-text-2);
    cursor: pointer;
    font-size: 0.8rem;
    font-family: var(--vp-font-family-base);
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition:
        color 0.2s,
        border-color 0.2s;
}

.install-tabs__label:hover {
    color: var(--vp-c-text-1);
}

.install-tabs__label.active {
    color: var(--vp-c-brand-1);
    border-bottom-color: var(--vp-c-brand-1);
}

.install-tabs__copy {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    color: var(--vp-c-text-3);
    cursor: pointer;
    padding: 6px;
    border-radius: 4px;
    transition:
        color 0.2s,
        background 0.2s;
}

.install-tabs__copy:hover {
    color: var(--vp-c-text-1);
    background: var(--vp-c-bg-soft);
}

.install-tabs__copy-icon {
    display: flex;
    align-items: center;
    font-size: 0.85rem;
}

.install-tabs__code {
    padding: 14px 16px;
    overflow-x: auto;
    line-height: 1.6;
}

.install-tabs__code code {
    color: var(--vp-c-text-1);
    background: none;
    padding: 0;
    font-size: 0.85rem;
}
</style>
