# DOKUMENTATION – Fortschritt & Arbeitsweise

Dieses Dokument dient **ChatGPT zur Selbstdokumentation**, um auch nach einem Chat-Reset oder längerer Pause **nahtlos weiterarbeiten zu können**.  
Die Datei wird regelmäßig aktualisiert und enthält:

- Aktuellen Arbeitsstand
- Noch offene Aufgaben
- Hinweise zur Struktur
- Link zum GitHub-Repo, aus dem ChatGPT alles nachlesen kann

---

## 🔗 GitHub-Repository

👉 https://github.com/Gruppe4-Projektentwicklung/matrix_v1  
→ alle Dateien befinden sich in diesem Repository  
→ ChatGPT nutzt dieses Repo als externe Referenz nach einem Reset

---

## 📌 Warum diese Datei wichtig ist

ChatGPT kann keine dauerhaften Projektstände speichern.  
Deshalb wird dieses Projekt **schrittweise** aufgebaut und der Quellcode immer direkt ins Repository hochgeladen. Diese Doku enthält alle kontextrelevanten Infos für einen Neustart.

---

## ✅ Bisher erledigt

- `ARCHITEKTUR.md` erstellt mit vollständiger Beschreibung der Komponenten
- Projektstruktur festgelegt (FastAPI + React)
- Konfigurationssystem definiert (`matrixconfig.ini`)
- Excel-Dateien als Basis-Input definiert:
  - `ideen_template.xlsx`
  - `kombis_template.xlsx`

---

## 🛠 Nächste Aufgaben

### Aktueller Stand (Juni 2025)
Die Grundfunktionen von Backend und Frontend sind lauffähig.
Neu hinzugekommen sind:
- Aufsplittung der Sprachdatei in `src/i18n/` mit einem zentralen `index.ts`.
- Erste Aufteilung des Frontends in mehrere Seiten (`SelectDataPage`, `IdeaSelectionPage`, `CombinationSelectionPage`, `PersonalDataPage`, `ConfigSummaryPage`, `CalcResultsPage`).
- Navigation zwischen den Seiten über "Weiter"/"Zurück" Buttons.
- Standardsprache wurde auf Englisch gestellt und fehlende Übersetzungen ergänzt.
- Fehlerbehandlung beim Upload überarbeitet und Statistikformular lässt sich jetzt öffnen.
- `ResultsPage.tsx` wurde entfernt; `ConfigPage.tsx` und `UploadPage.tsx` liegen noch im Projekt, sind aber aktuell ungenutzt.
- Neue Route `/log_step` im Backend archiviert jede Nutzeraktion als JSONL im Ordner `archive/`.
- Reset-Buttons zeigen nun eine Warnung und starten garantiert eine neue Session.
- Auf der "Select Data" Seite gibt es keinen Zurück-Button mehr.
- Fehlermeldungen vom Backend werden beim Speichern von Bewertungen angezeigt.
- API-Aufrufe zu `/save_run` und `/log_step` nutzen nun `VITE_API_URL`, wodurch
  der Fehler "unknown error" auf der Personal-Seite behoben wurde.

### Nächste Schritte
- Navigationsmenü mit Links zu allen Seiten erstellen (Arbeitsplan Schritt 4) und eine 404-Seite einbauen.
- Gemeinsamen Zustand per React Context zentral verwalten (Schritt 6).
- Fehlerseite einrichten und 404-Routing ergänzen (Schritt 7).
- Optional: Lazy Loading via `React.lazy` für größere Seiten nutzen (Schritt 8).
- Archivierte Nutzungsdaten auswerten und Statistiken vorbereiten.
- Finaler End-to-End-Test aller Routen und Funktionen (Schritt 10).

---

## 🧩 Projektkomponenten (Kurzfassung)

| Komponente      | Aufgabe                                                  |
|------------------|-----------------------------------------------------------|
| `backend/`       | FastAPI, Datei-Upload, Auswertung, Logging, Config        |
| `frontend/`      | React-App, Bewertungsmatrix, UI-Komponenten               |
| `templates/`     | Leere Excel-Dateien mit fixer Struktur                    |
| `matrixconfig.ini` | Steuerung von Funktionen (Popup, Logging, Dateien etc.) |

---

## 🧠 Hinweis für ChatGPT

Wenn du diesen Chat verlierst, lies zuerst:
1. `ARCHITEKTUR.md` → für Aufbau und Zielsetzung
2. `DOKUMENTATION.md` → für To-dos und Arbeitsstand
3. GitHub-Code in https://github.com/Gruppe4-Projektentwicklung/matrix_v1

Dann kannst du sofort am nächsten Schritt weiterarbeiten.

---

*Letzte Aktualisierung durch ChatGPT: (19.06.2025:17:37)*
