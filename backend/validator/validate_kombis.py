import pandas as pd

REQUIRED_KOMBI_COLUMNS = [
    "Kombi_ID",
    "#t_de#1", "#t_en#1", "#t_fr#1",
    "#t_de#2", "#t_en#2", "#t_fr#2",
    "#t_de#3", "#t_en#3", "#t_fr#3",
    "FormelID",
    "Direction"
]

def validate_kombi_excel(path: str, template_path: str = None) -> list[str]:
    errors = []
    try:
        raw = pd.read_excel(path, header=None, dtype=str, keep_default_na=False)
    except Exception as e:
        return [f"Excel konnte nicht geladen werden: {e}"]

    if raw.shape[0] < 3:
        return ["Die Excel-Datei muss mindestens drei Zeilen haben (IDs, Labels, Daten)."]

    spalten_ids = [str(val).strip() for val in raw.iloc[0]]
    daten = raw.iloc[2:].copy()
    daten.columns = spalten_ids

    # Pflichtspalten prüfen
    fehlende_spalten = [col for col in REQUIRED_KOMBI_COLUMNS if col not in daten.columns]
    if fehlende_spalten:
        errors.append(f"Folgende Pflichtspalten fehlen: {', '.join(fehlende_spalten)}")

    # Template prüfen (optional)
    if template_path:
        try:
            tmpl_raw = pd.read_excel(template_path, header=None, dtype=str, keep_default_na=False)
            tmpl_spalten = [str(val).strip() for val in tmpl_raw.iloc[0]]
            fehlende_vom_template = [col for col in tmpl_spalten if col not in daten.columns]
            if fehlende_vom_template:
                errors.append(f"Fehlende Spalten laut Template: {', '.join(fehlende_vom_template)}")
        except Exception as e:
            errors.append(f"Template konnte nicht geladen werden: {e}")

    return errors
