import pandas as pd
import numpy as np
import operator
import re

class Bewertung:
    def __init__(self, ideen_df: pd.DataFrame, kombis_df: pd.DataFrame, gewichtungen: dict):
        """
        ideen_df: DataFrame mit den Ideen (Spalten IDs wie '#-#1', '#1#1', etc.)
        kombis_df: DataFrame mit den Kombinationen und deren Formeln
        gewichtungen: Dict mit Kombi-ID als Key und Gewichtungsfaktor (0-5) als Value
        """
        self.ideen = ideen_df
        self.kombis = kombis_df
        self.gewichtungen = gewichtungen

    def berechne_alle_kombinationen(self) -> pd.DataFrame:
        """
        Berechnet die Werte für jede Kombination und Idee.
        Gibt DataFrame mit Ideen-IDs und Werten pro Kombination zurück.
        """

        ergebnisse = pd.DataFrame(index=self.ideen.index)

        for idx, kombi in self.kombis.iterrows():
            formel = kombi['Formel_ID']  # z.B. '#-#2 + (#-#1 * #-#3)'
            richtung = kombi['Richtung'].lower()  # 'high' oder 'low'
            kombi_id = kombi.get('Kombi_ID', idx)

            # Berechnung der Werte pro Idee
            werte = self._berechne_formel(formel)

            # Bei low = besser wenn Wert niedrig, invertiere für Ranking
            if richtung == 'low':
                werte = -werte

            # Gewichtung der Kombination
            gewicht = self.gewichtungen.get(kombi_id, 1)
            werte = werte * gewicht

            ergebnisse[f"Kombi_{kombi_id}"] = werte

        return ergebnisse

    def _berechne_formel(self, formel: str) -> pd.Series:
        """
        Parst und berechnet die Formel für alle Ideen.
        Formel besteht aus Attribut-IDs mit Operatoren (+, -, *, /, (, )).

        Beispiel: '#-#2 + (#-#1 * #-#3)'
        """

        # Ersetze Attribute in Formel durch pandas Series
        # Wir parsen die Formel und ersetzen IDs durch DataFrame-Spalten
        # Beispiel: '#-#2' -> self.ideen['#-#2']

        # Finde alle Attribute (z.B. #-#2, #1#1, #t_de#1 etc.)
        attribute = re.findall(r"#[-+]?#\d+|#\d+#\d+", formel)

        ersetzungen = {}
        for attr in attribute:
            if attr not in ersetzungen:
                if attr in self.ideen.columns:
                    ersetzungen[attr] = self.ideen[attr]
                else:
                    # Fehlender Attributwert - fülle mit NaN
                    ersetzungen[attr] = pd.Series(np.nan, index=self.ideen.index)

        # Ersetze Attribute in Formel durch 'ersetzungen["attr"]'
        eval_formel = formel
        for attr, series in ersetzungen.items():
            eval_formel = eval_formel.replace(attr, f"ersetzungen['{attr}']")

        try:
            # Auswertung der Formel für alle Reihen als Series
            result = eval(eval_formel, {"ersetzungen": ersetzungen, "np": np, "pd": pd, "operator": operator})
        except Exception as e:
            # Fehlerbehandlung: gebe NaN Series zurück
            result = pd.Series(np.nan, index=self.ideen.index)

        return result

    def berechne_gesamt_ranking(self, kombi_ergebnisse: pd.DataFrame) -> pd.Series:
        """
        Summiert die gewichteten Kombinationswerte und liefert Gesamt-Score für jede Idee.
        """

        gesamt = kombi_ergebnisse.sum(axis=1)
        return gesamt.sort_values(ascending=False)  # Höherer Score = besser


if __name__ == "__main__":
    # Beispielaufruf
    ideen_df = pd.read_excel("ideen_template.xlsx", header=2, dtype=object)
    kombis_df = pd.read_excel("kombis_template.xlsx", header=2, dtype=object)

    # Beispiel Gewichtungen (Kombi_ID : Gewicht)
    gewichtungen = {1: 5, 2: 3}

    bewertung = Bewertung(ideen_df, kombis_df, gewichtungen)
    kombi_ergebnisse = bewertung.berechne_alle_kombinationen()
    gesamt_ranking = bewertung.berechne_gesamt_ranking(kombi_ergebnisse)

    print(gesamt_ranking)
