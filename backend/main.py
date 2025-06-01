from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import pandas as pd
import os
import configparser
from config import config  # Deine eigene Configklasse!
from loader.excel_loader import ExcelLoader
from validator.validate_ideen import validate_ideen_excel
from validator.validate_kombis import validate_kombi_excel
from i18n_backend import t

import tempfile

app = FastAPI()
valid_ideen_template = Path(config.valid_ideen_template).resolve()
valid_kombi_template = Path(config.valid_kombi_template).resolve()

# ---- CORS Settings ----
origins = [
    "https://reliable-pudding-2fdba3.netlify.app",
    "https://matrix.gruppe4-projektentwicklung.de",
    "http://localhost:3000",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_BASE = Path(config.upload_dir) / "sessions"
UPLOAD_BASE.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {"xlsx"}

# ---- Hilfsfunktion: Datei erlaubt? ----
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ---- Hilfsfunktion: Globale Auswahl-/Default-Dateien auslesen ----
def get_global_files(sammlung_typ):
    configparser_ = configparser.ConfigParser()
    configparser_.read("matrixconfig.ini")
    if sammlung_typ == "ideen":
        base_dir = Path(configparser_["Dateien"]["selectionideas_dir"])
        default_file = configparser_["Dateien"]["default_ideen"]
    elif sammlung_typ == "kombis":
        base_dir = Path(configparser_["Dateien"]["selectioncombis_dir"])
        default_file = configparser_["Dateien"]["default_kombi"]
    else:
        return [], None
    files = sorted([f.name for f in base_dir.glob("*.xlsx")])
    return files, default_file

# ======================= ROUTES ===========================

@app.post("/upload/{sammlung_typ}")
async def upload_file(
    sammlung_typ: str,
    session: str = Form(...),
    file: UploadFile = File(...),
    lang: str = Form("de")
):
    # Prüfung des Typs
    if sammlung_typ not in ["ideen", "kombis"]:
        return JSONResponse(status_code=400, content={"error": t("invalid_template_type", lang)})

    # Prüfung der Dateiendung
    if not allowed_file(file.filename):
        return JSONResponse(status_code=400, content={"error": t("upload_invalid_type", lang)})

    file_bytes = await file.read()

    with tempfile.NamedTemporaryFile(delete=True, suffix=".xlsx") as tmp_file:
        tmp_file.write(file_bytes)
        tmp_file.flush()

        # Validierung
        if sammlung_typ == "ideen":
            validation_errors = validate_ideen_excel(tmp_file.name, config.valid_ideen_template)
        else:
            validation_errors = validate_kombi_excel(tmp_file.name, config.valid_kombi_template)

        if validation_errors:
            return JSONResponse(status_code=400, content={
                "error": "uploadnotvalid",   # <<<< HIER nur der KEY
                "validation_errors": validation_errors
            })

    # Speicherung erst bei erfolgreicher Validierung
    save_path = UPLOAD_BASE / session / sammlung_typ
    save_path.mkdir(parents=True, exist_ok=True)
    saved_file_path = save_path / file.filename
    with open(saved_file_path, "wb") as buffer:
        buffer.write(file_bytes)

    return {
        "message": t("upload_success", lang),
        "filename": file.filename,
        "path": str(saved_file_path)
    }


# ---- Globale UND User-Dateien für das Dropdown (für Frontend) ----
@app.get("/api/selection/{sammlung_typ}")
async def get_selection_files(
    sammlung_typ: str,
    session: str = Query(...),
    lang: str = Query("de")
):
    # Globale Auswahl (z. B. uploads/selectionideas)
    if sammlung_typ == "ideen":
        base_dir = Path(config.selectionideas_dir)
        default_file = config.default_ideen
    elif sammlung_typ == "kombis":
        base_dir = Path(config.selectioncombis_dir)
        default_file = config.default_kombi
    else:
        return {"files": [], "default": None}

    # Nur .xlsx im globalen Ordner
    global_files = sorted([f.name for f in base_dir.glob("*.xlsx")])

    # Session-Uploads nur aus dieser Session
    user_folder = Path(config.upload_dir) / "sessions" / session / sammlung_typ
    user_files = sorted([f.name for f in user_folder.glob("*.xlsx")]) if user_folder.exists() else []

    # Dateien zusammenführen (global + user ohne Duplikate)
    files = global_files + [f for f in user_files if f not in global_files]

    # Debug-Ausgaben NACH Variablen-Definitionen
    print(f"[DEBUG][/api/selection/{sammlung_typ}]")
    print(f"  base_dir: {base_dir.resolve()}")
    print(f"  global_files: {global_files}")
    print(f"  user_folder: {user_folder.resolve() if user_folder.exists() else 'Nicht vorhanden'}")
    print(f"  user_files: {user_files}")
    print(f"  final files: {files}")
    print(f"  default_file: {default_file}\n")

    return {
        "files": files,
        "default": default_file
    }

# ---- Dateien aus einer Session (nur User-Uploads) ----
@app.get("/api/uploads/{sammlung_typ}")
async def list_uploaded_files(sammlung_typ: str, session: str, lang: str = Query("de")):
    folder = UPLOAD_BASE / session / sammlung_typ
    if not folder.exists():
        return {"files": []}
    files = [f.name for f in folder.iterdir() if f.is_file()]
    return {"files": files}

# ---- Datei löschen ----
@app.delete("/api/uploads/{sammlung_typ}/delete")
async def delete_uploaded_file(sammlung_typ: str, session: str, filename: str, lang: str = Query("de")):
    file_path = UPLOAD_BASE / session / sammlung_typ / filename
    if file_path.exists():
        file_path.unlink()
        return {"message": t("deleted", lang)}
    else:
        return JSONResponse(status_code=404, content={"error": t("file_not_found", lang)})

# ---- Dateiinhalt anzeigen (Excel als JSON) ----
@app.get("/api/uploads/{sammlung_typ}/content")
async def read_uploaded_file(sammlung_typ: str, session: str, filename: str, lang: str = Query("de")):
    file_path = UPLOAD_BASE / session / sammlung_typ / filename
    if not file_path.exists():
        return JSONResponse(status_code=404, content={"error": t("file_not_found", lang)})

    try:
        df = pd.read_excel(file_path, header=None, dtype=str, keep_default_na=False)
        if df.shape[0] < 3:
            return JSONResponse(status_code=400, content={"error": t("not_enough_rows", lang)})

        spalten_ids = [str(val).strip() for val in df.iloc[0]]
        daten = df.iloc[2:].copy()
        daten.columns = spalten_ids
        return {
            "columns": spalten_ids,
            "rows": daten.to_dict(orient="records")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"{t('read_error', lang)} {e}"})












