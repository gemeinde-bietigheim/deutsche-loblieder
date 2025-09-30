/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const songsDir = path.join(rootDir, 'griechische-lieder');
const indexPath = path.join(rootDir, 'index.html');

const START = '<!-- GREEK_TOC_START -->';
const END = '<!-- GREEK_TOC_END -->';

const files = fs.readdirSync(songsDir)
  .filter((name) => name.endsWith('.html') && name !== 'index.html' && !name.startsWith('template'));

const songs = files.map((file) => {
  const content = fs.readFileSync(path.join(songsDir, file), 'utf8');
  const h1Match = content.match(/<h1>\s*([\d]+\s+[^<]+)<\/h1>/i);
  if (!h1Match) throw new Error(`Kein <h1> in ${file}`);

  const fullTitle = h1Match[1].trim();
  const [number, ...titleParts] = fullTitle.split(' ');
  const title = titleParts.join(' ').trim();

  const translationMatch = content.match(/Griechische Loblieder\s*-\s*Nr\.\s*\d+\s*\|\s*"([^"]+)"/i);
  const translation = translationMatch ? translationMatch[1].trim() : '';

  return {
    number: Number(number),
    title,
    translation,
    href: `griechische-lieder/${file}`,
  };
}).sort((a, b) => a.number - b.number);

const listMarkup = songs.map(({ number, title, translation, href }) => {
  const translationPart = translation ? ` <em>(${translation})</em>` : '';
  return `                        <a href="${href}" class="song-item">
                            <span class="song-number">${String(number).padStart(3, '0')}</span>
                            <span class="song-title">${title}${translationPart}</span>
                        </a>`;
}).join('\n');

const indexContent = fs.readFileSync(indexPath, 'utf8');
if (!indexContent.includes(START) || !indexContent.includes(END)) {
  throw new Error('Marker für griechische Lieder fehlen in index.html');
}

const updated = indexContent.replace(
  new RegExp(`${START}[\\s\\S]*?${END}`),
  `${START}\n${listMarkup}\n                        ${END}`,
);

fs.writeFileSync(indexPath, updated);
console.log(`Griechisches Inhaltsverzeichnis mit ${songs.length} Einträgen aktualisiert.`);