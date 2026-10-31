<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import { nextTick, watch, onMounted } from 'vue';
import { createMermaidRenderer } from 'vitepress-mermaid-renderer';
import ArchipelHome from './ArchipelHome.vue';
import ApiMetaHeader from './ApiMetaHeader.vue';

const { Layout } = DefaultTheme;
const { frontmatter, isDark } = useData();

const initMermaid = (): void => {
    createMermaidRenderer({ theme: isDark.value ? 'dark' : 'forest' });
};

onMounted(() => nextTick(() => initMermaid()));
watch(
    () => isDark.value,
    () => nextTick(() => initMermaid()),
);
</script>

<template>
    <Layout>
        <template #home-hero-before>
            <ArchipelHome v-if="frontmatter.layout === 'home'" />
        </template>
        <template #home-hero-info><span></span></template>
        <template #home-hero-actions><span></span></template>
        <template #home-features-before><span></span></template>
        <template #home-features-after><span></span></template>
        <template #doc-before>
            <ApiMetaHeader />
        </template>
    </Layout>
</template>
