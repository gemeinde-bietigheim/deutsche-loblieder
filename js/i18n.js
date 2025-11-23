/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const songsDir = path.join(rootDir, 'english-songs');
const indexPath = path.join(rootDir, 'index.html');

const START = '<!-- GREEK_TOC_START -->';
const END = '<!-- GREEK_TOC_END -->';

// Create english-songs directory if it doesn't exist
if (!fs.existsSync(songsDir)) {
  fs.mkdirSync(songsDir, { recursive: true });
}

const files = fs.readdirSync(songsDir)
  .filter((name) => name.endsWith('.html') && name !== 'index.html' && !name.startsWith('template'));

const songs = files.map((file) => {
  const content = fs.readFileSync(path.join(songsDir, file), 'utf8');
  const h1Match = content.match(/<h1>\s*([\d]+\s+[^<]+)<\/h1>/i);
  if (!h1Match) throw new Error(`No <h1> found in ${file}`);

  const fullTitle = h1Match[1].trim();
  const [number, ...titleParts] = fullTitle.split(' ');
  const title = titleParts.join(' ').trim();

  const translationMatch = content.match(/Greek Hymns\s*-\s*No\.\s*\d+\s*\|\s*"([^"]+)"/i);
  const translation = translationMatch ? translationMatch[1].trim() : '';

  return {
    number: Number(number),
    title,
    translation,
    href: `english-songs/${file}`,
  };
}).sort((a, b) => a.number - b.number);

const listMarkup = songs.map(({ number, title, translation, href }) => {
  const translationPart = translation ? ` <em>(${translation})</em>` : '';
  return `                        <a href="${href}" class="song-item">
                            <span class="song-number">${String(number).padStart(3, '0')}</span>
                            <span class="song-title">${title}${translationPart}</span>
                        </a>`;
}).join('\n');

console.log(`English Greek hymns table of contents generated with ${songs.length} entries.`);