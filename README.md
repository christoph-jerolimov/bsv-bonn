# BSV Bonn/Rhein-Sieg – Website

Website des **Blinden- und Sehbehindertenvereins Bonn/Rhein-Sieg e.V.**, umgesetzt mit [Astro](https://astro.build/) und TypeScript. Design, Aufbau und Inhalte orientieren sich an [bsv-bonn.de](https://bsv-bonn.de/). Alle Inhalte liegen als Markdown vor, die Seite ist responsiv und wird automatisch als GitHub Pages veröffentlicht.

## Schnellstart

```bash
npm install
npm run dev        # Entwicklungsserver unter http://localhost:4321/bsv-bonn/
npm run build      # Statische Seite nach dist/ bauen
npm run preview    # Gebaute Seite lokal ansehen
```

Voraussetzung ist Node.js 22 (siehe `.nvmrc`).

## Inhalte pflegen

Alle Texte liegen als Markdown unter `src/content`:

| Ordner                 | Inhalt                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/pages/`   | Eine Datei pro Seite. Der Dateipfad bestimmt die URL: `wir/vorstand.md` → `/wir/vorstand/`.                                           |
| `src/content/termine/` | Eine Datei pro Veranstaltung. Kommende Termine erscheinen unter „Veranstaltungen“ und in der Seitenleiste, vergangene im „Rückblick“. |

### Seiten (`src/content/pages/*.md`)

```markdown
---
title: Vorstand
description: Kurzbeschreibung für Suchmaschinen und Vorschauen.
updated: 2026-10-13 # optional, zeigt „Stand: 13.10.2026“
hideSidebar: false # optional, blendet Kontakt/Termine aus (z. B. Impressum)
sectionNav: false # optional, listet die Unterseiten des Bereichs auf
events: upcoming # optional: upcoming | past – hängt die Terminliste an
---

Inhalt in Markdown. Interne Links immer mit führendem und abschließendem
Schrägstrich schreiben: [Mitglied werden](/wir/mitglied-werden/).
```

Neue Seiten müssen zusätzlich in der Navigation (`src/data/navigation.ts`) eingetragen werden; ein Test prüft, dass Navigation und Seiten zusammenpassen.

### Termine (`src/content/termine/JJJJ-MM-TT-name.md`)

```markdown
---
title: Weihnachtsfeier im Restaurant „Zum Schützenhof“
date: 2026-12-12
endDate: 2026-12-12 # optional, für mehrtägige Veranstaltungen
time: 14:00 – 18:00 Uhr # optional
location: Bonn # optional
intern: true # optional, kennzeichnet vereinsinterne Veranstaltungen (*)
registration: im Vereinsbüro # optional
---

Beschreibung der Veranstaltung.
```

Kontaktdaten, Sprechzeiten und Spendenkonto, die an mehreren Stellen erscheinen, stehen zentral in `src/data/site.ts`.

## Projektstruktur

```
src/
  components/   Header, Navigation, Seitenleiste, Fußzeile, Terminlisten
  content/      Markdown-Inhalte (Seiten und Termine)
  data/         Navigation und zentrale Vereinsdaten
  layouts/      Grundlayout und Seitenlayout
  lib/          Hilfsfunktionen (Pfade, Datumsformate, Markdown-Plugin)
  pages/        Routen: Startseite, dynamische Inhaltsseiten, 404
  styles/       Globales Stylesheet
tests/          Vitest-Tests für Hilfsfunktionen, Inhalte und Build-Ergebnis
.github/        Workflows für CI, Commit-/PR-Prüfung und Deployment
```

## Qualitätssicherung

```bash
npm run lint          # ESLint (TypeScript und Astro, inkl. Barrierefreiheitsregeln)
npm run format:check  # Prettier
npm run check         # astro check (Typprüfung)
npm test              # Vitest
npm run build && npm run validate:html   # HTML-Validierung des Build-Ergebnisses
```

Commit-Nachrichten und Pull-Request-Titel folgen den [Conventional Commits](https://www.conventionalcommits.org/) und werden mit commitlint geprüft, z. B. `feat: Smartphone-Sprechstunde ergänzen` oder `docs: Termine für 2027 eintragen`.

## GitHub Workflows

| Workflow       | Auslöser                 | Aufgabe                                                        |
| -------------- | ------------------------ | -------------------------------------------------------------- |
| `ci.yml`       | Push auf `main`, PRs     | Formatierung, Lint, Typprüfung, Build, HTML-Validierung, Tests |
| `validate.yml` | Push auf `main`, PRs     | Prüft Commit-Nachrichten und PR-Titel (Conventional Commits)   |
| `deploy.yml`   | Push auf `main`, manuell | Baut die Seite und veröffentlicht sie als GitHub Pages         |

Für das Deployment muss in den Repository-Einstellungen unter **Settings → Pages** als Quelle **GitHub Actions** ausgewählt sein. Die Seite erscheint dann unter `https://<owner>.github.io/<repository>/`.

### Basis-URL

Die Basis-URL wird automatisch ermittelt: Aus `GITHUB_REPOSITORY` (bzw. den Ausgaben von `actions/configure-pages`) ergeben sich `site` und `base`. Für eine eigene Domain können `SITE_URL` und `BASE_PATH` gesetzt werden:

```bash
SITE_URL=https://bsv-bonn.de BASE_PATH=/ npm run build
```

Interne Links in Markdown (`/wir/vorstand/`) werden beim Build automatisch um den Basis-Pfad ergänzt.

## Hinweise zu den Inhalten

Die Texte wurden auf Grundlage der öffentlich zugänglichen Inhalte von bsv-bonn.de neu erfasst. Vor einer Veröffentlichung sollten insbesondere Termine, Telefonnummern, Beiträge und die rechtlichen Seiten (Impressum, Datenschutzerklärung) vom Verein geprüft werden.
