# Matrix Tool

This project consists of a FastAPI backend and a Vite/React frontend.

## Installation

1. **Backend dependencies**
   ```bash
   python -m pip install -r backend/requirements.txt
   ```
2. **Frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```
3. **Install script**
   The helper script `./codex-setup.sh` installs the Node packages for you. Run
   it from the repository root if you prefer an automated setup.

## Running the application

### Backend

Start the FastAPI backend using uvicorn:
```bash
uvicorn backend.main:app --reload
```

### Frontend

Run the Vite development server:
```bash
cd frontend
npm run dev
```

The frontend expects the backend URL in the `VITE_API_URL` environment
variable.  You can adjust this in `frontend/.env` if your backend is not
running on `http://localhost:8000`.

The i18next library's debug output is disabled by default. You can enable it by
setting the `VITE_I18N_DEBUG` environment variable to `true` before starting the
frontend:

```bash
VITE_I18N_DEBUG=true npm run dev
```

### Backend configuration

The backend reads `backend/matrixconfig.ini` on startup.  Path options in the
`[Dateien]` section control where uploads, templates and log files are stored.
Feature flags in the `[Features]` section enable or disable optional
functionality such as export buttons, custom uploads or usage logging.  Adjust
these values to match your environment.

### Logging endpoints

The backend exposes two helper endpoints for collecting usage data.

* **`/save_run`** – stores a full evaluation run as a JSON file under
  `storage/runs/`.
* **`/log_step`** – appends a single user step to an archive file identified by
  a session ID.

## Linting and type checking (offline)

After the frontend dependencies have been installed once, run the lint and type
checking commands from within the `frontend/` directory. Example:

```bash
cd frontend
npm run lint       # runs eslint on the frontend source
npm run typecheck  # runs TypeScript type checking
```

Currently this repository does not contain automated tests.

### Attribute description file

The optional info dialog for attributes expects a spreadsheet under
`backend/uploads/attributdescription/CW25_AttributDescrition.xlsx`. Because
binary files are not included in version control, you can generate this file
locally with the helper script:

```bash
python backend/scripts/generate_attribute_descriptions.py \
    backend/uploads/selectionideas/Dev_CW25_idea_list_filled.xlsx \
    backend/uploads/attributdescription/CW25_AttributDescrition.xlsx
```

The script extracts the attribute columns from the idea list and creates a sheet
with placeholder descriptions in German, English and French.  Adjust the
resulting spreadsheet to provide the real texts used by the information dialog.
