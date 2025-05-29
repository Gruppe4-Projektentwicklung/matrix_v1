from flask import Blueprint, request, jsonify
from pathlib import Path
from config import config

upload_routes = Blueprint("upload_routes", __name__)

@upload_routes.route("/session_files", methods=["GET"])
def list_uploaded_files():
    session_id = request.args.get("session")
    if not session_id:
        return jsonify({"error": "Fehlende Session-ID"}), 400

    base_dir = Path(config.upload_dir) / "sessions" / session_id
    ideen_dir = base_dir / "ideen"
    kombis_dir = base_dir / "kombis"

    def list_xlsx_files(path: Path) -> list[str]:
        if not path.exists() or not path.is_dir():
            return []
        return [f.name for f in path.glob("*.xlsx") if f.is_file()]

    return jsonify({
        "ideen": list_xlsx_files(ideen_dir),
        "kombis": list_xlsx_files(kombis_dir)
    })
