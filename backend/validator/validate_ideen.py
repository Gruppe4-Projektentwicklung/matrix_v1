import pandas as pd

REQUIRED_TEXT_SPALTEN = ['#t#1', '#t#2']
REQUIRED_ATTRIBUT_PREFIX = '#-#'
REQUIRED_EINHEIT_PREFIX = '#+#'

def validate_ideen_excel(path: str, template_path: str = None) -> list[str]:
    errors = []

    try:
        raw = pd.read_excel(path, header=None, dtype=str, keep_default_na=False)
    except Exception as e:
        return [f"Excel konnte nicht geladen werden: {e}"]

    if raw.shape[0] < 3:
        errors.append("Die Excel-Datei muss mindestens drei Zeilen haben (IDs, Labels, Daten).")

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

    # Optional: Template-Check, falls angegeben
    if template_path:
        try:
            raw_template = pd.read_excel(template_path, header=None, dtype=str, keep_default_na=False)
            spalten_template = [str(val).strip() for val in raw_template.iloc[0]]
            # Fehlende Spalten laut Template
            missing_in_upload = [col for col in spalten_template if col not in spalten_ids]
            # Zusätzliche unbekannte Spalten im Upload
            extra_in_upload = [col for col in spalten_ids if col not in spalten_template]

            if missing_in_upload:
                errors.append(f"Fehlende Spalten laut Template: {', '.join(missing_in_upload)}")
            if extra_in_upload:
                errors.append(f"Unbekannte zusätzliche Spalten: {', '.join(extra_in_upload)}")
        except Exception as e:
            errors.append(f"Template konnte nicht geladen werden: {e}")

    return errors
