# i18n.py

MESSAGES = {
    "file_not_found": {
        "de": "Datei nicht gefunden.",
        "en": "File not found.",
        "fr": "Fichier non trouvé."
    },
    "invalid_template_type": {
        "de": "Ungültiger Template-Typ.",
        "en": "Invalid template type.",
        "fr": "Type de modèle non valide."
    },
    "upload_success": {
        "de": "Datei erfolgreich hochgeladen.",
        "en": "File uploaded successfully.",
        "fr": "Fichier téléchargé avec succès."
    },
    "upload_invalid_type": {
        "de": "Ungültiger Dateityp.",
        "en": "Invalid file type.",
        "fr": "Type de fichier non valide."
    },
    "unknown_error": {
        "de": "Unbekannter Fehler.",
        "en": "Unknown error.",
        "fr": "Erreur inconnue."
    },
    "deleted": {
        "de": "Datei gelöscht.",
        "en": "File deleted.",
        "fr": "Fichier supprimé."
    }
    # ...weitere Meldungen nach Bedarf
}

def t(msg_key, lang="de"):
    return MESSAGES.get(msg_key, {}).get(lang, MESSAGES.get(msg_key, {}).get("de", "Fehler"))
