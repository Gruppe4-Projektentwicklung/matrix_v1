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

  // States (ggf. weiter anpassen)
  const [aktuelleIdeensammlung, setAktuelleIdeensammlung] = useState("default_ideen.xlsx");
  const [ideen, setIdeen] = useState<any[]>([]);
  const [runde1, setRunde1] = useState(true);
  const [runde2, setRunde2] = useState(true);
  const [appTester, setAppTester] = useState(false);
  const [datenfreigabe, setDatenfreigabe] = useState<"offen" | "anonym" | "keine">("offen");
  const [gewichtungen, setGewichtungen] = useState<any[]>([]);
  const [rankingEintraege, setRankingEintraege] = useState<any[]>([]);

  // Weitere States für Modals und Toasts
  const [kombiInfoModalOpen, setKombiInfoModalOpen] = useState(false);
  const [kombiInfoPayload, setKombiInfoPayload] = useState<any>(null);
  const [saveRunSuccessOpen, setSaveRunSuccessOpen] = useState(false);
  const [saveRunMessage, setSaveRunMessage] = useState("");
  const [saveRunId, setSaveRunId] = useState<string | undefined>(undefined);
  const [statistikFormOpen, setStatistikFormOpen] = useState(false);
  const [statusToastOpen, setStatusToastOpen] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState("");
  const [statusToastType, setStatusToastType] = useState<"success" | "error" | "info">("info");

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Sprachumschalter oben rechts */}
      <div className="w-full max-w-5xl flex justify-end mb-4">
        <label className="mr-2 font-semibold">{t("language")}</label>
        <select
          id="lang-select"
          value={language}
          onChange={handleLanguageChange}
          className="px-2 py-1 border rounded shadow-sm"
        >
          <option value="de">Deutsch</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      {/* Hauptcontainer */}
      <div className="max-w-5xl w-full bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {t("title")}
        </h1>

        <CollectionSelector
          sammlungTyp="ideen"
          aktuelleSammlungName={aktuelleIdeensammlung}
          onSammlungChange={setAktuelleIdeensammlung}
          onUpload={(file) => {
            setStatusToastMessage(t("uploadFile") + " " + file.name);
            setStatusToastType("success");
            setStatusToastOpen(true);
          }}
          templateUrl="/templates/ideen-vorlage.xlsx"
        />

        <IdeenSelector ideen={ideen} sprache={language as "de" | "en" | "fr"} onUpdate={setIdeen} />

        <BewertungsOptionen
          runde1={runde1}
          runde2={runde2}
          appTester={appTester}
          datenfreigabe={datenfreigabe}
          onChange={(field, value) => {
            switch (field) {
              case "runde1": setRunde1(value); break;
              case "runde2": setRunde2(value); break;
              case "appTester": setAppTester(value); break;
              case "datenfreigabe": setDatenfreigabe(value); break;
            }
          }}
        />

        <WeightingSelector kombinationen={gewichtungen} onUpdate={setGewichtungen} />

        <Ranking eintraege={rankingEintraege} />

        <ExportRankingButton eintraege={rankingEintraege} />
      </div>

      {/* Modals und Toasts */}
      <StatistikForm
        open={statistikFormOpen}
        onClose={() => setStatistikFormOpen(false)}
        payload={{ ideenSammlung: aktuelleIdeensammlung, kombiSammlung: "", gewaehlteIdeen: [], deaktivierteIdeen: [], gewichtungen: {}, ergebnisRanking: rankingEintraege }}
        onSaveSuccess={(result) => {
          setSaveRunId(result.run_id);
          setSaveRunMessage(result.message);
          setSaveRunSuccessOpen(true);
        }}
      />

      <SaveRunSuccess
        open={saveRunSuccessOpen}
        message={saveRunMessage}
        runId={saveRunId}
        onClose={() => setSaveRunSuccessOpen(false)}
        isTester={appTester}
      />

      <StatusToast
        open={statusToastOpen}
        message={statusToastMessage}
        onClose={() => setStatusToastOpen(false)}
        type={statusToastType}
      />
    </div>
  );
}

export default App;
