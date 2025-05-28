import React, { useState } from "react";
import "./App.css";
import "./i18n";

import { useTranslation } from "react-i18next";

import { BewertungsOptionen } from "./components/BewertungsOptionen";
import { CollectionSelector } from "./components/CollectionSelector";
import { ExportRankingButton } from "./components/ExportRankingButton";
import { IdeenSelector } from "./components/IdeenSelector";
import { KombiInfoModal } from "./components/KombiInfoModal";
import { Ranking } from "./components/Ranking";
import { SaveRunSuccess } from "./components/SaveRunSuccess";
import { StatistikForm } from "./components/StatistikForm";
import { StatusToast } from "./components/StatusToast";
import { WeightingSelector } from "./components/WeightingSelector";

function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || "de");

  // States (je nach deinem Projekt ggf. anpassen)
  const [aktuelleIdeensammlung, setAktuelleIdeensammlung] = useState("default_ideen.xlsx");
  const [ideen, setIdeen] = useState<any[]>([]);
  const [runde1, setRunde1] = useState(true);
  const [runde2, setRunde2] = useState(true);
  const [appTester, setAppTester] = useState(false);
  const [datenfreigabe, setDatenfreigabe] = useState<"offen" | "anonym" | "keine">("offen");
  const [gewichtungen, setGewichtungen] = useState<any[]>([]);
  const [rankingEintraege] = useState<any[]>([]);
  const [kombiInfoModalOpen, setKombiInfoModalOpen] = useState(false);
  const [kombiInfoPayload, setKombiInfoPayload] = useState<any>(null);
  const [saveRunSuccessOpen, setSaveRunSuccessOpen] = useState(false);
  const [saveRunMessage, setSaveRunMessage] = useState("");
  const [saveRunId, setSaveRunId] = useState<string | undefined>(undefined);
  const [statistikFormOpen, setStatistikFormOpen] = useState(false);
  const [statusToastOpen, setStatusToastOpen] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState("");
  const [statusToastType, setStatusToastType] = useState<"success" | "error" | "info">("info");

  // Sprachwechsel-Handler
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  // CollectionSelector
  const handleIdeenSammlungChange = (dateiName: string) => {
    setAktuelleIdeensammlung(dateiName);
  };

  const handleIdeenUpload = (file: File) => {
    setStatusToastMessage(t("uploadFile") + " " + file.name);
    setStatusToastType("success");
    setStatusToastOpen(true);
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

  const handleCloseKombiInfoModal = () => {
    setKombiInfoModalOpen(false);
    setKombiInfoPayload(null);
  };

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
  <div className="min-h-screen bg-[#f4f6fa] text-gray-900 font-inter">
    {/* Sprachumschalter oben rechts */}
    <div className="w-full flex justify-end items-center p-4">
      <div className="flex items-center gap-2">
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

    {/* Hauptcontainer */}
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 my-8">
      <h1 className="text-3xl font-bold mb-8 text-[#1d2c5b] text-center">{t("title")}</h1>

      <CollectionSelector
        sammlungTyp="ideen"
        aktuelleSammlungName={aktuelleIdeensammlung}
        onSammlungChange={handleIdeenSammlungChange}
        onUpload={handleIdeenUpload}
        templateUrl="/templates/ideen-vorlage.xlsx"
      />

      <div className="mt-6">
        <IdeenSelector
          ideen={ideen}
          sprache={language as "de" | "en" | "fr"}
          onUpdate={handleIdeenUpdate}
        />
      </div>

      <div className="mt-6">
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

    {/* Modals, Toasts usw. */}
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

    <KombiInfoModal
      open={kombiInfoModalOpen}
      kombi={kombiInfoPayload}
      sprache={language as "de" | "en" | "fr"}
      onClose={handleCloseKombiInfoModal}
    />

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
