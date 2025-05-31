from flask import Flask, request, jsonify
from routes.upload_routes import upload_routes
from validator.validate_ideen import validate_ideen_excel
from validator.validate_kombis import validate_kombi_excel
from pathlib import Path
from werkzeug.utils import secure_filename
from config import config
from loader.excel_loader import ExcelLoader
from flask import send_from_directory
import pandas as pd
import os
import configparser
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse

app = FastAPI()
app = Flask(__name__)
app.register_blueprint(upload_routes)

UPLOAD_BASE = Path(config.upload_dir) / "sessions"
UPLOAD_BASE.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {"xlsx"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ------------------- Upload-Route -------------------
@app.route("/upload/<sammlung_typ>", methods=["POST"])
def upload_file(sammlung_typ):
    try:
        if sammlung_typ not in ["ideen", "kombis"]:
            return jsonify({"error": "Ungültiger Sammlungstyp"}), 400

        session_id = request.args.get("session")
        if not session_id:
            return jsonify({"error": "Fehlende Session-ID"}), 400

        if "file" not in request.files:
            return jsonify({"error": "Keine Datei im Request"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "Keine Datei ausgewählt"}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            save_path = UPLOAD_BASE / session_id / sammlung_typ
            save_path.mkdir(parents=True, exist_ok=True)

            saved_file_path = save_path / filename
            file.save(saved_file_path)

            # Validierung
            if sammlung_typ == "ideen":
                validation_errors = validate_ideen_excel(saved_file_path)
                if validation_errors:
                    return jsonify({
                        "message": "Datei hochgeladen, aber Validierungsfehler entdeckt",
                        "filename": filename,
                        "validation_errors": validation_errors
                    }), 200

            elif sammlung_typ == "kombis":
                validation_errors = validate_kombi_excel(saved_file_path)
                if validation_errors:
                    return jsonify({
                        "message": "Datei hochgeladen, aber Validierungsfehler entdeckt",
                        "filename": filename,
                        "validation_errors": validation_errors
                    }), 200

            return jsonify({
                "message": "Datei erfolgreich hochgeladen",
                "filename": filename,
                "path": str(saved_file_path)
            }), 200

        return jsonify({"error": "Ungültiger Dateityp"}), 400

    except Exception as e:
        return jsonify({"error": f"Unbekannter Fehler: {str(e)}"}), 500


# ------------------- Dateien auflisten -------------------
@app.route("/api/uploads/<sammlung_typ>", methods=["GET"])
def list_uploaded_files(sammlung_typ):
    session_id = request.args.get("session")
    if not session_id:
        return jsonify({"error": "Fehlende Session-ID"}), 400

    folder = UPLOAD_BASE / session_id / sammlung_typ
    if not folder.exists():
        return jsonify({"files": []})

    files = [f.name for f in folder.iterdir() if f.is_file()]
    return jsonify({"files": files})


# ------------------- Datei löschen -------------------
@app.route("/api/uploads/<sammlung_typ>/delete", methods=["DELETE"])
def delete_uploaded_file(sammlung_typ):
    session_id = request.args.get("session")
    filename = request.args.get("filename")

    if not session_id or not filename:
        return jsonify({"error": "Fehlende Parameter"}), 400

    file_path = UPLOAD_BASE / session_id / sammlung_typ / filename
    if file_path.exists():
        file_path.unlink()
        return jsonify({"message": "Datei gelöscht"}), 200
    else:
        return jsonify({"error": "Datei nicht gefunden"}), 404


# ------------------- Dateiinhalt anzeigen -------------------
@app.route("/api/uploads/<sammlung_typ>/content", methods=["GET"])
def read_uploaded_file(sammlung_typ):
    session_id = request.args.get("session")
    filename = request.args.get("filename")

    if not session_id or not filename:
        return jsonify({"error": "Fehlende Parameter"}), 400

    file_path = UPLOAD_BASE / session_id / sammlung_typ / filename
    if not file_path.exists():
        return jsonify({"error": "Datei nicht gefunden"}), 404

    try:
        df = pd.read_excel(file_path, header=None, dtype=str, keep_default_na=False)

        if df.shape[0] < 3:
            return jsonify({"error": "Datei hat nicht genug Zeilen"}), 400

        spalten_ids = [str(val).strip() for val in df.iloc[0]]
        daten = df.iloc[2:].copy()
        daten.columns = spalten_ids
        return jsonify({
            "columns": spalten_ids,
            "rows": daten.to_dict(orient="records")
        })

    except Exception as e:
        return jsonify({"error": f"Lesefehler: {e}"}), 500


# ------------------- Beispiel-Ranking -------------------
@app.route("/api/ranking", methods=["GET"])
def get_ranking():
    lang = request.args.get("lang", config.default_language)

    try:
        loader = ExcelLoader(config.current_ideen_path, sprache=lang)
        df = loader.lade_excel()

        ideen = df[["titel", "beschreibung"]].fillna("").to_dict(orient="records")
        return jsonify({
            "sprache": lang,
            "ideen": ideen
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------- Dateien einer Session abrufen -------------------
@app.route("/session_files", methods=["GET"])
def list_session_files():
    session_id = request.args.get("session")
    if not session_id:
        return jsonify({"error": "Fehlende Session-ID"}), 400

    result = {}
    for typ in ["ideen", "kombis"]:
        path = UPLOAD_BASE / session_id / typ
        if path.exists():
            result[typ] = sorted([f.name for f in path.glob("*.xlsx")])
        else:
            result[typ] = []

    return jsonify(result)
    
# ------------------- Dowload Template -------------------

@app.get("/download_template")
async def download_template(type: str = Query(..., pattern="^(ideen|kombi)$")):
    config = configparser.ConfigParser()
    config.read("matrixconfig.ini")

    templatedir = config["Dateien"]["templatedir"]

    if type == "ideen":
        templatefile = config["Dateien"]["ideentemplate"]
    elif type == "kombi":
        templatefile = config["Dateien"]["kombitemplate"]
    else:
        raise HTTPException(status_code=400, detail="Ungültiger Template-Typ")

    filepath = os.path.join(templatedir, templatefile)

    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail="Datei nicht gefunden")

    return FileResponse(
        path=filepath,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=templatefile
    )
# ------------------- Startpunkt -------------------
if __name__ == "__main__":
    app.run(debug=config.dev_mode)
