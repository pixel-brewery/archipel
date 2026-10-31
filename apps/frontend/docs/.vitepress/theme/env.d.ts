declare module '*.vue' {
    const component: import('vue').DefineComponent<Record<string, never>, Record<string, never>, unknown>;

    export default component;
}

declare module 'virtual:packages-data' {
    const packagesData: import('../plugins/packagesLoader.js').IPackagesData;

    export default packagesData;
}
