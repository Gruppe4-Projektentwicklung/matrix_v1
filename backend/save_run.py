from flask import Blueprint, request, jsonify
from pathlib import Path
import uuid
import json

save_run_api = Blueprint("save_run_api", __name__)

STORAGE_FOLDER = Path(__file__).parent.parent / "storage" / "runs"
STORAGE_FOLDER.mkdir(parents=True, exist_ok=True)

@save_run_api.route("/save_run", methods=["POST"])
def save_run():
    data = request.get_json()
    # Muss enthalten: tester (bool), alle Bewertungseingaben, nutzerdaten, ideen/kombis-IDs, ...
    if not data or "tester" not in data:
        return jsonify({"error": "Ungültige Daten"}), 400

    # Wenn Tester-Modus, NICHT speichern!
    if data.get("tester"):
        return jsonify({"message": "Tester-Modus: Bewertungslauf NICHT gespeichert."}), 200

    run_id = str(uuid.uuid4())
    filename = f"{run_id}.json"
    filepath = STORAGE_FOLDER / filename

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    return jsonify({"message": "Bewertungslauf gespeichert", "run_id": run_id}), 200
