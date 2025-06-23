from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import pandas as pd
import os
import configparser
import json
import uuid
from datetime import datetime
from config import config  # Deine eigene Configklasse!
from database import init_db, SessionLocal, Calculation, UsageLog, UploadedFile
from loader.excel_loader import ExcelLoader
from validator.validate_ideen import validate_ideen_excel
from validator.validate_kombis import validate_kombi_excel
from i18n_backend import t
from frontend_config import lade_frontend_konfiguration
from bewertung import Bewertung

import tempfile

app = FastAPI()
init_db()
valid_ideen_template = Path(config.valid_ideen_template).resolve()
valid_kombi_template = Path(config.valid_kombi_template).resolve()

# ---- CORS Settings ----
origins = [
    "https://reliable-pudding-2fdba3.netlify.app",
    "https://matrix.gruppe4-projektentwicklung.de",
    "https://matrix-v1-backend.onrender.com",
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

# ---- Hilfsfunktion: Pfad zu Datei aus Session oder globalem Ordner ----
def resolve_file(sammlung_typ: str, session: str, filename: str) -> Path:
    """Sucht eine Datei zuerst in der Session, dann im globalen Verzeichnis."""
    if sammlung_typ == "ideen":
        global_dir = Path(config.selectionideas_dir)
    elif sammlung_typ == "kombis":
        global_dir = Path(config.selectioncombis_dir)
    else:
        raise HTTPException(status_code=400, detail="invalid_collection_type")

    session_path = UPLOAD_BASE / session / sammlung_typ / filename
    if session_path.exists():
        return session_path

    global_path = global_dir / filename
    if global_path.exists():
        return global_path

    raise HTTPException(status_code=404, detail=f"{filename} not found")

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

    # Datei auch im Archiv ablegen
    session_archive = ARCHIVE_FOLDER / session / sammlung_typ
    session_archive.mkdir(parents=True, exist_ok=True)
    archive_file_path = session_archive / file.filename
    with open(archive_file_path, "wb") as buffer:
        buffer.write(file_bytes)

    # in der Datenbank speichern
    with SessionLocal() as db:
        db_entry = UploadedFile(
            session_id=session,
            sammlung_typ=sammlung_typ,
            filename=str(saved_file_path),
            is_default=False,
        )
        db.add(db_entry)
        db.commit()

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
    user_path = UPLOAD_BASE / session / sammlung_typ / filename
    if sammlung_typ == "ideen":
        global_path = Path(config.selectionideas_dir) / filename
    elif sammlung_typ == "kombis":
        global_path = Path(config.selectioncombis_dir) / filename
    else:
        global_path = None

    if user_path.exists():
        file_path = user_path
    elif global_path and global_path.exists():
        file_path = global_path
    else:
        return JSONResponse(status_code=404, content={"error": t("file_not_found", lang)})

    try:
        df = pd.read_excel(file_path, header=None, dtype=str, keep_default_na=False)
        if df.shape[0] < 3:
            return JSONResponse(status_code=400, content={"error": t("not_enough_rows", lang)})

        spalten_ids = ["ID" if str(val).strip() == "#ID#" else str(val).strip() for val in df.iloc[0]]
        spalten_namen = [str(val).strip() for val in df.iloc[1]]

        daten = df.iloc[2:].copy()
        daten.columns = spalten_ids
        if "#ID#" in daten.columns:
            daten = daten.rename(columns={"#ID#": "ID"})

        return {
            "columns": spalten_ids,
            "column_names": spalten_namen,
            "rows": daten.to_dict(orient="records")
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"{t('read_error', lang)} {e}"})


# ---- Frontend-Konfiguration für Kombis laden ----
@app.get("/api/kombi_config")
async def get_kombi_config(session: str, filename: str, lang: str = Query("de")):
    """Liest eine Kombi-Datei ein und liefert die Frontend-Konfiguration."""
    user_path = UPLOAD_BASE / session / "kombis" / filename
    global_path = Path(config.selectioncombis_dir) / filename
    if user_path.exists():
        file_path = user_path
    elif global_path.exists():
        file_path = global_path
    else:
        return JSONResponse(status_code=404, content={"error": t("file_not_found", lang)})

    try:
        loader = ExcelLoader(str(file_path), sprache=lang)
        kombis_df = loader.lade_excel()
        config_data = lade_frontend_konfiguration(kombis_df)
        return config_data
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ---- Feature-Flags für das Frontend ----
@app.get("/api/features")
async def get_features():
    """Liefert Feature-Flags aus der Backend-Konfiguration."""
    return {
        "show_round_options": config.show_round_options,
        "show_tester_checkbox": config.show_tester_checkbox,
        "show_dev2_checkbox": config.show_dev2_checkbox,
        "loadingscreen_duration": config.duration_loadingscreen,
    }

