# Datenbankeinrichtung

Dieses Projekt nutzt eine kleine SQLite-Datenbank, um Berechnungen und Nutzungsdaten zu speichern. Die Datenbankdatei `backend/matrix.db` wird automatisch angelegt, sobald das Backend startet.

## Benötigte Pakete

Installiere zuerst die Python-Abhängigkeiten des Backends. Darin ist auch **SQLAlchemy** enthalten, das als ORM für die SQLite-Datenbank dient.

```bash
python -m pip install -r backend/requirements.txt
```

## Erstinitialisierung

Beim Start des FastAPI-Backends führt die Funktion `init_db()` in `backend/database.py` automatisch alle nötigen Tabellenmigrierungen aus. Du musst also keine separaten Befehle ausführen. Starte einfach das Backend wie gewohnt:

```bash
uvicorn backend.main:app --reload
```

Nach dem ersten Start findest du die Datei `backend/matrix.db`. Sie ist in `.gitignore` eingetragen und wird deshalb nicht committet.
