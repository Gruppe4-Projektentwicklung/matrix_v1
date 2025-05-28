# Architekturplan – Matrix-Tool zur Bewertung nachhaltiger Produktideen

Dieses Dokument beschreibt die geplante Architektur, Struktur und Komponenten des Matrix-Bewertungstools. Es dient der Selbstdokumentation für ChatGPT, um nach einem Chat-Reset oder längerer Pause jederzeit den aktuellen Aufbau und die Zielstruktur wieder zu verstehen.

---

## 🎯 Ziel des Tools

Das Tool dient dazu, rund 145 Produktideen aus dem Bereich nachhaltiges Bauen zu bewerten. Diese sind sehr unterschiedlich (z. B. Luftspeicherkraftwerk vs. Zementsack).  
Durch Kombination von Attributen (aus einer Excel-Tabelle) sollen vergleichbare Kennwerte entstehen. Nutzer können die Wichtigkeit dieser Kombinationen gewichten, Ideen deaktivieren und so ein individuelles Ranking berechnen lassen.

---

## 📁 Projektstruktur

/backend/
server.py ← Haupt-API: Upload, Bewertung, Statistik, Session
excel_loader.py ← Einlesen & Validieren von Excel-Dateien (mehrsprachig, IDs)
config_loader.py ← Einlesen Konfigurationsdateien (matrixconfig etc.)
bewertung.py ← Bewertungslogik: Kombinationen, Gewichtungen, Richtung
save_run.py ← (Blueprint) Speichern der Bewertungsläufe/Statistiken

/frontend/
components/
IdeenSelector.tsx ← Anzeige und Auswahl der Ideen, Attribut-Details, Mehrsprachigkeit
CollectionSelector.tsx ← Dropdown & Upload für Ideensammlungen / Kombis
WeightingSelector.tsx ← Gewichtung der Kombinationen
BewertungsOptionen.tsx ← Optionen, z. B. Runden-Auswahl, Aktivieren/Deaktivieren
Ranking.tsx ← (noch offen) Ranking- und Ergebnisanzeige
StatistikForm.tsx ← (offen) Formular für Demografie/Statistikdaten

/templates/
ideen_template.xlsx ← Vorlage für Ideensammlung (IDs, Sprachen, Attribute)
kombis_template.xlsx ← Vorlage für Kombinationen (IDs, Sprachen, Formeltext)

/storage/
ideen/ ← Persistente User-Uploads (für Statistik, mit eindeutiger ID im Namen)
kombis/ ← Persistente Kombi-Uploads
runs/ ← Persistente Bewertungsläufe als JSON (inkl. User-Eingaben, Metadaten)

DOKUMENTATION.md ← Ausführliche Beschreibung der Funktionsweise und Tabellenstruktur
ARCHITEKTUR.md ← Dieses Architektur-Dokument
README_DE.md/README_EN.md ← Kurzbeschreibung, Nutzungshinweise, ToDo-Liste

---

## **2. Ablauf & Datenfluss**

1. **Upload**
   - Nutzer wählt aktuelle oder eigene Ideensammlung/Kombisammlung aus (Excel, Templates).
   - Uploads werden **in der Session** zwischengespeichert (Dropdown-Auswahl) UND, wenn **kein Tester-Modus** aktiv, persistent im `storage`-Ordner mit UUID gespeichert.

2. **Konfiguration & Bewertung**
   - User gewichtet Kombinationen, aktiviert/deaktiviert Attribute, wählt Sprache etc.
   - Bewertungslogik (`bewertung.py`) liest Excel, wertet Formeln aus, berechnet Scores, berücksichtigt Richtung (high/low).

3. **Ranking**
   - Zeigt sortierte Ergebnisliste nach Score (Platz 1


## ⚙️ Backend-Komponenten (FastAPI)

### 1. **Excel-Verarbeitung**
- Liest eine Ideensammlung und eine Kombinationssammlung (aus `AktuelleSammlung/` oder Upload)
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

- Eigene Dateien (Ideen / Kombinationen) werden unter `/uploads/ideen/` bzw. `/uploads/kombis/` gespeichert
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

*Letzte Aktualisierung durch ChatGPT: (28.05.2025:13:03)*
