const translations = {
  de: {
    'title': 'Loblieder - FAPG Bietigheim-Bissingen',
    'header-title': 'Loblieder der Gemeinde',
    'header-subtitle': 'Sammlung deutscher und griechischer Loblieder',
    'search-placeholder': 'Suche nach Liedtitel...',
    'german-songs-title': 'Deutsche Loblieder',
    'greek-songs-title': 'Griechische Loblieder (Deutsche Transliteration)',
    'greek-songs-transliterated-title': 'Griechische Loblieder (Transliteriert)',
    'greek-songs-original-title': 'Ελληνικοί Ύμνοι (Πρωτότυπο)',
    'german-english-title': 'Deutsche Loblieder (mit englischer Übersetzung)',
    'english-songs-title': 'Griechische Loblieder (Englische Transliteration)',
    'footer': '© 2025 FAPG Bietigheim-Bissingen - Erstellt für den Lobpreis',
    'back-button': '← Zurück zum Inhaltsverzeichnis'
  },
  en: {
    'title': 'Hymns - FAPC Bietigheim-Bissingen',
    'header-title': 'Hymns of the Church',
    'header-subtitle': 'Collection of German and Greek Hymns',
    'search-placeholder': 'Search for hymn title...',
    'german-songs-title': 'German Hymns (Translated)',
    'german-english-title': 'German Hymns (with English Translation)',
    'greek-songs-title': 'Greek Hymns',
    'greek-songs-transliterated-title': 'Greek Hymns (Transliterated)',
    'greek-songs-original-title': 'Ελληνικοί Ύμνοι (Original)',
    'english-songs-title': 'Greek Hymns (English Transliteration)',
    'footer': '© 2025 FAPC Bietigheim-Bissingen - Created for worship',
    'back-button': '← Back to Index'
  },
  gr: {
    'title': 'Ύμνοι - Εκκλησία Bietigheim',
    'header-title': 'Ύμνοι της Εκκλησίας',
    'header-subtitle': 'Συλλογή Ελληνικών Ύμνων',
    'search-placeholder': 'Αναζήτηση ύμνου...',
    'german-songs-title': 'Γερμανικοί Ύμνοι (Μεταφρασμένοι)',
    'greek-songs-title': 'Ελληνικοί Ύμνοι',
    'greek-songs-original-title': 'Ελληνικοί Ύμνοι',
    'greek-songs-transliterated-title': 'Ελληνικοί Ύμνοι',
    'german-english-title': 'Γερμανικοί Ύμνοι',
    'english-songs-title': 'Ελληνικοί Ύμνοι (Αγγλική Μεταγραφή)',
    'footer': '© 2025 Εκκλησία Bietigheim - Δημιουργήθηκε για δοξολογία',
    'back-button': '← Επιστροφή στο Ευρετήριο'
  }
};

let currentLanguage = localStorage.getItem('preferredLanguage') || detectLanguage();

function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang.startsWith('el') || browserLang.startsWith('gr')) {
    return 'gr';
  } else if (browserLang.startsWith('en')) {
    return 'en';
  }
  return 'de';
}

function switchLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);
  document.documentElement.lang = lang;
  
  updateContent();
  updateActiveButton();
  updateSectionVisibility(lang);
}

function updateContent() {
  // Update text content for elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      elem.textContent = translations[currentLanguage][key];
    }
  });

  // Update placeholders for input elements
  document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    if (translations[currentLanguage][key]) {
      elem.placeholder = translations[currentLanguage][key];
    }
  });

  // Update document title
  if (translations[currentLanguage]['title']) {
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

function updateSectionVisibility(lang) {
  // German sections
  const germanOriginalSection = document.querySelector('.german-original-section');
  const germanEnglishSection = document.getElementById('german-english-section');
  
  // Greek sections
  const greekTransliteratedSection = document.querySelector('.greek-transliterated-section');
  const greekOriginalSection = document.querySelector('.greek-original-section');
  const englishTransliteratedSection = document.getElementById('english-songs-section');
  const asmaNeonSection = document.getElementById('asma-neon-section');
  const asmaNeonDeSection = document.getElementById('asma-neon-de-section');

  // Hide all sections first
  [germanOriginalSection, germanEnglishSection, greekTransliteratedSection, 
   greekOriginalSection, englishTransliteratedSection, asmaNeonSection, asmaNeonDeSection].forEach(section => {
    if (section) section.style.display = 'none';
  });
  
  if (lang === 'de') {
    // DE mode: German originals + Greek with German transliteration
    if (germanOriginalSection) {
      germanOriginalSection.style.display = 'block';
      const deutscheList = document.getElementById('deutsche-lieder');
      if (deutscheList) expandCategorySection(deutscheList);
    }
    if (germanEnglishSection) {
      germanEnglishSection.style.display = 'none';
    }
    if (greekTransliteratedSection) {
      greekTransliteratedSection.style.display = 'block';
      const griechischeList = document.getElementById('greek-transliterated');
      if (griechischeList) expandCategorySection(griechischeList);
    }
    if (greekOriginalSection) {
      greekOriginalSection.style.display = 'none';
    }
    if (englishTransliteratedSection) {
      englishTransliteratedSection.style.display = 'none';
    }
    // Show Asma Neon German version in DE mode
    if (asmaNeonDeSection) {
      asmaNeonDeSection.style.display = 'block';
      const asmaNeonDeList = document.getElementById('asma-neon-de-hymns');
      if (asmaNeonDeList) expandCategorySection(asmaNeonDeList);
    }
    
  } else if (lang === 'en') {
    // EN mode: German with English translation + Greek with English transliteration
    if (germanOriginalSection) {
      germanOriginalSection.style.display = 'none';
    }
    if (germanEnglishSection) {
      germanEnglishSection.style.display = 'block';
      const germanEnglishList = document.getElementById('german-english-hymns');
      if (germanEnglishList) expandCategorySection(germanEnglishList);
    }
    if (greekTransliteratedSection) {
      greekTransliteratedSection.style.display = 'none';
    }
    if (greekOriginalSection) {
      greekOriginalSection.style.display = 'none';
    }
    if (englishTransliteratedSection) {
      englishTransliteratedSection.style.display = 'block';
      const englishList = document.getElementById('english-songs');
      if (englishList) expandCategorySection(englishList);
    }
    // Show Asma Neon English version in EN mode
    if (asmaNeonSection) {
      asmaNeonSection.style.display = 'block';
      const asmaNeonList = document.getElementById('asma-neon-hymns');
      if (asmaNeonList) expandCategorySection(asmaNeonList);
    }
    
  } else if (lang === 'gr') {
    // GR mode: Only original Greek hymns (no transliterations needed)
    if (germanOriginalSection) {
      germanOriginalSection.style.display = 'none';
    }
    if (germanEnglishSection) {
      germanEnglishSection.style.display = 'none';
    }
    if (greekTransliteratedSection) {
      greekTransliteratedSection.style.display = 'none';
    }
    if (greekOriginalSection) {
      greekOriginalSection.style.display = 'block';
      const greekOriginalList = document.getElementById('greek-original-songs');
      if (greekOriginalList) expandCategorySection(greekOriginalList);
    }
    if (englishTransliteratedSection) {
      englishTransliteratedSection.style.display = 'none';
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