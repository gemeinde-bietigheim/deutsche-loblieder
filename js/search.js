// Suchfunktionalität für Loblieder
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const songItems = document.querySelectorAll('.song-item');
    
    // Suchfunktion
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        songItems.forEach(function(songItem) {
            const songTitle = songItem.querySelector('.song-title').textContent.toLowerCase();
            const songNumber = songItem.querySelector('.song-number').textContent.toLowerCase();
            
            // Suche sowohl in Titel als auch in Nummer
            if (songTitle.includes(searchTerm) || songNumber.includes(searchTerm)) {
                songItem.classList.remove('hidden');
            } else {
                songItem.classList.add('hidden');
            }
        });
        
        // Zeige Kategorien nur an, wenn sie sichtbare Lieder enthalten
        updateCategoryVisibility();
    });
    
    // Kategorien-Sichtbarkeit basierend auf sichtbaren Liedern
    function updateCategoryVisibility() {
        const categories = document.querySelectorAll('.category');
        
        categories.forEach(function(category) {
            const visibleSongs = category.querySelectorAll('.song-item:not(.hidden)');
            const categoryHeader = category.querySelector('h2');
            
            if (visibleSongs.length === 0) {
                category.style.opacity = '0.3';
                categoryHeader.style.color = '#cbd5e0';
            } else {
                category.style.opacity = '1';
                categoryHeader.style.color = '#4a5568';
            }
        });
    }
    
    // Tastenkombinationen für bessere Benutzerfreundlichkeit
    document.addEventListener('keydown', function(event) {
        // Strg/Cmd + F öffnet die Suche
        if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
            event.preventDefault();
            searchInput.focus();
        }
        
        // Escape löscht die Suche
        if (event.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    });
    
    // Hover-Effekte für bessere Benutzererfahrung
    songItems.forEach(function(songItem) {
        songItem.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
        });
        
        songItem.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(5px)';
        });
    });
    
    // Statistiken anzeigen
    function updateStatistics() {
        const deutscheAnzahl = document.querySelectorAll('#deutsche-lieder .song-item').length;
        const griechischeAnzahl = document.querySelectorAll('#griechische-lieder .song-item').length;
        
        document.querySelector('#deutsche-lieder').closest('.category').querySelector('h2').textContent = 
            `Deutsche Loblieder (${deutscheAnzahl})`;
        document.querySelector('#griechische-lieder').closest('.category').querySelector('h2').textContent = 
            `Griechische Loblieder (${griechischeAnzahl})`;
    }
    
    // Lade Statistiken beim Start
    updateStatistics();
    
    // Smooth Scrolling für bessere Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Service Worker für Offline-Funktionalität (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});