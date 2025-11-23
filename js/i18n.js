const translations = {
  de: {
    'title': 'Loblieder - Gemeinde Bietigheim',
    'header-title': 'Loblieder der Gemeinde',
    'header-subtitle': 'Sammlung deutscher und griechischer Loblieder',
    'search-placeholder': 'Suche nach Liedtitel...',
    'german-songs-title': 'Deutsche Loblieder (45)',
    'greek-songs-title': 'Griechische Loblieder (667)',
    'english-songs-title': 'Englische Hymnen (Griechisch Transliteration)',
    'footer': '© 2025 Gemeinde Bietigheim - Erstellt für den Gottesdienst',
    'back-button': '← Zurück zum Inhaltsverzeichnis'
  },
  en: {
    'title': 'Hymns - Bietigheim Church',
    'header-title': 'Church Hymns',
    'header-subtitle': 'Collection of German and Greek Hymns',
    'search-placeholder': 'Search for hymn title...',
    'german-songs-title': 'German Hymns (45)',
    'greek-songs-title': 'Greek Hymns (667)',
    'english-songs-title': 'English Hymns (Greek Transliteration)',
    'footer': '© 2025 Bietigheim Church - Created for worship',
    'back-button': '← Back to Index'
  }
};

let currentLanguage = localStorage.getItem('language') || detectLanguage();

function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith('en') ? 'en' : 'de';
}

function switchLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
  updateContent();
  updateActiveButton();
}

function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      elem.textContent = translations[currentLanguage][key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    if (translations[currentLanguage][key]) {
      elem.placeholder = translations[currentLanguage][key];
    }
  });

  if (document.title) {
    document.title = translations[currentLanguage]['title'];
  }
}

function updateActiveButton() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.getElementById(`lang-${currentLanguage}`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  switchLanguage(currentLanguage);
});