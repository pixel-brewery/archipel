import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import ApiMetaHeader from './components/ApiMetaHeader.vue';
import ApiOverview from './components/ApiOverview.vue';
import ArchipelLayout from './components/ArchipelLayout.vue';
import InstallTabs from './components/InstallTabs.vue';
import PackagesOverview from './components/PackagesOverview.vue';
import './style.css';

export default {
    extends: DefaultTheme,
    Layout: ArchipelLayout,
    enhanceApp({ app }) {
        app.component('ApiMetaHeader', ApiMetaHeader);
        app.component('ApiOverview', ApiOverview);
        app.component('InstallTabs', InstallTabs);
        app.component('PackagesOverview', PackagesOverview);
    },
} satisfies Theme;
