// Advanced Search Functionality for Hymns
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        debounceDelay: 300,
        maxSearchHistory: 10,
        highlightClass: 'search-highlight',
        storageKey: 'hymns-search-history'
    };

    // State management
    let searchTimeout = null;
    let searchHistory = loadSearchHistory();
    let currentResults = [];

    // DOM elements cache
    let elements = {};

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', initialize);

    function initialize() {
        cacheElements();
        if (!elements.searchInput) return;

        setupEventListeners();
        updateStatistics();
        setupKeyboardShortcuts();
        setupServiceWorker();
        restoreLastSearch();
    }

    function cacheElements() {
        elements = {
            searchInput: document.getElementById('searchInput'),
            songItems: document.querySelectorAll('.song-item'),
            categories: document.querySelectorAll('.category'),
            categoryHeaders: document.querySelectorAll('.category h2')
        };
    }

    function setupEventListeners() {
        // Search input with debouncing
        elements.searchInput.addEventListener('input', debounce(handleSearch, CONFIG.debounceDelay));
        
        // Clear search on escape
        elements.searchInput.addEventListener('keydown', handleSearchKeydown);
        
        // Save search to history on enter
        elements.searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                addToSearchHistory(this.value.trim());
            }
        });

        // Hover effects for song items
        elements.songItems.forEach(function(songItem) {
            songItem.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(10px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            songItem.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(5px)';
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', handleSmoothScroll);
        });
    }

    function handleSearch() {
        const searchTerm = elements.searchInput.value.toLowerCase().trim();
        
        // Clear previous highlights
        clearHighlights();
        
        // Reset if empty search
        if (!searchTerm) {
            resetSearch();
            return;
        }

        // Perform search with fuzzy matching
        currentResults = [];
        let resultCount = 0;

        elements.songItems.forEach(function(songItem) {
            const songTitle = songItem.querySelector('.song-title')?.textContent || '';
            const songNumber = songItem.querySelector('.song-number')?.textContent || '';
            const combinedText = `${songNumber} ${songTitle}`.toLowerCase();
            
            // Multiple search strategies
            const exactMatch = combinedText.includes(searchTerm);
            const fuzzyMatch = fuzzySearch(searchTerm, combinedText);
            const accentMatch = removeAccents(combinedText).includes(removeAccents(searchTerm));
            
            if (exactMatch || fuzzyMatch || accentMatch) {
                songItem.style.display = 'flex';
                songItem.classList.remove('hidden');
                highlightMatch(songItem, searchTerm);
                currentResults.push(songItem);
                resultCount++;
            } else {
                songItem.style.display = 'none';
                songItem.classList.add('hidden');
            }
        });

        // Update UI based on results
        autoExpandWithResults();
        updateCategoryVisibility(searchTerm);
        showSearchStats(resultCount, searchTerm);
        
        // Save to localStorage
        localStorage.setItem('lastSearch', searchTerm);
    }

    function resetSearch() {
        elements.songItems.forEach(function(songItem) {
            songItem.style.display = 'flex';
            songItem.classList.remove('hidden');
        });
        
        clearHighlights();
        updateCategoryVisibility('');
        hideSearchStats();
        localStorage.removeItem('lastSearch');
    }

    function autoExpandWithResults() {
        const categoryIds = ['deutsche-lieder', 'griechische-lieder', 'english-songs'];
        
        categoryIds.forEach(categoryId => {
            const songList = document.getElementById(categoryId);
            if (!songList) return;
            
            const visibleSongs = Array.from(songList.querySelectorAll('.song-item'))
                .filter(item => item.style.display !== 'none');
            
            const categoryHeader = songList.previousElementSibling;
            const toggleIcon = categoryHeader?.querySelector('.toggle-icon');
            
            if (visibleSongs.length > 0) {
                songList.classList.remove('collapsed');
                songList.classList.add('expanded');
                if (toggleIcon) toggleIcon.textContent = '▲';
            } else {
                songList.classList.add('collapsed');
                songList.classList.remove('expanded');
                if (toggleIcon) toggleIcon.textContent = '▼';
            }
        });
    }

    function updateCategoryVisibility(searchTerm) {
        elements.categories.forEach(function(category) {
            const visibleSongs = category.querySelectorAll('.song-item:not(.hidden)');
            const categoryHeader = category.querySelector('.category-header') || category.querySelector('h2');
            
            if (searchTerm && visibleSongs.length === 0) {
                category.style.opacity = '0.4';
                if (categoryHeader) categoryHeader.style.color = '#cbd5e0';
            } else {
                category.style.opacity = '1';
                if (categoryHeader) categoryHeader.style.color = '';
            }
        });
    }

    function updateStatistics() {
        const stats = {
            deutsche: document.querySelectorAll('#deutsche-lieder .song-item').length,
            griechische: document.querySelectorAll('#griechische-lieder .song-item').length,
            english: document.querySelectorAll('#english-songs .song-item').length
        };

        // Update German songs count
        const deutscheHeader = document.querySelector('[data-i18n="german-songs-title"]');
        if (deutscheHeader && stats.deutsche > 0) {
            const currentLang = localStorage.getItem('language') || 'de';
            const label = currentLang === 'en' ? 'German Hymns' : 'Deutsche Loblieder';
            deutscheHeader.textContent = `${label} (${stats.deutsche})`;
        }

        // Update Greek songs count
        const griechischeHeader = document.querySelector('[data-i18n="greek-songs-title"]');
        if (griechischeHeader && stats.griechische > 0) {
            const currentLang = localStorage.getItem('language') || 'de';
            const label = currentLang === 'en' ? 'Greek Hymns' : 'Griechische Loblieder';
            griechischeHeader.textContent = `${label} (${stats.griechische})`;
        }

        // Update English songs count
        const englishHeader = document.querySelector('[data-i18n="english-songs-title"]');
        if (englishHeader && stats.english > 0) {
            const currentLang = localStorage.getItem('language') || 'de';
            const label = currentLang === 'en' ? 'Greek Hymns (English Transliteration)' : 'Griechische Loblieder (Englische Transliteration)';
            englishHeader.textContent = `${label} (${stats.english})`;
        }

        return stats;
    }

    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(event) {
            // Ctrl/Cmd + F opens search
            if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
                event.preventDefault();
                elements.searchInput.focus();
                elements.searchInput.select();
            }
            
            // Escape clears search
            if (event.key === 'Escape' && document.activeElement === elements.searchInput) {
                elements.searchInput.value = '';
                elements.searchInput.dispatchEvent(new Event('input'));
                elements.searchInput.blur();
            }

            // Ctrl/Cmd + K also opens search (GitHub style)
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                elements.searchInput.focus();
                elements.searchInput.select();
            }

            // Arrow key navigation through results
            if (event.key === 'ArrowDown' && document.activeElement === elements.searchInput) {
                event.preventDefault();
                navigateResults('next');
            }
            if (event.key === 'ArrowUp' && document.activeElement === elements.searchInput) {
                event.preventDefault();
                navigateResults('prev');
            }
        });
    }

    function handleSearchKeydown(event) {
        if (event.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    }

    function handleSmoothScroll(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Utility Functions

    function debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(searchTimeout);
                func(...args);
            };
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(later, wait);
        };
    }

    function fuzzySearch(needle, haystack) {
        if (!needle || !haystack) return false;
        
        const hLen = haystack.length;
        const nLen = needle.length;
        
        if (nLen > hLen) return false;
        if (nLen === hLen) return needle === haystack;
        
        outer: for (let i = 0, j = 0; i < nLen; i++) {
            const nChar = needle.charCodeAt(i);
            while (j < hLen) {
                if (haystack.charCodeAt(j++) === nChar) {
                    continue outer;
                }
            }
            return false;
        }
        return true;
    }

    function removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function highlightMatch(element, searchTerm) {
        const titleElement = element.querySelector('.song-title');
        if (!titleElement) return;

        const originalText = titleElement.textContent;
        const lowerText = originalText.toLowerCase();
        const lowerSearch = searchTerm.toLowerCase();
        const index = lowerText.indexOf(lowerSearch);

        if (index >= 0) {
            const before = originalText.substring(0, index);
            const match = originalText.substring(index, index + searchTerm.length);
            const after = originalText.substring(index + searchTerm.length);
            
            titleElement.innerHTML = `${escapeHtml(before)}<mark class="${CONFIG.highlightClass}">${escapeHtml(match)}</mark>${escapeHtml(after)}`;
        }
    }

    function clearHighlights() {
        document.querySelectorAll(`.${CONFIG.highlightClass}`).forEach(mark => {
            const parent = mark.parentNode;
            parent.textContent = parent.textContent; // Remove HTML, keep text
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showSearchStats(count, term) {
        let statsDiv = document.getElementById('search-stats');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'search-stats';
            statsDiv.className = 'search-stats';
            elements.searchInput.parentNode.appendChild(statsDiv);
        }
        
        const currentLang = localStorage.getItem('language') || 'de';
        const resultText = currentLang === 'en' 
            ? `${count} result${count !== 1 ? 's' : ''} for "${term}"`
            : `${count} Ergebnis${count !== 1 ? 'se' : ''} für "${term}"`;
        
        statsDiv.textContent = resultText;
        statsDiv.style.display = 'block';
    }

    function hideSearchStats() {
        const statsDiv = document.getElementById('search-stats');
        if (statsDiv) {
            statsDiv.style.display = 'none';
        }
    }

    // Search History Management

    function loadSearchHistory() {
        try {
            const history = localStorage.getItem(CONFIG.storageKey);
            return history ? JSON.parse(history) : [];
        } catch (e) {
            console.error('Error loading search history:', e);
            return [];
        }
    }

    function addToSearchHistory(term) {
        if (!term || searchHistory.includes(term)) return;
        
        searchHistory.unshift(term);
        if (searchHistory.length > CONFIG.maxSearchHistory) {
            searchHistory = searchHistory.slice(0, CONFIG.maxSearchHistory);
        }
        
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(searchHistory));
        } catch (e) {
            console.error('Error saving search history:', e);
        }
    }

    function restoreLastSearch() {
        const lastSearch = localStorage.getItem('lastSearch');
        if (lastSearch) {
            elements.searchInput.value = lastSearch;
            elements.searchInput.dispatchEvent(new Event('input'));
        }
    }

    // Navigation through results

    let currentResultIndex = -1;

    function navigateResults(direction) {
        if (currentResults.length === 0) return;

        if (direction === 'next') {
            currentResultIndex = (currentResultIndex + 1) % currentResults.length;
        } else {
            currentResultIndex = currentResultIndex <= 0 ? currentResults.length - 1 : currentResultIndex - 1;
        }

        const targetElement = currentResults[currentResultIndex];
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetElement.style.backgroundColor = '#fffacd';
            setTimeout(() => {
                targetElement.style.backgroundColor = '';
            }, 1000);
        }
    }

    // Service Worker Registration

    function setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                        console.log('Service Worker registered successfully:', registration.scope);
                    })
                    .catch(function(error) {
                        console.log('Service Worker registration failed:', error);
                    });
            });
        }
    }

    // Export functionality for debugging/stats
    window.hymnSearch = {
        getStatistics: updateStatistics,
        getSearchHistory: () => searchHistory,
        clearHistory: () => {
            searchHistory = [];
            localStorage.removeItem(CONFIG.storageKey);
        },
        getCurrentResults: () => currentResults
    };

})();