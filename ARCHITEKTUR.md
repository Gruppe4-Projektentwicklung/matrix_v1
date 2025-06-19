# Architekturplan – Matrix-Tool zur Bewertung nachhaltiger Produktideen

Dieses Dokument beschreibt die geplante Architektur, Struktur und Komponenten des Matrix-Bewertungstools. Es dient der Selbstdokumentation für ChatGPT, um nach einem Chat-Reset oder längerer Pause jederzeit den aktuellen Aufbau und die Zielstruktur wieder zu verstehen.

---

## 🎯 Ziel des Tools

Das Tool dient dazu, rund 145 Produktideen aus dem Bereich nachhaltiges Bauen zu bewerten. Diese sind sehr unterschiedlich (z. B. Luftspeicherkraftwerk vs. Zementsack).  
Durch Kombination von Attributen (aus einer Excel-Tabelle) sollen vergleichbare Kennwerte entstehen. Nutzer können die Wichtigkeit dieser Kombinationen gewichten, Ideen deaktivieren und so ein individuelles Ranking berechnen lassen.

---

## 📁 Projektstruktur


**/backend/**
- main.py ← Haupt‑API für Upload, Bewertung und Sessions
- loader/excel_loader.py ← Excel‑Import & Validierung
- config_loader.py ← lädt `matrixconfig.ini`
- bewertung.py ← Bewertungslogik der Kombinationen
- api/ ← Routen (z. B. `/save_run`)
- uploads/selectionideas/ und uploads/selectioncombis/ ← persistente Uploads
- templates/ ← Excel‑Vorlagen

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
  StartPage.tsx – Einstieg und Sessionstart
  SelectDataPage.tsx – Daten auswählen oder hochladen
  IdeaSelectionPage.tsx – Ideen aktivieren/deaktivieren
  CombinationSelectionPage.tsx – Kombinationen gewichten
  PersonalDataPage.tsx – optionale Angaben
  ConfigSummaryPage.tsx – Zusammenfassung vor Berechnung
  CalcResultsPage.tsx – Ergebnisse und Export
  UploadPage.tsx – separate Upload-Seite
i18n/
  index.ts – initialisiert i18n
  common.ts – Übersetzungstexte (de/en/fr)

/backend/templates/ ← Excel-Vorlagen
/backend/uploads/
  selectionideas/ ← hochgeladene Ideensammlungen
  selectioncombis/ ← hochgeladene Kombinationssammlungen

DOKUMENTATION.md ← Ausführliche Beschreibung

**/backend/**
/backend/


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

/frontend/src/
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
StartPage.tsx, SelectDataPage.tsx, UploadPage.tsx,

main.py ← Haupt-API für Upload, Bewertung, Statistik und Session
loader/excel_loader.py ← Einlesen & Validieren von Excel-Dateien
config_loader.py ← Laden der Konfiguration (`matrixconfig.ini`)
bewertung.py ← Bewertungslogik für Kombinationen und Gewichtungen
api/ ← Routen (z. B. `/save_run`)

/frontend/src/
components/
IdeenSelector.tsx ← Anzeige und Auswahl der Ideen
CollectionSelectorIdeas.tsx / CollectionSelectorKombis.tsx ← Dropdown & Upload
WeightingSelector.tsx ← Gewichtung der Kombinationen
BewertungsOptionen.tsx ← Optionen wie Runden-Auswahl
Ranking.tsx ← Ranking- und Ergebnisanzeige
StatistikForm.tsx ← Formular für Demografie/Statistikdaten
StatusToast.tsx / SaveRunSuccess.tsx ← Rückmeldungen
pages/
StartPage.tsx, SelectDataPage.tsx,

IdeaSelectionPage.tsx, CombinationSelectionPage.tsx,
PersonalDataPage.tsx, ConfigSummaryPage.tsx,
CalcResultsPage.tsx ← Einzelseiten der App
i18n/

index.ts ← Initialisiert i18next
common.ts ← Übersetzungstexte (de/en/fr)

index.ts ← Initialisiert die Übersetzungen
common.ts ← Sprachdateien (de/en/fr)


/templates/
ideen_template.xlsx ← Vorlage für Ideensammlung (IDs, Sprachen, Attribute)
kombis_template.xlsx ← Vorlage für Kombinationen (IDs, Sprachen, Formeltext)

/backend/uploads/
selectionideas/ ← hochgeladene Ideensammlungen
selectioncombis/ ← hochgeladene Kombinationssammlungen

DOKUMENTATION.md ← Ausführliche Beschreibung der Funktionsweise und Tabellenstruktur

ARCHITEKTUR.md ← Dieses Architektur-Dokument
README_DE.md/README_EN.md ← Kurzbeschreibung, Nutzungshinweise

## **2. Ablauf & Datenfluss**

1. **Start**
   - Die `StartPage` startet eine neue Session und zeigt eine kurze Einführung.
   - Auf der `SelectDataPage` wählt der Nutzer bestehende Sammlungen oder öffnet die `UploadPage` für eigene Dateien. Uploads werden sessionspezifisch in `backend/uploads/` gespeichert.

2. **Ideen und Kombinationen**
   - Auf der `IdeaSelectionPage` lassen sich Ideen aktivieren oder deaktivieren.
   - Danach legt die `CombinationSelectionPage` die Gewichtung der Kombinationen fest; weitere Optionen bietet `BewertungsOptionen.tsx`.
   - Alle Texte werden aus `src/i18n/common.ts` geladen und in `src/i18n/index.ts` initialisiert.

3. **Persönliche Angaben & Zusammenfassung**
   - Optional erfasst die `PersonalDataPage` statistische Informationen.
   - Anschließend fasst die `ConfigSummaryPage` alle Einstellungen zusammen.

4. **Berechnung & Ergebnis**
   - Das Backend berechnet über `bewertung.py` das Ranking und speichert den Durchlauf via `save_run`.
   - Die `CalcResultsPage` präsentiert das Ergebnis und bietet Exportfunktionen.
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


   - Die `StartPage` erzeugt eine Session und führt zur `SelectDataPage`.
   - Dort wählt der Nutzer Ideensammlung und Kombinationssammlung oder lädt eigene Excel-Dateien hoch. Uploads bleiben zuerst in der Session und werden – sofern kein App‑Tester‑Modus aktiv ist – in `backend/uploads/` gespeichert.

2. **Ideen und Kombinationen festlegen**
   - In der `IdeaSelectionPage` lassen sich Ideen ein‑ oder ausblenden.
   - Die `CombinationSelectionPage` ermöglicht das Gewichtung der Kombinationen. `BewertungsOptionen.tsx` stellt Zusatzoptionen bereit.
   - Sämtliche Texte kommen aus `src/i18n/common.ts` und werden über `src/i18n/index.ts` geladen.

3. **Persönliche Angaben & Zusammenfassung**
   - Die `PersonalDataPage` fragt auf Wunsch Statistikdaten ab.
   - Danach zeigt die `ConfigSummaryPage` eine Zusammenfassung aller Einstellungen.

4. **Berechnung & Ergebnisse**
   - Das Backend ruft die Bewertungslogik (`bewertung.py`) auf und speichert den Lauf über die Route `save_run`.
   - Die `CalcResultsPage` zeigt das Ranking der Ideen mit Export‑Möglichkeit.

   - Die `StartPage` leitet auf die `SelectDataPage` weiter.
   - Dort wählt der Nutzer Ideensammlung und Kombinationssammlung oder lädt eigene Excel-Dateien hoch. Uploads bleiben zunächst in der Session und werden – sofern kein App-Tester-Modus aktiv ist – im Ordner `storage` gespeichert.

2. **Ideen und Kombinationen festlegen**
   - In der `IdeaSelectionPage` werden Ideen aktiviert oder deaktiviert.
   - Die `CombinationSelectionPage` erlaubt die Gewichtung der Kombinationen. Über `BewertungsOptionen.tsx` lassen sich weitere Optionen wählen.
   - Alle Texte stammen aus `src/i18n/common.ts` und werden zentral über `src/i18n/index.ts` geladen.

3. **Persönliche Angaben & Zusammenfassung**
   - Die `PersonalDataPage` sammelt optionale Statistikdaten.
   - Anschließend zeigt die `ConfigSummaryPage` einen Überblick aller Einstellungen.

4. **Berechnung & Ergebnisse**
   - Das Backend ruft die Bewertungslogik (`bewertung.py`) auf und speichert den Lauf über die Route `save_run`.
   - Die `CalcResultsPage` präsentiert das Ranking der Ideen.



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
*Letzte Aktualisierung durch ChatGPT: (19.06.2025:11:16)*

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
- Zusätzlich protokolliert `/log_step` jeden Schritt einer Session im Ordner `archive/`
- Die Route `/save_run` legt das Ergebnis einer Bewertung als JSON-Datei ab.
- Beide Endpoints werden im Frontend über `VITE_API_URL` aufgerufen.

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

*Letzte Aktualisierung durch ChatGPT: (19.06.2025:11:16)*
