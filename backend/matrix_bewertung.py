import pandas as pd

def berechne_matrixbewertung(kombinations_df: pd.DataFrame, gewichtungen: dict, richtung_map: dict) -> pd.DataFrame:
    """
    Bewertet alle Ideen auf Basis gewichteter Kombinationen.

    :param kombinations_df: DataFrame mit einer Zeile pro Idee und berechneten Werten pro Kombination.
    :param gewichtungen: Dictionary {Kombinationsname: Gewichtung von 0–5}, wobei 0 = deaktiviert.
    :param richtung_map: Dictionary {Kombinationsname: 'hoch' oder 'niedrig'}
    :return: DataFrame mit Bewertungspunktzahl und Rang.
    """
    df = kombinations_df.copy()
    gewichtete_summe = pd.Series(0.0, index=df.index)
    gewichtung_total = 0.0

    for kombi_name, gewicht in gewichtungen.items():
        if gewicht == 0 or kombi_name not in df.columns:
            continue

        werte = df[kombi_name].astype(float)

        if richtung_map.get(kombi_name, "hoch") == "niedrig":
            werte = -werte  # niedriger ist besser → umkehren

        gewichtete_summe += werte * gewicht
        gewichtung_total += abs(gewicht)

    df["Matrixscore"] = gewichtete_summe / gewichtung_total if gewichtung_total != 0 else 0
    df["Matrix-Rang"] = df["Matrixscore"].rank(ascending=False, method="min")

    return df
