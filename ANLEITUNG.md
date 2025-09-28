# Loblieder-Website - Aufbauanleitung

## 🎵 Übersicht
Ihre Loblieder-Website ist jetzt bereit! Sie haben ein professionelles System mit:
- **45 deutsche Loblieder**
- **ca. 650 griechische Loblieder** (mit deutscher Transliteration und Übersetzung)
- **Suchfunktion** für schnelles Finden von Liedern
- **Responsive Design** für alle Geräte (Handy, Tablet, Computer)

## 📁 Ordnerstruktur
```
deutsche-loblieder/
├── index.html                 # Hauptinhaltsverzeichnis
├── css/style.css             # Styling für alle Seiten
├── js/search.js              # Suchfunktionalität
├── deutsche-lieder/          # Ordner für deutsche Lieder
│   ├── herr-ich-komme-zu-dir.html (Beispiel)
│   └── ... (weitere deutsche Lieder)
├── griechische-lieder/       # Ordner für griechische Lieder
│   ├── agios-o-theos.html    (Beispiel)
│   ├── christos-anesti.html  (Beispiel)
│   └── ... (weitere griechische Lieder)
└── templates/                # Vorlagen zum Kopieren
    ├── deutsches-lied-template.html
    └── griechisches-lied-template.html
```

## 🔧 So fügen Sie neue Lieder hinzu:

### Für DEUTSCHE Lieder:
1. Kopieren Sie die Datei `templates/deutsches-lied-template.html`
2. Benennen Sie sie um (z.B. `mein-neues-lied.html`)
3. Bearbeiten Sie:
   - `<title>` und Liedtitel
   - Liedernummer
   - Strophen und Refrain
4. Speichern Sie die Datei im Ordner `deutsche-lieder/`
5. Fügen Sie einen Link in der `index.html` hinzu

### Für GRIECHISCHE Lieder:
1. Kopieren Sie die Datei `templates/griechisches-lied-template.html`
2. Bearbeiten Sie:
   - Deutsche Transliteration (z.B. "Agios o Theos")
   - Deutsche Übersetzung in Klammern darunter
   - Jede Zeile mit Übersetzung
3. Speichern Sie die Datei im Ordner `griechische-lieder/`

## ➕ Neue Lieder zum Inhaltsverzeichnis hinzufügen:

### Deutsches Lied hinzufügen:
```html
<a href="deutsche-lieder/DATEINAME.html" class="song-item">
    <span class="song-number">004</span>
    <span class="song-title">Mein Liedtitel</span>
</a>
```

### Griechisches Lied hinzufügen:
```html
<a href="griechische-lieder/DATEINAME.html" class="song-item">
    <span class="song-number">004</span>
    <span class="song-title">Griechischer Titel <em>(Deutsche Übersetzung)</em></span>
</a>
```

## 🎨 Features Ihrer Website:
- ✅ **Responsive Design** - funktioniert auf allen Geräten
- ✅ **Suchfunktion** - Benutzer können Lieder schnell finden
- ✅ **Professionelles Design** mit schönen Farben
- ✅ **Einfache Navigation** - zurück zum Hauptverzeichnis
- ✅ **Nummerierte Lieder** für einfache Referenz
- ✅ **Hover-Effekte** für bessere Benutzerfreundlichkeit

## 🔍 Suchfunktion Bedienung:
- Eingabe von Liedtitel oder -nummer
- Strg/Cmd + F öffnet die Suche direkt
- Escape löscht die Suche
- Sucht in deutschen und griechischen Titeln

## 📱 Mobile Optimierung:
- Automatische Anpassung an Bildschirmgröße
- Touch-freundliche Buttons
- Lesbare Schriftgrößen

## 💡 Tipps für die Verwaltung:
1. **Konsistente Nummerierung**: Nutzen Sie fortlaufende Nummern (001, 002, 003...)
2. **Dateinamen**: Verwenden Sie beschreibende Namen ohne Umlaute (z.B. `grosser-gott-wir-loben-dich.html`)
3. **Backup**: Sichern Sie regelmäßig alle Dateien
4. **Testen**: Öffnen Sie die `index.html` in einem Browser zum Testen

## 🚀 Website öffnen:
1. Öffnen Sie die Datei `index.html` in einem Webbrowser
2. Oder stellen Sie den Ordner auf einen Webserver
3. Die Website funktioniert auch offline!

## ⚡ Erweiterte Features (optional):
- Druckfunktion für einzelne Lieder
- Favoritenliste
- Verschiedene Schriftgrößen
- Kategorien (Anbetung, Dank, Bitte, etc.)

Viel Freude mit Ihrer neuen Loblieder-Website! 🎵