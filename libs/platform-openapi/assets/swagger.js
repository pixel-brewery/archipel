(function () {
    'use strict';

    // Inject viewport meta tag for responsive design
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width,initial-scale=1,maximum-scale=1.0,user-scalable=no,viewport-fit=cover';

    // Insert as first meta tag in head or append if no meta tags exist
    const head = document.head || document.getElementsByTagName('head')[0];
    const firstMeta = head.querySelector('meta');

    if (firstMeta) {
        head.insertBefore(viewport, firstMeta);
    } else {
        head.appendChild(viewport);
    }
})();
