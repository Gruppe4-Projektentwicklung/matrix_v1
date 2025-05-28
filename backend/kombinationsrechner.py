import pandas as pd
import re

def berechne_kombinationen(ideen_df, ideen_id_map, kombis_df):
    ergebnisse = pd.DataFrame()
    ergebnisse["ID"] = ideen_df.index

    for _, kombi in kombis_df.iterrows():
        formel_text = kombi["Formel_ID"]
        kombi_name = kombi["Kombinationsname"]

        # Ersetze IDs im Formeltext durch DataFrame-Zugriffe
        def ersetze_id(match):
            id_code = match.group(0)
            if id_code not in ideen_id_map:
                raise ValueError(f"Unbekannte ID in Formel: {id_code}")
            spaltenname = ideen_id_map[id_code]
            return f"ideen_df['{spaltenname}']"

        python_formel = re.sub(r"#[-t\d]+#\d+", ersetze_id, formel_text)

        try:
            ergebnisse[kombi_name] = eval(python_formel)
        except Exception as e:
            ergebnisse[kombi_name] = None
            print(f"Fehler bei Berechnung von '{kombi_name}':", e)

    return ergebnisse
