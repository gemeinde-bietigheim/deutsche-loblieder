/Zoom Eaep Bietigheim/deutsche-loblieder/js/dynamic-manifest.js
// Dynamic manifest generation for individual hymn pages
(function() {
    'use strict';

    // Only run on hymn pages (not on index)
    if (!document.querySelector('.song-page')) return;

    function generateDynamicManifest() {
        // Extract hymn information from the page
        const hymnTitle = document.querySelector('.song-header h1')?.textContent || 'Hymn';
        const hymnMeta = document.querySelector('.song-meta')?.textContent || '';
        const hymnNumber = hymnTitle.match(/^\d+/)?.[0] || 'unknown';
        
        // Get the current page path to determine language
        const currentPath = window.location.pathname;
        let language = 'en';
        let folderName = 'english-hymns';
        
        if (currentPath.includes('deutsche-lieder')) {
            language = 'de';
            folderName = 'deutsche-lieder';
        } else if (currentPath.includes('griechische-lieder')) {
            language = 'el';
            folderName = 'griechische-lieder';
        }

        // Create manifest object
        const manifest = {
            "name": hymnTitle,
            "short_name": hymnTitle.substring(0, 30),
            "description": hymnMeta,
            "start_url": window.location.pathname,
            "scope": "../",
            "display": "standalone",
            "background_color": "#5c371f",
            "theme_color": "#5c371f",
            "orientation": "portrait",
            "lang": language,
            "dir": "ltr",
            "icons": [
                {
                    "src": "../assets/logo.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "any maskable"
                },
                {
                    "src": "../assets/logo.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any maskable"
                }
            ],
            "categories": ["music", "religion", "hymns"],
            "shortcuts": [
                {
                    "name": "Back to Index",
                    "short_name": "Index",
                    "description": "Return to hymns list",
                    "url": "../index.html",
                    "icons": [{ "src": "../assets/logo.png", "sizes": "96x96" }]
                }
            ]
        };

        // Convert to JSON and create blob
        const manifestJSON = JSON.stringify(manifest, null, 2);
        const blob = new Blob([manifestJSON], { type: 'application/json' });
        const manifestURL = URL.createObjectURL(blob);

        // Remove existing manifest link if any
        const existingManifest = document.querySelector('link[rel="manifest"]');
        if (existingManifest) {
            existingManifest.remove();
        }

        // Add new manifest link
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = manifestURL;
        document.head.appendChild(manifestLink);

        console.log('Dynamic manifest generated:', manifest);

        // Update meta tags for better PWA support
        updateMetaTags(hymnTitle);
    }

    function updateMetaTags(title) {
        // Update apple-mobile-web-app-title
        let appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
        if (appleTitleMeta) {
            appleTitleMeta.content = title;
        } else {
            appleTitleMeta = document.createElement('meta');
            appleTitleMeta.name = 'apple-mobile-web-app-title';
            appleTitleMeta.content = title;
            document.head.appendChild(appleTitleMeta);
        }

        // Update og:title for better sharing
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = title;
        } else {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            ogTitle.content = title;
            document.head.appendChild(ogTitle);
        }

        // Add og:description
        const description = document.querySelector('.song-meta')?.textContent;
        if (description) {
            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) {
                ogDesc.content = description;
            } else {
                ogDesc = document.createElement('meta');
                ogDesc.setAttribute('property', 'og:description');
                ogDesc.content = description;
                document.head.appendChild(ogDesc);
            }
        }
    }

    // Generate manifest when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', generateDynamicManifest);
    } else {
        generateDynamicManifest();
    }

})();