# ---- Attributbeschreibungen laden ----
@app.get("/api/attribute_descriptions")
async def get_attribute_descriptions(lang: str = Query(default=config.default_language)):
    """Liefert Namen und Beschreibungen der Attribute in der gewählten Sprache."""
    desc_path = Path(config.attribute_description_file)
    if not desc_path.exists():
        return JSONResponse(status_code=404, content={"error": t("file_not_found", lang)})

    try:
        df = pd.read_excel(desc_path, header=None, dtype=str, keep_default_na=False)
        if df.shape[0] < 7:
            return JSONResponse(status_code=400, content={"error": t("not_enough_rows", lang)})

        attr_ids = [str(val).strip() for val in df.iloc[0, 1:]]

        if lang.startswith("en"):
            desc_row, name_row = 2, 5
        elif lang.startswith("fr"):
            desc_row, name_row = 3, 6
        else:
            desc_row, name_row = 1, 4

        descriptions = [str(val).strip() for val in df.iloc[desc_row, 1:1+len(attr_ids)]]
        names = [str(val).strip() for val in df.iloc[name_row, 1:1+len(attr_ids)]]

        result = {
            attr_id: {"name": name, "description": desc}
            for attr_id, name, desc in zip(attr_ids, names, descriptions)
        }
        return {"attributes": result}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})












# ---- Beispiel: Ranking-Endpoint (optional, je nach App-Logik) ----
@app.get("/api/ranking")
async def get_ranking(lang: str = Query(default=config.default_language)):
    ideen_path = Path(config.current_ideen_path)
    if not ideen_path.exists():
        return JSONResponse(status_code=404, content={"error": t("file_not_found", lang)})

    try:
        loader = ExcelLoader(ideen_path, sprache=lang)
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


    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail=t("file_not_found", lang))

    return FileResponse(
        path=filepath,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename=templatefile
    )


# ---- Download Instructions ----
@app.get("/download_instruction")
async def download_instruction(lang: str = Query("de")):
    import os

    configparser_ = configparser.ConfigParser()
    configparser_.read("matrixconfig.ini")

    templatedir = configparser_["Dateien"].get("pathInstructionData", "templates")

    if lang == "de":
        filename = configparser_["Dateien"].get("InstructionDownloadDe", "AnleitungTabellen.pdf")
    elif lang == "en":
        filename = configparser_["Dateien"].get("InstructionDownloadEn", "InstructionTables.pdf")
    elif lang == "fr":
        filename = configparser_["Dateien"].get("InstructionDownloadFr", "InstructionTableau.pdf")
    else:
        filename = configparser_["Dateien"].get("InstructionDownloadDe", "AnleitungTabellen.pdf")

    filepath = os.path.abspath(os.path.join(templatedir, filename))

    if not os.path.isfile(filepath):
        raise HTTPException(status_code=404, detail=t("file_not_found", lang))

    return FileResponse(path=filepath, media_type="application/pdf", filename=filename)


# ---- Bewertungslauf speichern ----
STORAGE_FOLDER = Path(__file__).parent.parent / "storage" / "runs"
STORAGE_FOLDER.mkdir(parents=True, exist_ok=True)

# Ordner für Nutzungsdaten
ARCHIVE_FOLDER = Path(__file__).parent.parent / "archive"
ARCHIVE_FOLDER.mkdir(parents=True, exist_ok=True)


