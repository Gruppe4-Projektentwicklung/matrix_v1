# DOKUMENTATION – Projektüberblick in einfacher Sprache

Dieses Dokument erklärt das Matrix-Tool so, dass auch Menschen ohne Programmierkenntnisse verstehen, wie es funktioniert. Hier findest du einen Überblick über Ziele, Aufbau, Nutzung und den aktuellen Fortschritt des Projekts.

---

## 1. Worum geht es bei diesem Tool?

Viele Ideen zum nachhaltigen Bauen sollen objektiv bewertet werden. Dazu werden verschiedene Kennzahlen miteinander kombiniert. Jede Idee bekommt am Ende einen "Score", der zeigt, wie gut sie im Vergleich zu den anderen abschneidet. Benutzerinnen und Benutzer können die Wichtigkeit einzelner Kennzahlen selbst festlegen, Ideen deaktivieren und eine persönliche Rangliste erstellen.

---

## 2. Wie starte ich die Anwendung?

1. **Backend vorbereiten**
   - Du benötigst Python und ein paar Bibliotheken. Installiere sie mit:
     ```bash
     python -m pip install -r backend/requirements.txt
     ```
   - Die Datenbank wird automatisch beim ersten Start erstellt. Du musst nichts weiter tun.
2. **Frontend vorbereiten**
   - Wechsle in den Ordner `frontend` und installiere die Abhängigkeiten:
     ```bash
     cd frontend
     npm install
     ```
   - Für einen schnelleren Einstieg gibt es auch das Skript `./codex-setup.sh`, das diesen Schritt erledigt.
3. **Anwendung starten**
   - Backend: `uvicorn backend.main:app --reload`
   - Frontend: `npm run dev` im Ordner `frontend`
   - Öffne anschließend `http://localhost:5173` in deinem Browser.

---

## 3. Wie ist das Projekt aufgebaut?

