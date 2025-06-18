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

The i18next library's debug output is disabled by default. You can enable it by
setting the `VITE_I18N_DEBUG` environment variable to `true` before starting the
frontend:

```bash
VITE_I18N_DEBUG=true npm run dev
```

## Linting and type checking (offline)

After the frontend dependencies have been installed once, run the lint and type
checking commands from within the `frontend/` directory. Example:

```bash
cd frontend
npm run lint       # runs eslint on the frontend source
npm run typecheck  # runs TypeScript type checking
```

Currently this repository does not contain automated tests.