# ---- Beispiel: Ranking-Endpoint (optional, je nach App-Logik) ----
@app.get("/api/ranking")
async def get_ranking(lang: str = Query(default=config.default_language)):
    try:
        loader = ExcelLoader(config.current_ideen_path, sprache=lang)
        df = loader.lade_excel()
        ideen = df[["titel", "beschreibung"]].fillna("").to_dict(orient="records")
        return {
            "sprache": lang,
            "ideen": ideen
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ---- Übersicht: Dateien pro Session für beide Typen ----
@app.get("/session_files")
async def list_session_files(session: str, lang: str = Query("de")):
    result = {}
    for typ in ["ideen", "kombis"]:
        path = UPLOAD_BASE / session / typ
        if path.exists():
            result[typ] = sorted([f.name for f in path.glob("*.xlsx")])
        else:
            result[typ] = []
    return result

# ---- Download Template ----
@app.get("/download_template")
async def download_template(type: str = Query(..., pattern="^(ideen|kombi)$"), lang: str = Query("de")):
    import os  # Innerhalb der Funktion ist okay zum Debuggen

    configparser_ = configparser.ConfigParser()
    configparser_.read("matrixconfig.ini")

    templatedir = configparser_["Dateien"]["templatedir"]

    if type == "ideen":
        templatefile = configparser_["Dateien"]["ideentemplate"]
    elif type == "kombi":
        templatefile = configparser_["Dateien"]["kombitemplate"]
    else:
        raise HTTPException(status_code=400, detail=t("invalid_template_type", lang))

    filepath = os.path.join(templatedir, templatefile)
    filepath = os.path.abspath(filepath)

    # >>> Hier kommt das Debugging <<<
    print("CWD:", os.getcwd())
    print("[DEBUG] Suche Datei:", filepath)
    print("[DEBUG] Existiert:", os.path.isfile(filepath))

    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail=t("file_not_found", lang))

    return FileResponse(
        path=filepath,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=templatefile
    )
