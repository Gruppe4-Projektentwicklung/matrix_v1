import configparser

def load_config(path="backend/matrixconfig.ini"):
    config = configparser.ConfigParser()
    config.read(path)

    # Rückgabe als einfaches dict
    return {
        "aktuelle_ideensammlung": config.get("MATRIX", "aktuelleIdeensammlung", fallback="ideen_template.xlsx"),
        "aktuelle_kombisammlung": config.get("MATRIX", "aktuellekombis", fallback="kombis_template.xlsx"),
        "datapopup": config.get("MATRIX", "datapopup", fallback="on") == "on",
        "testerbutton": config.get("MATRIX", "testerbutton", fallback="on") == "on"
    }
