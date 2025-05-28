from flask import Flask, request, jsonify, session
from flask_session import Session
from pathlib import Path
import uuid
import pandas as pd
from io import BytesIO
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = "dein_geheimer_session_key"
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

ALLOWED_EXTENSIONS = {"xlsx"}
STORAGE_FOLDER = Path(__file__).parent.parent / "storage"
STORAGE_FOLDER.mkdir(exist_ok=True)

def allowed_file(fname):
    return "." in fname and fname.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/upload/<sammlung_typ>", methods=["POST"])
def upload_file(sammlung_typ):
    if sammlung_typ not in ("ideen", "kombis"):
        return jsonify({"error": "Ungültiger Sammlungstyp"}), 400

    file = request.files.get("file")
    if not file or file.filename == "":
        return jsonify({"error": "Keine Datei ausgewählt"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Nur .xlsx-Dateien erlaubt"}), 400

    # Prüfe, ob Tester-Modus aktiviert ist (über Form-Data, Checkbox im Frontend: tester=true/false)
    tester_mode = request.form.get("tester", "false").lower() == "true"

    # Datei in Memory lesen (und behalten)
    file_bytes = file.read()
    try:
        df = pd.read_excel(BytesIO(file_bytes), header=None, dtype=str, keep_default_na=False)
    except Exception as e:
        return jsonify({"error": f"Fehler beim Einlesen der Datei: {e}"}), 400

    # ID für Upload
    upload_id = str(uuid.uuid4())

    # --- Session (nur für aktuellen User sichtbar) ---
    key = f"{sammlung_typ}_uploads"
    uploads = session.get(key, [])
    uploads.append({
        "id": upload_id,
        "name": file.filename,
        "data_json": df.to_json()
    })
    session[key] = uploads

    # --- Persistent (für Statistik, wenn NICHT Tester-Modus) ---
    if not tester_mode:
        save_dir = STORAGE_FOLDER / sammlung_typ
        save_dir.mkdir(parents=True, exist_ok=True)
        filename = secure_filename(f"{upload_id}_{file.filename}")
        (save_dir / filename).write_bytes(file_bytes)
        # Hier könntest du später auch zu jedem Upload eine JSON mit Meta-Infos ablegen!

    return jsonify({"id": upload_id, "name": file.filename}), 200

@app.route("/list_uploads/<sammlung_typ>", methods=["GET"])
def list_uploads(sammlung_typ):
    if sammlung_typ not in ("ideen", "kombis"):
        return jsonify({"error": "Ungültiger Sammlungstyp"}), 400

    uploads = session.get(f"{sammlung_typ}_uploads", [])
    return jsonify({"files": [{"id": u["id"], "name": u["name"]} for u in uploads]})

if __name__ == "__main__":
    app.run(debug=True)
from save_run import save_run_api
app.register_blueprint(save_run_api)
