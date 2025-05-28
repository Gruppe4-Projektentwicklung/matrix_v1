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
    // TODO: Ideendaten aus der neuen Sammlung laden und setIdeen aufrufen
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
    <div className="min-h-screen bg-[#f5f7fa] font-inter flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between py-5 px-4">
          <div className="flex items-center gap-3">
            <img src="/logo192.png" alt="Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold tracking-tight text-primary-800">{t("title")}</span>
          </div>
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <label htmlFor="lang-select" className="font-medium text-gray-600">
              {t("language")}
            </label>
            <select
              id="lang-select"
              value={language}
              onChange={handleLanguageChange}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </header>

      {/* Hauptbereich */}
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl px-4 py-8 space-y-6">
          {/* Collection Auswahl */}
          <section>
            <CollectionSelector
              sammlungTyp="ideen"
              aktuelleSammlungName={aktuelleIdeensammlung}
              onSammlungChange={handleIdeenSammlungChange}
              onUpload={handleIdeenUpload}
              templateUrl="/templates/ideen-vorlage.xlsx"
            />
          </section>

          {/* Ideen-Auswahl */}
          <section>
            <IdeenSelector
              ideen={ideen}
              sprache={language as "de" | "en" | "fr"}
              onUpdate={handleIdeenUpdate}
            />
          </section>

          {/* Bewertungs- und Gewichtungsoptionen */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BewertungsOptionen
              runde1={runde1}
              runde2={runde2}
              appTester={appTester}
              datenfreigabe={datenfreigabe}
              onChange={handleBewertungsOptionenChange}
            />
            <WeightingSelector
              kombinationen={gewichtungen}
              onUpdate={handleGewichtungenUpdate}
            />
          </section>

          {/* Ranking */}
          <section>
            <Ranking eintraege={rankingEintraege} />
          </section>

          {/* Export und Statistik */}
          <section className="flex flex-col md:flex-row justify-between items-center gap-3">
            <ExportRankingButton eintraege={rankingEintraege} />
            <button
              onClick={() => setStatistikFormOpen(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-5 rounded-xl shadow"
            >
              {t("saveRating")}
            </button>
          </section>
        </div>
      </main>

      {/* Modals & Toasts */}
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

      {/* Footer */}
      <footer className="bg-white text-xs text-gray-400 py-6 mt-10 text-center shadow-inner">
        &copy; {new Date().getFullYear()} Gruppe 4 Projektentwicklung | matrix.gruppe4-projektentwicklung.de
      </footer>
    </div>
  );
}

export default App;
