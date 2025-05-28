from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
from pathlib import Path

app = Flask(__name__)

UPLOAD_FOLDER = Path("uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {'xlsx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

        # Speichern mit originalem Namen - kann noch um ID erweitert werden
        file.save(save_path / filename)

        # TODO: Validierung hier optional einbauen

        return jsonify({"message": f"Datei {filename} hochgeladen", "filename": filename}), 200

    return jsonify({"error": "Dateityp nicht erlaubt"}), 400

if __name__ == '__main__':
    app.run(debug=True)
