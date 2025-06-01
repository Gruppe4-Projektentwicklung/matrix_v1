import pandas as pd

def validate_ideen_excel(dateipfad, templatepfad):
    errors = []
    try:
        df = pd.read_excel(dateipfad, header=None, dtype=str)
        df_template = pd.read_excel(templatepfad, header=None, dtype=str)
    except Exception as e:
        errors.append(f"Fehler beim Lesen der Datei: {e}")
        print("[Validator] Fehler beim Lesen:", e)
        return errors

    # IDs der Spalten (erste Zeile in beiden Dateien)
    spalten_ids = [str(val).strip() for val in df.iloc[0]]
    spalten_ids_template = [str(val).strip() for val in df_template.iloc[0]]

    # Logging für Debug
    print("[Validator] Spalten in deiner Datei:", spalten_ids)
    print("[Validator] Spalten im Template   :", spalten_ids_template)

    # Prüfen, ob ALLE Template-Spalten in der Datei sind
    for col in spalten_ids_template:
        if col not in spalten_ids:
            errors.append(f"Spalte {col} fehlt in deiner Datei.")

    # Reihenfolge-Check DEAKTIVIERT (zu streng!):
    # if spalten_ids != spalten_ids_template:
    #     errors.append("Spalten stimmen nicht exakt mit dem Template überein.")

    # Mindestens 3 Zeilen?
    if df.shape[0] < 3:
        errors.append("Zu wenige Zeilen (mindestens 3 erforderlich).")

    # Ergebnis zurückgeben (leere Liste == alles ok)
    return errors
