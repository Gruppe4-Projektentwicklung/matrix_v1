import pandas as pd

def lade_frontend_konfiguration(kombis_df: pd.DataFrame) -> dict:
    """
    Bereitet eine Konfigurationsstruktur für das Frontend auf Basis der Kombinationsliste auf.
    """

    kombinationen = []

    for _, row in kombis_df.iterrows():
        kombi = {
            "id": row.get("Kombi_ID", ""),
            "name": row["Kombinationsname"],
            "beschreibung": row.get("Beschreibung", ""),
            "formel": row.get("Formeltext", ""),
            "gewichtung": 3,  # Standardgewichtung "neutral"
            "aktiv": True,
            "einheit": row.get("Einheit", ""),
            # Manche Dateien nutzen "Direction" als Spaltenname
            "richtung": row.get("Richtung", row.get("Direction", "hoch"))
        }
        kombinationen.append(kombi)

    return {
        "kombinationen": kombinationen,
        "einstellungen": {
            "vorbewertung_runde1_aktiv": True,
            "vorbewertung_runde2_aktiv": True,
            "nutzer_datenfreigabe": "offen",  # Optionen: "offen", "anonym", "keine"
            "app_tester_modus": False,
            "export_modus": "top10",  # Optionen: "top10", "top20", "alle"
            "statistik_aktiv": False  # kann über UI später aktiviert werden
        }
    }
