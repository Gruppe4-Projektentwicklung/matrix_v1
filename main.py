from backend.config_loader import load_config
from backend.excel_loader import load_ideen_excel, load_kombis_excel
import os

def main():
    # Konfiguration laden
    config = load_config("backend/matrixconfig.ini")

    ideen_path = os.path.join("templates", config["aktuelle_ideensammlung"])
    kombis_path = os.path.join("templates", config["aktuelle_kombisammlung"])

    print("Lade Ideensammlung:", ideen_path)
    ideen_df, ideen_id_map = load_ideen_excel(ideen_path)
    print("→", len(ideen_df), "Ideen geladen.")
    print("→ IDs gefunden:", list(ideen_id_map.keys()))

    print("\nLade Kombinationen:", kombis_path)
    kombis_df = load_kombis_excel(kombis_path)
    print("→", len(kombis_df), "Kombinationen geladen.")

if __name__ == "__main__":
    main()
