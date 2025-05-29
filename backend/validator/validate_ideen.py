import pandas as pd

REQUIRED_TEXT_SPALTEN = ['#t#1', '#t#2']
REQUIRED_ATTRIBUT_PREFIX = '#-#'
REQUIRED_EINHEIT_PREFIX = '#+#'

def validate_ideen_excel(path: str) -> list[str]:
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

    # Pflichtspalten prüfen
    for col in REQUIRED_TEXT_SPALTEN:
        if col not in daten.columns:
            errors.append(f"Pflichtspalte {col} fehlt.")

    # Attribut-/Einheit-Paare prüfen
    attribut_cols = [col for col in daten.columns if col.startswith(REQUIRED_ATTRIBUT_PREFIX)]
    for col in attribut_cols:
        id_nr = col.split(REQUIRED_ATTRIBUT_PREFIX)[-1]
        einheit_col = f"{REQUIRED_EINHEIT_PREFIX}{id_nr}"
        if einheit_col not in daten.columns:
            errors.append(f"Einheitsspalte {einheit_col} fehlt zu Attribut {col}.")

    return errors
