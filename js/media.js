// Media functionality for hymn pages
(function() {
    'use strict';

    // Share functionality
    window.shareHymn = function() {
        const hymTitle = document.querySelector('.song-header h1')?.textContent || 'Hymn';
        const url = window.location.href;

        if (navigator.share) {
            // Use native share API if available (mobile)
            navigator.share({
                title: hymTitle,
                text: `Check out this hymn: ${hymTitle}`,
                url: url
            }).then(() => {
                console.log('Shared successfully');
            }).catch((error) => {
                console.log('Error sharing:', error);
                fallbackShare(url);
            });
        } else {
            // Fallback for desktop
            fallbackShare(url);
        }
    };

    function fallbackShare(url) {
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard!');
            }).catch(() => {
                showNotification('Could not copy link');
            });
        } else {
            // Older fallback
            const textArea = document.createElement('textarea');
            textArea.value = url;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification('Link copied to clipboard!');
            } catch (err) {
                showNotification('Could not copy link');
            }
            document.body.removeChild(textArea);
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Lazy load YouTube iframe
    document.addEventListener('DOMContentLoaded', function() {
        const videoContainer = document.querySelector('.video-container');
        if (!videoContainer) return;

        const iframe = videoContainer.querySelector('iframe');
        if (!iframe) return;

        // Add loading attribute
        iframe.setAttribute('loading', 'lazy');

        // Observe when video comes into view
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const src = iframe.getAttribute('src');
                        if (src && !iframe.hasAttribute('data-loaded')) {
                            iframe.setAttribute('data-loaded', 'true');
                            // Force reload to ensure proper loading
                            iframe.src = src;
                        }
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });

            observer.observe(videoContainer);
        }
    });

    // Audio player enhancements
    const audioPlayer = document.querySelector('.audio-player audio');
    if (audioPlayer) {
        audioPlayer.addEventListener('loadedmetadata', function() {
            console.log('Audio duration:', this.duration);
        });

        audioPlayer.addEventListener('error', function() {
            console.error('Error loading audio file');
            showNotification('Audio file could not be loaded');
        });
    }

})();