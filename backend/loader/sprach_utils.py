# backend/loader/sprach_utils.py

def get_sprachspalten(lang: str) -> dict:
    """
    Gibt passende Spaltennamen für Titel, Beschreibung, Formeltext zurück.
    """
    return {
        "titel": f"#t_{lang}#1",
        "beschreibung": f"#t_{lang}#2",
        "formeltext": f"#t_{lang}#3"
    }
