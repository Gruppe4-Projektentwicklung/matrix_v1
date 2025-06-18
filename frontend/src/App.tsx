
import React, { useState, useEffect, useCallback } from "react";

import "./App.css";
import "./i18n";

import { useTranslation } from "react-i18next";

import { Routes, Route } from "react-router-dom";

import { StartPage } from "./pages/StartPage";
import { SelectDataPage } from "./pages/SelectDataPage";
import { IdeaSelectionPage } from "./pages/IdeaSelectionPage";
import { CombinationSelectionPage } from "./pages/CombinationSelectionPage";
import { PersonalDataPage } from "./pages/PersonalDataPage";
import { ConfigSummaryPage } from "./pages/ConfigSummaryPage";
import { CalcResultsPage } from "./pages/CalcResultsPage";

// import { KombiInfoModal } from "./components/KombiInfoModal"; // ← entfernt, da ungenutzt
import { SaveRunSuccess } from "./components/SaveRunSuccess";
import { StatistikForm } from "./components/StatistikForm";
import { StatusToast } from "./components/StatusToast";

import { getSessionId } from "./utils/session";

function App() {
	
	const sessionId = getSessionId();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language || (import.meta.env.VITE_DEFAULT_LANGUAGE || "en"),
  );

 
  const [ideen, setIdeen] = useState<any[]>([]);
  const [runde1, setRunde1] = useState(true);
  const [runde2, setRunde2] = useState(true);
  const [appTester, setAppTester] = useState(false);
  const [datenfreigabe, setDatenfreigabe] = useState<"offen" | "anonym" | "keine">("offen");
  const [gewichtungen, setGewichtungen] = useState<any[]>([]);
  const [rankingEintraege/*, setRankingEintraege*/] = useState<any[]>([]);
  /* const [kombiInfoModalOpen, setKombiInfoModalOpen] = useState(false);
  const [kombiInfoPayload, setKombiInfoPayload] = useState<any>(null); */
  const [saveRunSuccessOpen, setSaveRunSuccessOpen] = useState(false);
  const [saveRunMessage, setSaveRunMessage] = useState("");
  const [saveRunId, setSaveRunId] = useState<string | undefined>(undefined);
  const [statistikFormOpen, setStatistikFormOpen] = useState(false);
  const [statusToastOpen, setStatusToastOpen] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState("");
  const [statusToastType, setStatusToastType] = useState<"success" | "error" | "info">("info");

