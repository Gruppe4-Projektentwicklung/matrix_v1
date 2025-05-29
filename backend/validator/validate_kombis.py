import pandas as pd

REQUIRED_FORMEL_SPALTE = 'FormelID'

def validate_kombi_excel(path: str) -> list[str]:
    try:
        raw = pd.read_excel(path, header=None, dtype=str, keep_default_na=False)
    except Exception as e:
        return [f"Excel konnte nicht geladen werden: {e}"]

    errors = []

    if raw.shape[0] < 3:
        return ["Die Excel-Datei muss mindestens drei Zeilen haben (IDs, Labels, Daten)."]

    spalten_ids = [str(val).strip() for val in raw.iloc[0]]
    daten = raw.iloc[2:].copy()
    daten.columns = spalten_ids

    if REQUIRED_FORMEL_SPALTE not in daten.columns:
        errors.append(f"Pflichtspalte '{REQUIRED_FORMEL_SPALTE}' fehlt.")

    return errors
