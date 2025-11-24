import re
import os
from pathlib import Path

# Path to english-german-hymns directory
hymns_dir = Path("english-german-hymns")

# Dictionary to store title mappings (manual for now based on existing pattern)
title_translations = {
    "001": ("Du großer Gott wenn ich die Welt betrachte", "You great God when I look at the world"),
    "002": ("Ins Wasser fällt ein Stein", "A stone falls into the water"),
    "003": ("Welch ein Freund ist unser Jesus", "What a friend is our Jesus"),
    "004": ("Sing mit mir ein Halleluja", "Sing a hallelujah with me"),
    "005": ("Vergiss nicht zu danken", "Don't forget to thank"),
}

# Read all HTML files
for html_file in sorted(hymns_dir.glob("*.html")):
    num = html_file.stem[:3]
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract German title from <h1> tag
    h1_match = re.search(r'<h1>(\d{3})\s+([^<]+)</h1>', content)
    if h1_match:
        german_title = h1_match.group(2).strip()
        
        # Extract first English translation line
        trans_match = re.search(r'<div class="translation">\(([^)]+)\)</div>', content)
        english_title = trans_match.group(1).strip() if trans_match else "Translation needed"
        
        # Generate index entry
        filename = html_file.name
        print(f'                    <a href="english-german-hymns/{filename}" class="song-item">')
        print(f'                        <span class="song-number">{num}</span>')
        print(f'                        <span class="song-title">{german_title} <em>({english_title})</em></span>')
        print(f'                    </a>')

