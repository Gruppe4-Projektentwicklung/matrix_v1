# ARCHITEKTUR – Das Matrix-Tool Schritt für Schritt erklärt

Dieses Dokument soll allen Interessierten – auch ohne tiefe IT-Kenntnisse – einen umfassenden Überblick über den Aufbau und die Funktionsweise des Matrix-Tools geben. Es beschreibt, welche Ordner welche Aufgaben haben, wie die einzelnen Komponenten zusammenspielen und wie aus Excel-Dateien am Ende eine übersichtliche Rangliste entsteht.

---

## 1. Grundgedanke

Das Matrix-Tool hilft dabei, viele unterschiedliche Produktideen aus dem Bereich nachhaltiges Bauen miteinander zu vergleichen. Jede Idee besitzt bestimmte Eigenschaften, etwa Kosten, CO₂-Ausstoß oder Lebensdauer. Mehrere dieser Eigenschaften lassen sich zu sogenannten **Kombinationen** zusammenfassen. Nutzerinnen und Nutzer können einstellen, welche Kombinationen wichtig sind und welche weniger. Am Ende ergibt sich pro Idee ein Wert, der **Score**, aus dem eine Rangliste berechnet wird.

---

## 2. Wichtigste Ordner im Überblick

| Ordner/Datei            | Kurzbeschreibung                                                  |
|-------------------------|------------------------------------------------------------------|
| `backend/`              | Enthält den FastAPI-Server, die Datenbank und die Bewertungslogik |
| `frontend/`             | Beinhaltet die React-App, also alles, was im Browser angezeigt wird |
| `templates/`            | Vorlagen für Excel-Dateien, an denen sich eigene Uploads orientieren |
| `backend/uploads/`      | Dort landen alle hochgeladenen Dateien, sortiert nach Session-IDs |
| `matrixconfig.ini`      | Zentrale Konfigurationsdatei für Standardwerte und Optionen       |

Diese Struktur sorgt dafür, dass sich Backend und Frontend klar trennen lassen und trotzdem miteinander kommunizieren können.

---

## 3. Das Backend ausführlich erklärt

