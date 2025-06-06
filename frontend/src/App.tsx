import React, { useState } from "react";
import "./App.css";
import "./i18n";

import { useTranslation } from "react-i18next";

import { BewertungsOptionen } from "./components/BewertungsOptionen";
import { CollectionSelectorIdeas } from "./components/CollectionSelectorIdeas";
import { CollectionSelectorKombis } from "./components/CollectionSelectorKombis";
import { ExportRankingButton } from "./components/ExportRankingButton";
import { IdeenSelector } from "./components/IdeenSelector";
// import { KombiInfoModal } from "./components/KombiInfoModal"; // ← entfernt, da ungenutzt
import { Ranking } from "./components/Ranking";
import { SaveRunSuccess } from "./components/SaveRunSuccess";
import { StatistikForm } from "./components/StatistikForm";
import { StatusToast } from "./components/StatusToast";
import { WeightingSelector } from "./components/WeightingSelector";

import { getSessionId } from "./utils/session";

function App() {
	
	const sessionId = getSessionId();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "de");

 
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


  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleIdeenSammlungChange = (dateiName: string) => {
    setAktuelleIdeensammlung(dateiName);
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
      setStatusToastMessage(t("uploadError") + ": " + t(result.error));
      setStatusToastType("error");
    }
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
    setStatusToastMessage(t("uploadError") + ": " + t(result.error));
    setStatusToastType("error");
  } finally {
    setStatusToastOpen(true);
  }
};

const handleKombiSammlungChange = (dateiName: string) => {
  setAktuelleKombiSammlung(dateiName);
};

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
      setStatusToastMessage(t("uploadError") + ": " + (error instanceof Error ? error.message : String(error)));

      setStatusToastType("error");
    }
  } catch (error) {
    console.error("Fehler beim Hochladen:", error);
    setStatusToastMessage(t("uploadError") + ": " + (error instanceof Error ? error.message : String(error)));

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

  return (
    <div className="min-h-screen w-full bg-gray-200 text-gray-900 font-inter flex flex-col items-center py-10">
      <div className="w-full max-w-7xl bg-gray-800 text-white shadow-xl rounded-2xl p-8 relative">
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 px-3 py-2 rounded-xl shadow border">

          <label htmlFor="lang-select" className="font-semibold text-sm">{t("language")}</label>
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
      </div>

      <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10">
        <h1 className="text-4xl font-bold mb-8 text-[#1d2c5b] text-center tracking-tight drop-shadow">
          {t("title")}
        </h1>

        <CollectionSelectorIdeas
  aktuelleSammlungName={aktuelleIdeensammlung}
  onSammlungChange={handleIdeenSammlungChange}
  onUpload={(file) => handleIdeenUpload(file, sessionId)}
/>

<CollectionSelectorKombis
  aktuelleSammlungName={aktuelleKombiSammlung}
  onSammlungChange={handleKombiSammlungChange}
  onUpload={(file) => handleKombiUpload(file, sessionId)}
/>
        <div className="mt-6">
          <IdeenSelector
            ideen={ideen}
            sprache={language as "de" | "en" | "fr"}
            onUpdate={handleIdeenUpdate}
          />
        </div>

        <div className="bg-[#f8fafc] p-6 rounded-xl shadow mb-8">
          <BewertungsOptionen
            runde1={runde1}
            runde2={runde2}
            appTester={appTester}
            datenfreigabe={datenfreigabe}
            onChange={handleBewertungsOptionenChange}
          />
        </div>

        <div className="mt-6">
          <WeightingSelector
            kombinationen={gewichtungen}
            onUpdate={handleGewichtungenUpdate}
          />
        </div>

        <div className="mt-6">
          <Ranking eintraege={rankingEintraege} />
        </div>

        <div className="mt-6 flex flex-col items-center gap-4">
          <ExportRankingButton eintraege={rankingEintraege} />
        </div>
      </div>

      <StatistikForm
        open={statistikFormOpen}
        onClose={handleCloseStatistikForm}
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