@app.post("/save_run")
async def save_run(data: dict):
    """Speichert einen Bewertungslauf als JSON-Datei."""
    lang = data.get("lang", config.default_language)
    if not data or "tester" not in data:
        raise HTTPException(status_code=400, detail=t("invalid_data", lang))

    tester_flag = bool(data.get("tester"))

    run_id = str(uuid.uuid4())
    filepath = STORAGE_FOLDER / f"{run_id}.json"

    if not tester_flag:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    # auch in die Datenbank schreiben
    with SessionLocal() as db:
        db_entry = Calculation(
            id=run_id,
            session_id=data.get("session"),
            timestamp=datetime.utcnow(),
            sprache=data.get("lang", config.default_language),
            datenfreigabe=data.get("datenfreigabe"),
            ideen_json=data.get("ideen"),
            gewichtung_json=data.get("gewichtung"),
            ranking_json=data.get("ranking"),
            nutzerdaten_json=data.get("nutzerdaten"),
            tester=tester_flag,
        )
        db.add(db_entry)
        db.commit()

    if tester_flag:
        return {"message": t("run_not_saved_tester", lang), "status": "ok"}
    return {"message": t("run_saved", lang), "run_id": run_id, "status": "ok"}


# ---- Anzahl gespeicherter Berechnungen abrufen ----
@app.get("/api/calc_count")
def get_calc_count():
    """Liefert die Anzahl der gespeicherten Berechnungsläufe."""
    with SessionLocal() as db:
        count = db.query(Calculation).filter(Calculation.tester == False).count()
    return {"count": count}


# ---- Nutzungsdaten speichern ----
@app.post("/log_step")
async def log_step(request: Request, payload: dict):
    session = payload.get("session")
    step = payload.get("step")
    if not session or not step:
        raise HTTPException(status_code=400, detail="Session und Schritt erforderlich")
    entry = {
        "timestamp": datetime.utcnow().isoformat(),
        "step": step,
        "data": payload.get("data", {}),
        "user_agent": request.headers.get("User-Agent", ""),
    }
    # auch in die Datenbank schreiben
    with SessionLocal() as db:
        log_row = UsageLog(
            session=session,
            timestamp=datetime.utcnow(),
            step=step,
            data_json=payload.get("data", {}),
            user_agent=request.headers.get("User-Agent", ""),
        )
        db.add(log_row)
        db.commit()
    session_folder = ARCHIVE_FOLDER / session
    session_folder.mkdir(parents=True, exist_ok=True)
    log_file = session_folder / "usage.jsonl"
    with open(log_file, "a", encoding="utf-8") as f:
        json.dump(entry, f, ensure_ascii=False)
        f.write("\n")
    return {"message": "Logged"}


# ---- Berechnung und Ranking ----
@app.post("/api/calculate")
async def calculate_ranking(payload: dict):
    """Berechnet das Ranking der Ideen anhand der übermittelten Auswahl."""
    session = payload.get("session", "")
    ideen_file = payload.get("ideen_file")
    kombi_file = payload.get("kombi_file")
    ideen_ids = payload.get("ideen_ids", [])
    gewichtungen = payload.get("gewichtungen", {})
    lang = payload.get("lang", config.default_language)

    if not ideen_file or not kombi_file:
        raise HTTPException(status_code=400, detail="missing filenames")

    ideen_path = resolve_file("ideen", session, ideen_file)
    kombi_path = resolve_file("kombis", session, kombi_file)

    try:
        ideen_loader = ExcelLoader(str(ideen_path), sprache=lang)
        ideen_df = ideen_loader.lade_excel()

        kombi_loader = ExcelLoader(str(kombi_path), sprache=lang)
        kombis_df = kombi_loader.lade_excel()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if ideen_ids:
        ideen_df = ideen_df[ideen_df["ID"].astype(str).isin([str(i) for i in ideen_ids])]

    bewertung = Bewertung(ideen_df, kombis_df, gewichtungen)
    kombi_ergebnisse = bewertung.berechne_alle_kombinationen()
    ranking_series = bewertung.berechne_gesamt_ranking(kombi_ergebnisse)

    results = []
    for idee_id, score in ranking_series.items():
        idee = ideen_df.loc[idee_id]
        raw_details = {
            col: kombi_ergebnisse.loc[idee_id, col]
            for col in kombi_ergebnisse.columns
        }

        # FastAPI's jsonable_encoder cannot handle numpy scalar types, therefore
        # convert them explicitly to Python float values
        details = {
            col: (float(val) if val == val else None)
            for col, val in raw_details.items()
        }

        results.append({
            "id": str(idee_id),
            "name": idee.get("titel", ""),
            "beschreibung": idee.get("beschreibung", ""),
            "score": float(score) if score == score else None,
            "details": details,
        })

    return {"ranking": results}
