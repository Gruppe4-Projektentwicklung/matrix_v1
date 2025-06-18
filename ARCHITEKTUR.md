# Architekturplan – Matrix-Tool zur Bewertung nachhaltiger Produktideen

Dieses Dokument beschreibt die geplante Architektur, Struktur und Komponenten des Matrix-Bewertungstools. Es dient der Selbstdokumentation für ChatGPT, um nach einem Chat-Reset oder längerer Pause jederzeit den aktuellen Aufbau und die Zielstruktur wieder zu verstehen.

---

## 🎯 Ziel des Tools

Das Tool dient dazu, rund 145 Produktideen aus dem Bereich nachhaltiges Bauen zu bewerten. Diese sind sehr unterschiedlich (z. B. Luftspeicherkraftwerk vs. Zementsack).  
Durch Kombination von Attributen (aus einer Excel-Tabelle) sollen vergleichbare Kennwerte entstehen. Nutzer können die Wichtigkeit dieser Kombinationen gewichten, Ideen deaktivieren und so ein individuelles Ranking berechnen lassen.

---

## 📁 Projektstruktur

**/backend/**
main.py ← Haupt‑API für Upload, Bewertung und Session
loader/excel_loader.py ← Excel‑Import & Validierung
config_loader.py ← lädt `matrixconfig.ini`
bewertung.py ← Bewertungslogik der Kombinationen
api/ ← Routen (z. B. `/save_run`)
uploads/selectionideas/ und uploads/selectioncombis/ ← persistente Uploads
templates/ ← Excel‑Vorlagen

**/frontend/src/**
components/
IdeenSelector.tsx ← Ideenliste mit Aktivierung
CollectionSelectorIdeas.tsx / CollectionSelectorKombis.tsx ← Auswahl & Upload
WeightingSelector.tsx ← Kombinationsgewichtung
BewertungsOptionen.tsx ← Optionen (Runden, Tester‑Modus)
Ranking.tsx ← Ranking‑Anzeige
StatistikForm.tsx ← Formular für Demografiedaten
StatusToast.tsx / SaveRunSuccess.tsx ← Meldungen
ResetButton.tsx ← Session zurücksetzen
pages/
StartPage.tsx,
SelectDataPage.tsx,
IdeaSelectionPage.tsx,
CombinationSelectionPage.tsx,
PersonalDataPage.tsx,
ConfigSummaryPage.tsx,
CalcResultsPage.tsx,
UploadPage.tsx
i18n/
index.ts ← i18n-Initialisierung
common.ts ← Übersetzungstexte (de/en/fr)

/templates/
ideen_template.xlsx ← Vorlage für Ideensammlung (IDs, Sprachen, Attribute)
kombis_template.xlsx ← Vorlage für Kombinationen (IDs, Sprachen, Formeltext)

/backend/uploads/
selectionideas/ ← hochgeladene Ideensammlungen
selectioncombis/ ← hochgeladene Kombinationssammlungen

DOKUMENTATION.md ← Ausführliche Beschreibung der Funktionsweise und Tabellenstruktur
ARCHITEKTUR.md ← Dieses Architektur-Dokument
README_DE.md/README_EN.md ← Kurzbeschreibung, Nutzungshinweise, ToDo-Liste

---

## **2. Ablauf & Datenfluss**

1. **Start & Datenauswahl**
   - Die `StartPage` legt eine Session-ID an und leitet zur `SelectDataPage` weiter.
   - Dort wählt der Nutzer eine Ideensammlung und eine Kombinationssammlung oder lädt eigene Excel-Dateien hoch. Dateien werden zunächst sessionspezifisch gespeichert und – sofern kein App‑Tester-Modus aktiv ist – dauerhaft unter `backend/uploads/` abgelegt.

2. **Ideen und Kombinationen festlegen**
   - In der `IdeaSelectionPage` können Ideen aktiviert oder deaktiviert werden.
   - Die `CombinationSelectionPage` dient zum Gewichten der Kombinationen. Zusätzliche Optionen bringt `BewertungsOptionen.tsx` mit.
   - Alle Texte stammen aus `src/i18n/common.ts` und werden von `src/i18n/index.ts` geladen.

3. **Persönliche Angaben & Zusammenfassung**
   - Optional erfasst die `PersonalDataPage` statistische Daten.
   - Anschließend fasst die `ConfigSummaryPage` alle Einstellungen zusammen.

4. **Berechnung & Ergebnisse**
   - Das Backend ruft die Bewertungslogik (`bewertung.py`) auf und speichert den Durchlauf über die Route `save_run`.
   - Die `CalcResultsPage` zeigt das Ranking samt Exportmöglichkeit.


## ⚙️ Backend-Komponenten (FastAPI)

### 1. **Excel-Verarbeitung**
- Liest eine Ideensammlung und eine Kombinationssammlung (aus `backend/templates/` oder Upload)
- Jede Kombination enthält eine Formel (z. B. `CO2/Jahr * Lebensdauer + Produktion`)
- Formel wird dynamisch ausgewertet
- Einheiten werden automatisch kombiniert

### 2. **Konfigurationsdatei (`matrixconfig.ini`)**
- Legt aktuelle Ideensammlung/Kombisammlung fest
- Steuerung von Optionen wie:
  - `datapopup = on/off`
  - `testerbutton = on/off`
  - `backend_logging = on/off`
  - `standardeinstellung_runde1 = einbezogen/ausgeschlossen`
  - `exportformat = csv/pdf/excel`
  - u. v. m.

### 3. **Bewertungslogik**
- Bewertet alle aktiven Ideen mit den aktiven Kombinationen
- Berücksichtigt Gewichtungen (Skala 0–5)
- Berechnet Score je Idee
- Bewertet ob hoher oder niedriger Wert besser ist (aus Excel)

### 4. **Logging / Speicherung**
- Bewertungsdurchläufe werden gespeichert (z. B. in `/logs/`)
- Als CSV, JSON oder Excel – konfigurierbar
- Wenn `App-Tester` aktiv → kein Logging
- Wenn `datapopup = on` → anonyme Datenabfrage vor Berechnung

---

## 🧠 Frontend-Komponenten (React)

### 1. **Daten-Auswahl**
- Auswahl zwischen:
  - Aktuelle Ideensammlung / Eigene hochladen
  - Aktuelle Kombisammlung / Eigene hochladen
- Uploads werden gespeichert mit UUID
- Blanko-Dateien zum Download

### 2. **Bewertungsmatrix**
- Kombinationen mit Gewichtung (0 = deaktiviert)
- Info-Symbole mit Erklärung aus Excel
- Kategorien (z. B. CO2, Finanzen) gruppiert

### 3. **Ideenübersicht**
- Liste aller Ideen mit Beschreibung (aus Excel)
- Checkbox: Idee deaktivieren

### 4. **Auswertung**
- Platz 1, 2, 3 … mit Score
- Ausklappbare Tabellen mit berechneten Werten
- Einheit pro Kombination wird angezeigt
- Export: Top 10, 20, 50 oder alle → CSV/PDF

### 5. **Statistiken**
- Button „Statistiken anzeigen“ (derzeit nur Hinweistext)
- Später: Visualisierungen & Meta-Auswertung geplant

---

## 📝 Upload-Handling

- Eigene Dateien (Ideen / Kombinationen) werden unter `backend/uploads/selectionideas/` bzw. `backend/uploads/selectioncombis/` gespeichert
- Dateiname basiert auf UUID
- Diese UUID wird beim Bewertungsdurchlauf mitgeloggt

---

## 🛠 Entwicklungsstrategie

Dieses Projekt wird **schrittweise** aufgebaut. Nach jedem abgeschlossenen Schritt wird der Code auf GitHub hochgeladen. ChatGPT kann bei Bedarf die GitHub-Dateien erneut lesen, sollte ein Reset stattfinden.

---

## 🔗 GitHub-Repo

Alle Dateien befinden sich unter:  
👉 [https://github.com/Gruppe4-Projektentwicklung/matrix_v1](https://github.com/Gruppe4-Projektentwicklung/matrix_v1)

---

*Letzte Aktualisierung durch ChatGPT: (18.06.2025:16:15)*
