from flask import Flask, request, jsonify
from pathlib import Path
from werkzeug.utils import secure_filename
from config import config
from loader.excel_loader import ExcelLoader

# Flask App initialisieren
app = Flask(__name__)

# Upload-Ordner aus config (default: uploads/)
UPLOAD_FOLDER = Path(config.upload_dir)
UPLOAD_FOLDER.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {'xlsx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ------------------- Upload-Route -------------------
@app.route('/upload/<sammlung_typ>', methods=['POST'])
def upload_file(sammlung_typ):
    if sammlung_typ not in ['ideen', 'kombis']:
        return jsonify({"error": "Ungültiger Sammlungstyp"}), 400

    if 'file' not in request.files:
        return jsonify({"error": "Keine Datei im Request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "Keine Datei ausgewählt"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        save_path = UPLOAD_FOLDER / sammlung_typ
        save_path.mkdir(parents=True, exist_ok=True)
        file.save(save_path / filename)

        # TODO: Validierung und Feedback zur Datei
        return jsonify({"message": f"Datei {filename} hochgeladen", "filename": filename}), 200

    return jsonify({"error": "Dateityp nicht erlaubt"}), 400

# ------------------- Beispiel-Ranking-Route -------------------
@app.route('/api/ranking', methods=['GET'])
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

# ------------------- Startpunkt -------------------
if __name__ == '__main__':
    app.run(debug=config.dev_mode)
