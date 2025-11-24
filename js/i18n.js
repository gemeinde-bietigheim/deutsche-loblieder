const translations = {
  de: {
    'title': 'Loblieder - Gemeinde Bietigheim',
    'header-title': 'Loblieder der Gemeinde',
    'header-subtitle': 'Sammlung deutscher und griechischer Loblieder',
    'search-placeholder': 'Suche nach Liedtitel...',
    'german-songs-title': 'Deutsche Loblieder',
    'greek-songs-title': 'Griechische Loblieder',
    'english-songs-title': 'Griechische Hymnen (Englische Transliteration)',
    'footer': '© 2025 Gemeinde Bietigheim - Erstellt für den Gottesdienst',
    'back-button': '← Zurück zum Inhaltsverzeichnis'
  },
  en: {
    'title': 'Hymns - Bietigheim Church',
    'header-title': 'Church Hymns',
    'header-subtitle': 'Collection of German and Greek Hymns',
    'search-placeholder': 'Search for hymn title...',
    'german-songs-title': 'German Hymns',
    'greek-songs-title': 'Greek Hymns',
    'english-songs-title': 'Greek Hymns (English Transliteration)',
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
  adjustCategoriesForLanguage(lang);
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

function adjustCategoriesForLanguage(lang) {
  const germanSection = document.getElementById('german-songs-section');
  const greekSection = document.getElementById('greek-songs-section');
  const englishSection = document.getElementById('english-songs-section');
  
  if (lang === 'en') {
    // Show: German Hymns (for EN speakers) and English Greek transliterations
    if (germanSection) {
      germanSection.style.display = 'block';
      const deutscheList = document.getElementById('deutsche-lieder');
      if (deutscheList) expandCategorySection(deutscheList);
    }
    if (greekSection) {
      greekSection.style.display = 'none';
    }
    if (englishSection) {
      englishSection.style.display = 'block';
      const englishList = document.getElementById('english-songs');
      if (englishList) expandCategorySection(englishList);
    }
  } else {
    // DE: Show German and Greek (with German transliterations)
    if (germanSection) {
      germanSection.style.display = 'block';
      const deutscheList = document.getElementById('deutsche-lieder');
      if (deutscheList) expandCategorySection(deutscheList);
    }
    if (greekSection) {
      greekSection.style.display = 'block';
      const griechischeList = document.getElementById('griechische-lieder');
      if (griechischeList) collapseCategorySection(griechischeList);
    }
    if (englishSection) {
      englishSection.style.display = 'none';
    }
  }
}

function collapseCategorySection(songList) {
  if (!songList) return;
  
  songList.classList.remove('expanded');
  songList.classList.add('collapsed');
  
  const categoryHeader = songList.previousElementSibling;
  const toggleIcon = categoryHeader?.querySelector('.toggle-icon');
  if (toggleIcon) {
    toggleIcon.textContent = '▼';
  }
}

function expandCategorySection(songList) {
  if (!songList) return;
  
  songList.classList.remove('collapsed');
  songList.classList.add('expanded');
  
  const categoryHeader = songList.previousElementSibling;
  const toggleIcon = categoryHeader?.querySelector('.toggle-icon');
  if (toggleIcon) {
    toggleIcon.textContent = '▲';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  switchLanguage(currentLanguage);
});