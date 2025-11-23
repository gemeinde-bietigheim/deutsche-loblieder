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

// Initialize - keep first section expanded
document.addEventListener('DOMContentLoaded', () => {
  const firstSongList = document.getElementById('deutsche-lieder');
  if (firstSongList) {
    firstSongList.classList.remove('collapsed');
    firstSongList.classList.add('expanded');
    const firstIcon = firstSongList.previousElementSibling.querySelector('.toggle-icon');
    if (firstIcon) {
      firstIcon.textContent = '▲';
    }
  }
});