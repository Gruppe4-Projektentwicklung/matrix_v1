import pandas as pd
from pathlib import Path

class ExcelLoader:
    def __init__(self, dateipfad: str):
        self.dateipfad = Path(dateipfad).resolve()
        self.id_zeile = 0       # erste Zeile mit IDs
        self.spaltenname_zeile = 1  # zweite Zeile mit sichtbaren Spaltennamen
        self.data_start_zeile = 2    # Daten ab dritter Zeile (Index 2)
        self.df = None
        self.spalten_ids = {}

    def lade_excel(self) -> pd.DataFrame:
        # Lese die erste Zeile als Header mit IDs
        # Wir lesen ohne Header und verarbeiten selbst
        raw = pd.read_excel(
            self.dateipfad,
            header=None,
            dtype=str,
            keep_default_na=False,
        )

        # Prüfen ob Datei mindestens 3 Zeilen hat
        if raw.shape[0] < 3:
            raise ValueError("Excel-Datei hat nicht genug Zeilen (mindestens 3 erforderlich)")

        # IDs aus Zeile 1 (Index 0)
        self.spalten_ids = {idx: val.strip() for idx, val in enumerate(raw.iloc[self.id_zeile])}

        # Sichtbare Spaltennamen aus Zeile 2 (Index 1)
        spalten_namen = [val.strip() for val in raw.iloc[self.spaltenname_zeile]]

        # Daten ab Zeile 3 (Index 2)
        daten = raw.iloc[self.data_start_zeile :].reset_index(drop=True)

        # Spalten den IDs als Header zuweisen
        daten.columns = [self.spalten_ids.get(i, f"Unbekannt_{i}") for i in range(len(spalten_namen))]

        # Grundlegende Validierung auf wichtige Spalten (Beispiel)
        erforderliche_ids = ['#t_de#1', '#-#1', '#1#1']  # anpassen je nach Nutzung
        fehlende = [eid for eid in erforderliche_ids if eid not in daten.columns]
        if fehlende:
            raise ValueError(f"Erforderliche Spalten fehlen: {fehlende}")

        self.df = daten
        return daten

    def gib_spalten_ids(self) -> dict:
        """Gibt das Mapping Index → ID aus der ersten Zeile zurück."""
        return self.spalten_ids


if __name__ == "__main__":
    # Beispielnutzung
    loader = ExcelLoader("ideen_template.xlsx")
    df = loader.lade_excel()
    print("Spalten IDs:", loader.gib_spalten_ids())
    print(df.head())
