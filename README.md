# Poll App

Eine responsive Survey- und Voting-App mit Angular.

Mit der App koennen Umfragen erstellt, mehrere Fragen und Antwortmoeglichkeiten hinzugefuegt, Stimmen abgegeben und Live-Ergebnisse angesehen werden. Die Daten werden im Local Storage des Browsers gespeichert.

## Wichtig zum Starten

Diese App ist eine Angular-App. Sie funktioniert nicht ueber die VS Code Erweiterung "Live Server" und auch nicht durch direktes Oeffnen einer einzelnen HTML-Datei.

## Voraussetzungen

- Node.js
- npm
- Angular CLI wird ueber die Projekt-Abhaengigkeiten genutzt

## Installation

```bash
git clone https://github.com/tchocpet/Pollapp.git
cd Pollapp/pollapp
npm install
```

## App lokal starten

```bash
npm start
```

Danach die App im Browser oeffnen:

```text
http://localhost:4200
```

## Build fuer die Abgabe pruefen

```bash
npm run build
```

Wenn der Build erfolgreich ist, liegt die gebaute App im Ordner `dist/`.

## Funktionen

- Umfragen erstellen
- Mehrere Fragen pro Umfrage hinzufuegen
- Mehrere Antworten pro Frage hinzufuegen
- Single-Choice und Multiple-Choice Antworten
- Live-Ergebnisse anzeigen
- Laufende und abgelaufene Umfragen anzeigen
- Nach Kategorien filtern
- Umfragen loeschen
- Speicherung im Local Storage
- Responsive Darstellung fuer Desktop und Mobile

## Technologien

- Angular 21
- TypeScript
- SCSS
- HTML

## Hinweis zur Abgabe

Folgende Ordner sollten nicht mit abgegeben oder hochgeladen werden:

- `node_modules/`
- `.angular/`
- `.vscode/`
- `dist/`, falls nur der Quellcode abgegeben werden soll
