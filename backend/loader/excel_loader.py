import pandas as pd
from pathlib import Path

class ExcelLoader:
    def __init__(self, dateipfad: str, sprache: str = "de"):
        self.dateipfad = Path(dateipfad).resolve()
        self.sprache = sprache.lower()
        self.id_zeile = 0       # erste Zeile mit IDs
        self.spaltenname_zeile = 1  # zweite Zeile mit sichtbaren Spaltennamen
        self.data_start_zeile = 2    # Daten ab dritter Zeile (Index 2)
        self.df = None
        self.spalten_ids = {}

    def lade_excel(self) -> pd.DataFrame:
        # Excel ohne Header laden
        raw = pd.read_excel(
            self.dateipfad,
            header=None,
            dtype=str,
            keep_default_na=False,
        )

        if raw.shape[0] < 3:
            raise ValueError("Excel-Datei hat nicht genug Zeilen (mindestens 3 erforderlich)")

        # IDs aus Zeile 1
        self.spalten_ids = {idx: val.strip() for idx, val in enumerate(raw.iloc[self.id_zeile])}

        # Sichtbare Namen aus Zeile 2
        spalten_namen = [val.strip() for val in raw.iloc[self.spaltenname_zeile]]

        # Daten ab Zeile 3
        daten = raw.iloc[self.data_start_zeile :].reset_index(drop=True)

        # IDs als Spaltennamen verwenden
        daten.columns = [self.spalten_ids.get(i, f"Unbekannt_{i}") for i in range(len(spalten_namen))]

        # Sprachbezogene Spalten extrahieren (z. B. #t_de#1 etc.)
        sprachfelder = {
            "titel": f"#t_{self.sprache}#1",
            "beschreibung": f"#t_{self.sprache}#2",
            "formeltext": f"#t_{self.sprache}#3"
        }

        for key, spalten_id in sprachfelder.items():
            if spalten_id in daten.columns:
                daten[key] = daten[spalten_id]
            else:
                daten[key] = ""  # Leere Spalte, falls nicht vorhanden

        self.df = daten
        return daten

    def gib_spalten_ids(self) -> dict:
        return self.spalten_ids
