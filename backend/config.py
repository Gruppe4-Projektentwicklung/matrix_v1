import configparser
import os
from pathlib import Path

class Config:
    def __init__(self, filepath="matrixconfig.ini"):
        self.config = configparser.ConfigParser()
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Konfigurationsdatei {filepath} nicht gefunden.")
        self.config.read(filepath)
        self._validate()

    def _validate(self):
        if "Dateien" not in self.config or "Features" not in self.config:
            raise ValueError("Fehlende Pflichtsektionen [Dateien] oder [Features]")

        # Hier auf die neuen Keys prüfen – KEINE alten Namen mehr wie "currentidealist"!
        required_keys = [
            "selectionideas_dir",
            "selectioncombis_dir",
            "default_ideen",
            "default_kombi",
            "ideentemplate",
            "kombitemplate",
            "templatedir",
            "logfile",
            "autosave_dir",
            "upload_dir"
        ]
        for key in required_keys:
            if key not in self.config["Dateien"]:
                raise ValueError(f"Fehlender Schlüssel in [Dateien]: {key}")

    # --- Dateipfade ---
    @property
    def selectionideas_dir(self):
        return self.config["Dateien"]["selectionideas_dir"]

    @property
    def selectioncombis_dir(self):
        return self.config["Dateien"]["selectioncombis_dir"]

    @property
    def default_ideen(self):
        return self.config["Dateien"]["default_ideen"]

    @property
    def default_kombi(self):
        return self.config["Dateien"]["default_kombi"]

    @property
    def ideen_template_path(self):
        return self.config["Dateien"]["ideentemplate"]

    @property
    def kombi_template_path(self):
        return self.config["Dateien"]["kombitemplate"]

    @property
    def logfile_path(self):
        return self.config["Dateien"].get("logfile", "backend.log")

    @property
    def autosave_dir(self):
        return self.config["Dateien"]["autosave_dir"]

    @property
    def upload_dir(self):
        return self.config["Dateien"]["upload_dir"]

    @property
    def template_dir(self):
        # Pfad relativ zur Projektstruktur (z. B. "templates" → ../templates)
        raw_path = self.config["Dateien"]["templatedir"]
        # Passe das ggf. an deinen tatsächlichen Projektpfad an!
        return (Path(__file__).parent.parent / raw_path).resolve()

    def template_path(self, sammlung_typ):
        if sammlung_typ == "ideen":
            fname = self.ideen_template_path
        elif sammlung_typ == "kombis":
            fname = self.kombi_template_path
        else:
            raise ValueError("Ungültiger Sammlungstyp")
        return self.template_dir / fname

    # --- Feature-Schalter ---
    def _feature(self, key, default="off"):
        return self.config["Features"].get(key, default).lower() in ["on", "true", "1"]

    @property
    def dev_mode(self): return self._feature("dev_mode_button")
    @property
    def datapopup_enabled(self): return self._feature("datapopup")
    @property
    def testerbutton_enabled(self): return self._feature("testerbutton")
    @property
    def enable_export_pdf(self): return self._feature("enable_export_pdf")
    @property
    def enable_export_csv(self): return self._feature("enable_export_csv")
    @property
    def allow_custom_uploads(self): return self._feature("allow_custom_uploads")
    @property
    def enable_debug_routes(self): return self._feature("enable_debug_routes")
    @property
    def api_key_required(self): return self._feature("api_key_required")
    @property
    def enable_usage_logging(self): return self._feature("enable_usage_logging")

    @property
    def log_level(self):
        return self.config["Features"].get("log_level", "INFO").upper()

    @property
    def max_upload_size_mb(self):
        return int(self.config["Features"].get("max_upload_size_mb", 10))

    @property
    def max_ideen(self):
        return int(self.config["Features"].get("max_ideen", 200))

    @property
    def max_kombis(self):
        return int(self.config["Features"].get("max_kombis", 500))

    @property
    def default_language(self):
        return self.config["Features"].get("default_language", "de")

    @property
    def supported_languages(self):
        raw = self.config["Features"].get("available_languages", "de,en,fr")
        return [lang.strip() for lang in raw.split(",")]
    @property
    def valid_ideen_template(self):
        path = self.config["Dateien"].get("valid_ideen_template", None)
        return os.path.abspath(path) if path else None

    @property
    def valid_kombi_template(self):
        path = self.config["Dateien"].get("valid_kombi_template", None)
        return os.path.abspath(path) if path else None


# Globale Instanz
config = Config()
