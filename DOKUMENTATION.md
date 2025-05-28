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

### 🔜 Schritt 2: Backend-Grundgerüst erstellen
- Ordner `backend/` anlegen
- FastAPI-Projekt mit `main.py`
- Routen:
  - `/api/konfiguration` → lädt `matrixconfig.ini`
  - `/api/vorlage/ideen` → lädt leeres Template
  - `/api/vorlage/kombis` → lädt leeres Template
  - `/api/upload/ideen` → lädt Nutzerdatei hoch
  - `/api/upload/kombis` → lädt Nutzerdatei hoch
- Dummy-Daten in `AktuelleSammlung/`

### 🔜 Schritt 3: Frontend-Grundstruktur (React)
- Auswahlfelder für aktuelle / eigene Sammlung
- Multiple-Choice-Matrix zur Gewichtung
- Platzhalter-Logik für Berechnung + Ranking

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

*Letzte Aktualisierung durch ChatGPT: (28.05.2025:13:07)*
