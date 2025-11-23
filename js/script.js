function toggleCategory(categoryId) {
  const songList = document.getElementById(categoryId);
  const categoryHeader = songList.previousElementSibling;
  const toggleIcon = categoryHeader.querySelector('.toggle-icon');
  
  if (songList.classList.contains('collapsed')) {
    songList.classList.remove('collapsed');
    songList.classList.add('expanded');
    toggleIcon.textContent = '▲';
  } else {
    songList.classList.add('collapsed');
    songList.classList.remove('expanded');
    toggleIcon.textContent = '▼';
  }
}

// Initialize - language-specific expansion handled by i18n.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Script.js loaded - categories will be adjusted by i18n.js');
});