const [aktuelleIdeensammlung, setAktuelleIdeensammlung] = useState("default_ideen.xlsx");
const [aktuelleKombiSammlung, setAktuelleKombiSammlung] = useState("default_kombi.xlsx");

  const fetchCollectionContent = useCallback(
    async (typ: "ideen" | "kombis", filename: string) => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/uploads/${typ}/content?session=${sessionId}&filename=${encodeURIComponent(
          filename,
        )}`;
        const response = await fetch(url);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || `HTTP ${response.status}`);
        }
        return await response.json();
      } catch (err) {
        setStatusToastMessage(
          `${t("uploadError")}: ${err instanceof Error ? err.message : String(err)}`,
        );
        setStatusToastType("error");
        setStatusToastOpen(true);
        return null;
      }
    },
    [sessionId, t],
  );

  const loadIdeen = useCallback(
    async (filename: string) => {
      const data = await fetchCollectionContent("ideen", filename);
      if (!data) return;
      const rows = Array.isArray(data.rows) ? data.rows : [];
      const parsed = rows.map((row: any, idx: number) => {
        const attrs: Record<string, any> = {};
        Object.keys(row).forEach((k) => {
          if (k.startsWith("#-#") || k.startsWith("#+#")) attrs[k] = row[k];
        });
        return { id: row.id || row.ID || String(idx + 1), aktiv: true, attribute: attrs, ...row };
      });
      setIdeen(parsed);
    },
    [fetchCollectionContent],
  );

  const loadKombis = useCallback(
    async (filename: string) => {
      const data = await fetchCollectionContent("kombis", filename);
      if (!data) return;
      const rows = Array.isArray(data.rows) ? data.rows : [];
      const parsed = rows.map((row: any, idx: number) => ({
        id: row.Kombi_ID || row.id || String(idx + 1),
        name: row["#t_de#1"] || row.name || "",
        beschreibung: row["#t_de#2"] || row.beschreibung || "",
        gewichtung: 0,
        aktiv: false,
        ...row,
      }));
      setGewichtungen(parsed);
    },
    [fetchCollectionContent],
  );


  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleIdeenSammlungChange = (dateiName: string) => {
    setAktuelleIdeensammlung(dateiName);
    loadIdeen(dateiName);
  };
const handleKombiUpload = async (file: File, sessionId: string) => {
  setStatusToastMessage(t("uploadFile") + " " + file.name + " (Session: " + sessionId + ")");
  setStatusToastType("info");
  setStatusToastOpen(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/kombis?session=${sessionId}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      setStatusToastMessage(t("uploadSuccess") + ": " + result.filename);
      setStatusToastType("success");
    } else {
      const errMsg = result.error ?? "unknown error";
      setStatusToastMessage(t("uploadError") + ": " + t(errMsg));
      setStatusToastType("error");
    }
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
    setStatusToastMessage(t("uploadError"));
    setStatusToastType("error");
  } finally {
    setStatusToastOpen(true);
  }
};

const handleKombiSammlungChange = (dateiName: string) => {
  setAktuelleKombiSammlung(dateiName);
  loadKombis(dateiName);
};

  // Nach Auswahl oder Upload einer Kombi-Datei Konfiguration laden
  useEffect(() => {
    if (!aktuelleKombiSammlung) return;
    const loadConfig = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/kombi_config?session=${sessionId}&filename=${encodeURIComponent(
            aktuelleKombiSammlung
          )}&lang=${language}`
        );
        const data = await res.json();
        if (res.ok) {
          setGewichtungen(data.kombinationen || []);
        } else {
          console.error("Fehler beim Laden der Konfiguration", data.error);
        }
      } catch (err) {
        console.error("Fehler beim Laden der Konfiguration", err);
      }
    };
    loadConfig();
  }, [aktuelleKombiSammlung, language, sessionId]);

  const handleIdeenUpload = async (file: File, sessionId: string) => {
  setStatusToastMessage(t("uploadFile") + " " + file.name + " (Session: " + sessionId + ")");
  setStatusToastType("info");
  setStatusToastOpen(true);

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/ideen?session=${sessionId}`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      setStatusToastMessage(t("uploadSuccess") + ": " + result.filename);
      setStatusToastType("success");
    } else {
      const errMsg = result.error ?? "unknown error";
      setStatusToastMessage(t("uploadError") + ": " + t(errMsg));

      setStatusToastType("error");
    }
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
    setStatusToastMessage(t("uploadError"));

    setStatusToastType("error");
  } finally {
    setStatusToastOpen(true);
  }
};


  const handleIdeenUpdate = (updatedIdeen: any[]) => {
    setIdeen(updatedIdeen);
  };

  const handleBewertungsOptionenChange = (field: string, value: any) => {
    if (field === "runde1") setRunde1(value);
    if (field === "runde2") setRunde2(value);
    if (field === "appTester") setAppTester(value);
    if (field === "datenfreigabe") setDatenfreigabe(value);
  };

  const handleGewichtungenUpdate = (updatedGewichtungen: any[]) => {
    setGewichtungen(updatedGewichtungen);
  };

  /* const handleCloseKombiInfoModal = () => {
    setKombiInfoModalOpen(false);
    setKombiInfoPayload(null);
  }; */

  const handleCloseSaveRunSuccess = () => {
    setSaveRunSuccessOpen(false);
    setSaveRunMessage("");
    setSaveRunId(undefined);
  };

  const openStatistikForm = () => {
    setStatistikFormOpen(true);
  };

  const handleCloseStatistikForm = () => {
    setStatistikFormOpen(false);
  };

  const handleSaveSuccess = (result: { run_id?: string; message: string }) => {
    setSaveRunId(result.run_id);
    setSaveRunMessage(result.message);
    setSaveRunSuccessOpen(true);
  };

  const handleCloseStatusToast = () => {
    setStatusToastOpen(false);
    setStatusToastMessage("");
  };

  useEffect(() => {
    loadIdeen(aktuelleIdeensammlung);
    loadKombis(aktuelleKombiSammlung);
  }, [loadIdeen, loadKombis]);

  return (

    <div className="min-h-screen w-full bg-gray-200 text-gray-900 font-inter flex flex-col items-center justify-center py-10">
      <div className="fixed top-4 left-4 z-50 bg-white/90 px-3 py-2 rounded-xl shadow border text-sm font-mono">
        Session ID: {sessionId}
      </div>

   

      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 px-3 py-2 rounded-xl shadow border">

          <select
            id="lang-select"
            value={language}
            onChange={handleLanguageChange}
            className="px-2 py-1 rounded border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1d2c5b] text-sm"
            style={{ minWidth: 80 }}
          >
            <option value="de">Deutsch</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route
          path="/select-data"
          element={(
            <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10">
              <SelectDataPage
                aktuelleIdeensammlung={aktuelleIdeensammlung}
                aktuelleKombiSammlung={aktuelleKombiSammlung}
                onIdeenSammlungChange={handleIdeenSammlungChange}
                onKombiSammlungChange={handleKombiSammlungChange}
                onIdeenUpload={(file) => handleIdeenUpload(file, sessionId)}
                onKombiUpload={(file) => handleKombiUpload(file, sessionId)}
              />
            </div>
          )}
        />
        <Route
          path="/ideas"
          element={(
            <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10">
              <IdeaSelectionPage
                ideen={ideen}
                sprache={language as "de" | "en" | "fr"}
                onIdeenUpdate={handleIdeenUpdate}
              />
            </div>
          )}
        />
        <Route
          path="/combinations"
          element={(
            <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10">
              <CombinationSelectionPage
                gewichtungen={gewichtungen}
                runde1={runde1}
                runde2={runde2}
                appTester={appTester}
                datenfreigabe={datenfreigabe}
                onGewichtungenUpdate={handleGewichtungenUpdate}
                onOptionsChange={handleBewertungsOptionenChange}
              />
            </div>
          )}
        />
        <Route
          path="/personal"
          element={(
            <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10">
              <PersonalDataPage
                onOpenStatistikForm={openStatistikForm}
                onCloseStatistikForm={handleCloseStatistikForm}
              />
            </div>
          )}
        />
        <Route
          path="/summary"
          element={(
            <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10">
              <ConfigSummaryPage
                ideenCount={ideen.length}
                activeIdeen={ideen.filter((i) => i.aktiv).length}
                kombiCount={gewichtungen.length}
                activeKombis={gewichtungen.filter((k) => k.aktiv).length}
              />
            </div>
          )}
        />
        <Route
          path="/results"
          element={(
            <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10">
              <CalcResultsPage rankingEintraege={rankingEintraege} />
            </div>
          )}
        />
      </Routes>

      <StatistikForm
        open={statistikFormOpen}
        onClose={handleCloseStatistikForm}
        tester={appTester}
        payload={{
          ideenSammlung: aktuelleIdeensammlung,
          kombiSammlung: "",
          gewaehlteIdeen: ideen.filter(i => i.aktiv).map(i => i.id),
          deaktivierteIdeen: ideen.filter(i => !i.aktiv).map(i => i.id),
          gewichtungen: {},
          ergebnisRanking: rankingEintraege,
        }}
        onSaveSuccess={handleSaveSuccess}
      />

      <SaveRunSuccess
        open={saveRunSuccessOpen}
        message={saveRunMessage}
        runId={saveRunId}
        onClose={handleCloseSaveRunSuccess}
        isTester={appTester}
      />

      {/* <KombiInfoModal
        open={kombiInfoModalOpen}
        kombi={kombiInfoPayload}
        sprache={language as "de" | "en" | "fr"}
        onClose={handleCloseKombiInfoModal}
      /> */}

      <StatusToast
        open={statusToastOpen}
        message={statusToastMessage}
        onClose={handleCloseStatusToast}
        type={statusToastType}
      />
    </div>
  );
}

export default App;
