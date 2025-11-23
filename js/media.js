iosifgogolos/Desktop/Zoom Eaep Bietigheim/deutsche-loblieder/js/media.js
// Media functionality for hymn pages
(function() {
    'use strict';

    console.log('Media.js loaded successfully');

    // Share functionality - Make it globally accessible
    window.shareHymn = function() {
        console.log('shareHymn() called');
        
        const hymTitle = document.querySelector('.song-header h1')?.textContent || 'Hymn';
        const hymMeta = document.querySelector('.song-meta')?.textContent || '';
        const url = window.location.href;

        console.log('Share data:', { hymTitle, hymMeta, url });

        // Check if Web Share API is available
        if (navigator.share) {
            console.log('Native share API available');
            
            navigator.share({
                title: hymTitle,
                text: `${hymTitle}\n${hymMeta}\n\nCheck out this hymn!`,
                url: url
            })
            .then(() => {
                console.log('Shared successfully via native API');
                showNotification('✓ Shared successfully!');
            })
            .catch((error) => {
                console.log('Native share cancelled or failed:', error);
                // Only fallback if it's not a user cancellation
                if (error.name !== 'AbortError') {
                    fallbackShare(url, hymTitle);
                }
            });
        } else {
            console.log('Native share API not available, using fallback');
            fallbackShare(url, hymTitle);
        }
    };

    function fallbackShare(url, title) {
        console.log('Using clipboard fallback');
        
        const shareText = `${title}\n${url}`;
        
        // Modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareText)
                .then(() => {
                    console.log('Copied to clipboard via Clipboard API');
                    showNotification('✓ Link copied to clipboard!');
                })
                .catch((err) => {
                    console.error('Clipboard API failed:', err);
                    legacyCopy(shareText);
                });
        } else {
            console.log('Clipboard API not available, using legacy method');
            legacyCopy(shareText);
        }
    }

    function legacyCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        
        try {
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            
            if (successful) {
                console.log('Copied via legacy execCommand');
                showNotification('✓ Link copied to clipboard!');
            } else {
                console.error('execCommand copy failed');
                showNotification('⚠ Could not copy link');
            }
        } catch (err) {
            console.error('Legacy copy error:', err);
            showNotification('⚠ Copy failed: ' + err.message);
        } finally {
            document.body.removeChild(textArea);
        }
    }

    function showNotification(message) {
        console.log('Showing notification:', message);
        
        // Remove any existing notifications
        const existingNotification = document.querySelector('.share-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger reflow to enable transition
        notification.offsetHeight;

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Lazy load YouTube iframe
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loaded, initializing media features');
        
        const videoContainer = document.querySelector('.video-container');
        if (!videoContainer) {
            console.log('No video container found');
            return;
        }

        const iframe = videoContainer.querySelector('iframe');
        if (!iframe) {
            console.log('No iframe found in video container');
            return;
        }

        console.log('Video iframe found, setting up lazy loading');

        // Add loading attribute
        iframe.setAttribute('loading', 'lazy');

        // Observe when video comes into view
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const src = iframe.getAttribute('src');
                        console.log('Video container in view, src:', src);
                        
                        if (src && !iframe.hasAttribute('data-loaded')) {
                            iframe.setAttribute('data-loaded', 'true');
                            // Force reload to ensure proper loading
                            iframe.src = src;
                            console.log('Video iframe loaded');
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });

            observer.observe(videoContainer);
        } else {
            console.log('IntersectionObserver not supported, loading video immediately');
            iframe.setAttribute('data-loaded', 'true');
        }
    });

    // Audio player enhancements
    const audioPlayer = document.querySelector('.audio-player audio');
    if (audioPlayer) {
        console.log('Audio player found');
        
        audioPlayer.addEventListener('loadedmetadata', function() {
            console.log('Audio duration:', this.duration);
        });

        audioPlayer.addEventListener('error', function(e) {
            console.error('Error loading audio file:', e);
            showNotification('⚠ Audio file could not be loaded');
        });
    }

    // Test share button on load
    console.log('Share function available:', typeof window.shareHymn);

})();