- **backend/** – Der FastAPI-Server. Kümmert sich um Uploads, Berechnungen und das Speichern von Ergebnissen.
- **frontend/** – Die React-Oberfläche. Hier klickt sich der Nutzer durch die einzelnen Schritte.
- **templates/** – Leere Excel-Dateien als Vorlage. Daran orientieren sich auch eigene Uploads.
- **matrixconfig.ini** – Hier lassen sich Standarddateien und verschiedene Optionen einstellen.

Der gesamte Quellcode liegt auf GitHub: [matrix_v1](https://github.com/Gruppe4-Projektentwicklung/matrix_v1).

---

## 4. Schritt-für-Schritt durch die Bedienung

1. **Startseite**
   - Beim ersten Aufruf erzeugt das Tool eine eindeutige Session-ID.
   - Kurzer Einführungstext erklärt das Ziel der Anwendung.
2. **Daten auswählen**
   - Du kannst fertige Ideensammlungen und Kombinationslisten nutzen oder eigene Excel-Dateien hochladen.
   - Hochgeladene Dateien werden im Ordner `backend/uploads/sessions/` abgelegt.
3. **Ideen wählen**
   - In einer Liste lassen sich Ideen aktivieren oder deaktivieren.
   - Such- und Filterfunktionen erleichtern das Finden bestimmter Einträge.
4. **Kombinationen gewichten**
   - Hier legst du fest, wie wichtig einzelne Kennzahlen sind (0 bis 5).
   - Ein Informationssymbol zeigt Erklärungen aus der Excel-Datei an.
5. **Persönliche Angaben (optional)**
   - Ein kleines Formular fragt nach Altersgruppe, Geschlecht und Berufserfahrung.
   - Diese Daten helfen später bei statistischen Auswertungen.
6. **Zusammenfassung**
   - Alle Einstellungen werden übersichtlich angezeigt.
   - Ein Klick auf "Berechnen" startet die Auswertung.
7. **Ergebnis**
   - Die Rangliste zeigt die Ideen sortiert nach Score.
   - Ergebnisse können als CSV exportiert werden.

Während jedes dieser Schritte protokolliert das Backend anonyme Nutzungsdaten, sofern diese Funktion in `matrixconfig.ini` aktiviert ist. So lassen sich später Statistiken erstellen, welche Kombinationen besonders häufig gewählt wurden.

---

## 5. Bisherige Entwicklung

- Das Grundgerüst aus FastAPI im Backend und React im Frontend steht.
- Eine erste Version der Bewertungslogik ist implementiert.
- Excel-Vorlagen vereinfachen das Anlegen eigener Ideen- und Kombinationslisten.
- Hochgeladene Dateien werden automatisch geprüft.
- Die Benutzeroberfläche besteht mittlerweile aus mehreren übersichtlichen Seiten.
- Nutzungsdaten können auf Wunsch gespeichert werden.

---

## 6. Offene Arbeitspunkte

- Navigationsmenü einbauen, damit man Seiten direkt anspringen kann.
- Gemeinsamen Zustand im Frontend per React Context verwalten.
- Fehlermeldungen zentral anzeigen (ErrorPage und 404-Seite).
- Ergebnisse auch als PDF exportieren.
- Auswertung der gesammelten Nutzungsdaten vorbereiten.
- Letzter Kompletttest aller Funktionen.

Diese Liste wird regelmäßig erweitert und angepasst.

---

## 7. Häufige Fragen

**Muss ich programmieren können, um das Tool zu nutzen?**
: Nein. Sobald die Anwendung läuft, klickst du dich nur noch durch die Webseiten.

**Kann ich eigene Kennzahlen erfinden?**
: Ja. Bearbeite einfach die Excel-Vorlage für Kombinationen und lade die Datei hoch.

**Wie lösche ich meine Daten?**
: Im Ordner `backend/uploads/sessions/` liegt alles, was du hochgeladen hast. Die Dateien lassen sich dort entfernen.

**Warum sehe ich manchmal nur englische Texte?**
: Die Standardsprache ist Englisch. Über das kleine Menü oben rechts kannst du auf Deutsch oder Französisch umstellen.

---

## 8. Glossar wichtiger Begriffe

- **Idee** – ein Vorschlag für ein nachhaltiges Produkt oder Verfahren.
- **Kombination** – eine Kennzahl, die aus mehreren Attributen gebildet wird, z. B. `CO2/Jahr`.
- **Session** – eine anonyme Sitzung. Solange sie aktiv ist, bleiben deine Uploads erhalten.
- **Score** – das Ergebnis der Berechnung. Je höher, desto besser schneidet eine Idee ab.
- **Backend** – der Teil des Projekts, der auf dem Server läuft und alles berechnet.
- **Frontend** – die Benutzeroberfläche im Browser.

---

## 9. Hinweise für zukünftige Arbeiten

Wenn dieses Projekt weiterentwickelt wird, sollte jede neue Funktion kurz hier dokumentiert werden. So bleibt der Überblick erhalten, auch wenn mehrere Personen daran arbeiten.

---

*Letzte Aktualisierung durch ChatGPT: (20.06.2025)*

---

## 10. Weiterführende Ressourcen

- Die Excel-Vorlagen im Ordner `backend/templates/` zeigen das erforderliche Format.
- Im Verzeichnis `backend/api/` finden sich Beispielrouten, über die das Frontend kommuniziert.
- In `frontend/src/i18n/` liegen die Sprachdateien. Dort lassen sich sämtliche Texte der Benutzeroberfläche anpassen.
- Wer tiefer einsteigen möchte, kann im Ordner `backend/scripts/` kleine Hilfsprogramme finden, z.B. zum Erzeugen von Platzhalterdaten.

---

*Dieses Dokument wird fortlaufend erweitert, sobald neue Funktionen hinzukommen oder sich am Projektablauf etwas ändert.*

---

## 11. Kontakt

Fragen oder Verbesserungsvorschläge können jederzeit im GitHub-Repository als Issue gemeldet werden. Alternativ steht das Projektteam per E‑Mail unter `info@gruppe4-projektentwicklung.de` zur Verfügung.