Das Backend basiert auf [FastAPI](https://fastapi.tiangolo.com/), einem modernen Python-Webframework. Die wichtigsten Bestandteile sind:

### 3.1 `main.py`
Hier startet die Anwendung. Es werden verschiedene API-Endpunkte definiert, z.B. für Datei-Uploads, Berechnungen oder das Speichern von Nutzungsdaten. Über die **CORS-Einstellungen** wird festgelegt, welche Webseiten auf das Backend zugreifen dürfen.

### 3.2 `bewertung.py`
In dieser Datei steckt das Herzstück der Berechnung. Sie liest die hochgeladenen Excel-Dateien ein, wendet Formeln auf die Daten an und gewichtet sie. Die Ergebnisse werden als Score pro Idee ausgegeben.

### 3.3 `loader/`
Dieses Unterverzeichnis enthält Hilfsfunktionen zum Einlesen und Prüfen der Excel-Dateien. Fehlerhafte oder unvollständige Dateien werden so frühzeitig erkannt.

### 3.4 `database.py`
Hier wird eine kleine SQLite-Datenbank verwaltet. Sie speichert Berechnungen und – wenn gewünscht – anonymisierte Nutzungsdaten. Die Datenbankdatei wird automatisch angelegt, sobald das Backend startet.

### 3.5 `api/`
Weitere Routen sind ausgelagert, zum Beispiel zum Speichern eines Bewertungslaufs (`/save_run`) oder zum Protokollieren einzelner Nutzeraktionen (`/log_step`).

Alle Backend-Komponenten greifen auf die Einstellungen in `matrixconfig.ini` zu. Dort lässt sich etwa einstellen, ob Nutzungsdaten gespeichert werden sollen oder welche Dateien als Standard genutzt werden.

---

## 4. Das Frontend ausführlich erklärt

Das Frontend ist mit [React](https://react.dev/) umgesetzt und nutzt [Vite](https://vitejs.dev/) als Entwicklungsumgebung. Die wichtigsten Bereiche sind:

### 4.1 `src/pages/`
Jede Datei in diesem Ordner stellt eine komplette Seite dar. Beispiele sind `StartPage.tsx`, `SelectDataPage.tsx` oder `CalcResultsPage.tsx`. Über ein kleines Navigationssystem gelangt man Schritt für Schritt durch den Bewertungsprozess.

### 4.2 `src/components/`
Hier finden sich wiederverwendbare Bausteine wie Tabellen, Buttons oder Formularfelder. Diese Komponenten sorgen dafür, dass die Oberfläche einheitlich aussieht.

### 4.3 `src/i18n/`
Alle Texte der Benutzeroberfläche sind in diesem Ordner gesammelt. Dadurch lässt sich das Tool leicht in mehrere Sprachen übersetzen. Aktuell sind Deutsch, Englisch und Französisch vorhanden.

### 4.4 `api.ts`
Dieser kleine Helfer stellt sicher, dass das Frontend die richtigen Endpunkte im Backend aufruft. Die Basis-URL wird über eine Umgebungsvariable (`VITE_API_URL`) gesteuert.

Beim Start des Frontends mit `npm run dev` wird ein lokaler Entwicklungsserver gestartet, der Änderungen sofort anzeigt. Für den Produktivbetrieb lassen sich optimierte Dateien erzeugen (`npm run build`).

---

## 5. Datenfluss von Anfang bis Ende

1. **Start** – Eine neue Session-ID wird erzeugt und im Browser gespeichert.
2. **Datenauswahl** – Nutzer wählen vorhandene Excel-Dateien aus oder laden eigene hoch. Die Dateien werden in `backend/uploads/sessions/<ID>/` gespeichert.
3. **Ideenauswahl** – Eine Tabelle listet alle Ideen aus der gewählten Sammlung auf. Nicht benötigte Ideen lassen sich deaktivieren.
4. **Kombinationsgewichtung** – In einer weiteren Tabelle werden die Kombinationen angezeigt. Jeder Eintrag erhält eine Gewichtung von 0 bis 5.
5. **Optionale Angaben** – Ein Formular fragt anonyme Statistikinformationen ab.
6. **Zusammenfassung** – Vor der Berechnung werden alle Einstellungen noch einmal übersichtlich dargestellt.
7. **Berechnung** – Das Frontend sendet die Daten an das Backend. Dort werden alle aktiven Ideen anhand der gewichteten Kombinationen bewertet.
8. **Ergebnis** – Eine Rangliste zeigt, welche Idee den höchsten Score erreicht hat. Zusätzlich kann man die Daten herunterladen.
9. **Speichern** – Auf Wunsch werden die Ergebnisse und die gewählten Einstellungen in der Datenbank archiviert.
10. **Ende** – Die Session kann beendet oder neu gestartet werden, woraufhin alle temporären Dateien gelöscht werden.

---

## 6. Datenbank und Speicherung

Die SQLite-Datenbank `backend/matrix.db` enthält zwei Haupttabellen:

- **Calculation** – speichert jeden vollständigen Bewertungslauf mit Zeitstempel, verwendeten Dateien und dem Ergebnis als JSON.
- **UsageLog** – protokolliert einzelne Nutzeraktionen, sofern die Option `backend_logging` aktiviert ist. Jede Aktion wird mit einer Session-ID verknüpft.

Die Datenbank wird beim Start des Backends automatisch aktualisiert. Wer sie sich ansehen möchte, kann sie mit gängigen SQLite-Tools öffnen.

---

## 7. Die Konfigurationsdatei `matrixconfig.ini`

Diese Datei regelt viele Verhalten des Tools. Ein paar wichtige Beispiele:

- Welches Ideen- und Kombinations-Excel als Standard geladen wird.
- In welchem Ordner Uploads landen (`upload_dir`).
- Ob anonyme Nutzungsdaten gesammelt werden (`backend_logging`).
- Ob vor der Berechnung ein Daten-Popup erscheint (`datapopup`).

Durch Anpassen dieser Werte lässt sich das Tool leicht an verschiedene Einsatzzwecke anpassen.

---

## 8. Umgang mit Uploads

Alle hochgeladenen Dateien werden zunächst in einem Session-Ordner abgelegt. Ist der sogenannte **App-Tester-Modus** ausgeschaltet, werden diese Dateien außerdem dauerhaft in `backend/uploads/selectionideas/` oder `backend/uploads/selectioncombis/` gespeichert. So können sie in späteren Sessions wieder genutzt werden. Die Dateinamen enthalten eine zufällige UUID, sodass keine Rückschlüsse auf die Nutzer gezogen werden können.

---

## 9. Beispielhafter Ablauf

Damit der gesamte Prozess greifbarer wird, hier ein vereinfachtes Beispiel:

1. Anna startet das Tool im Browser. Eine neue Session-ID wird erstellt.
2. Sie entscheidet sich für die mitgelieferte Ideensammlung und lädt eine eigene Excel-Datei für die Kombinationen hoch.
3. Auf der Ideenauswahl deaktiviert sie zwei Einträge, die für sie nicht relevant sind.
4. Bei den Kombinationen setzt sie besonders hohe Gewichtungen auf die Themen CO₂ und Kosten.
5. Die optionalen Statistikfelder lässt sie leer.
6. In der Zusammenfassung überprüft sie ihre Eingaben und startet die Berechnung.
7. Wenige Sekunden später sieht sie eine Rangliste, in der ihre favorisierte Idee auf Platz 1 landet.
8. Anna lädt das Ergebnis als CSV-Datei herunter und beendet ihre Session.

So oder ähnlich sieht der typische Ablauf für alle Nutzerinnen und Nutzer aus.

---

## 10. Technischer Steckbrief

- **Programmiersprache Backend:** Python 3
- **Framework Backend:** FastAPI
- **Programmiersprache Frontend:** TypeScript mit React
- **Build-Tool:** Vite
- **Datenbank:** SQLite (Datei `backend/matrix.db`)
- **Weitere Tools:** pandas für Excel-Verarbeitung, SQLAlchemy als ORM, Tailwind CSS für das Design

Diese Kombination sorgt für eine schlanke, aber flexible Architektur.

---

## 11. Glossar

- **FastAPI** – schnelles Python-Framework zum Erstellen von Web-APIs.
- **React** – JavaScript-Bibliothek zur Erstellung interaktiver Benutzeroberflächen.
- **Vite** – Entwicklungsumgebung für moderne Webprojekte mit Hot-Reload.
- **ORM** – Objekt-Relationaler Mapper; erlaubt den einfachen Zugriff auf Datenbanken.
- **CSV** – Dateiformat für Tabellen, das von nahezu allen Programmen gelesen werden kann.

---

## 12. Wie kann man das Projekt erweitern?

Wer eigene Funktionen ergänzen möchte, kann folgendermaßen vorgehen:

1. **Neue Seiten im Frontend** lassen sich im Ordner `frontend/src/pages/` anlegen. Von dort können sie über das Routing erreichbar gemacht werden.
2. **Weitere API-Routen** können im Backend unter `backend/api/` erstellt werden. Anschließend sollten sie im Frontend über `api.ts` eingebunden werden.
3. **Weitere Übersetzungen** erhalten Platz in `frontend/src/i18n/common.ts`.
4. **Tests** können mit `pytest` für das Backend oder `Vitest` für das Frontend geschrieben werden.

Durch die klare Trennung bleibt das Projekt auch bei neuen Features übersichtlich.

---

## 13. Letzter Blick in das Repository

Alle Quellen sind öffentlich einsehbar unter [github.com/Gruppe4-Projektentwicklung/matrix_v1](https://github.com/Gruppe4-Projektentwicklung/matrix_v1). Dort findest du auch eine Historie aller Änderungen.

---

*Letzte Aktualisierung durch ChatGPT: (20.06.2025)*
