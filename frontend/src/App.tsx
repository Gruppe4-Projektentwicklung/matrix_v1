import React, { useState } from "react";
import "./App.css";
import "./i18n"; // i18n initialisieren

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

  // Beispiel States für Props (müsstest du noch durch deine echten Daten ersetzen)
  const [aktuelleIdeensammlung, setAktuelleIdeensammlung] = useState("default_ideen.xlsx");
  //const [eigeneIdeensammlungen, setEigeneIdeensammlungen] = useState<string[]>([]);
  const [ideen, setIdeen] = useState<any[]>([]); // Typ gerne genauer definieren
  const [runde1, setRunde1] = useState(true);
  const [runde2, setRunde2] = useState(true);
  const [appTester, setAppTester] = useState(false);
  const [datenfreigabe, setDatenfreigabe] = useState<"offen" | "anonym" | "keine">("offen");
  const [gewichtungen, setGewichtungen] = useState<any[]>([]); // Typ ebenfalls anpassen
  //const [rankingEintraege, setRankingEintraege] = useState<any[]>([]);
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

  // Beispiel-Handler für CollectionSelector
  const handleIdeenSammlungChange = (dateiName: string) => {
    setAktuelleIdeensammlung(dateiName);
    // TODO: Ideendaten aus der neuen Sammlung laden und setIdeen aufrufen
  };

  const handleIdeenUpload = (file: File) => {
    // TODO: Datei einlesen und eigeneSammlungen / ideen updaten
    setStatusToastMessage(t("uploadFile") + " " + file.name);
    setStatusToastType("success");
    setStatusToastOpen(true);
  };

  // Beispiel-Handler für IdeenSelector
  const handleIdeenUpdate = (updatedIdeen: any[]) => {
    setIdeen(updatedIdeen);
  };

  // Beispiel-Handler für BewertungsOptionen
  const handleBewertungsOptionenChange = (field: string, value: any) => {
    if (field === "runde1") setRunde1(value);
    if (field === "runde2") setRunde2(value);
    if (field === "appTester") setAppTester(value);
    if (field === "datenfreigabe") setDatenfreigabe(value);
  };

  // Beispiel-Handler für WeightingSelector
  const handleGewichtungenUpdate = (updatedGewichtungen: any[]) => {
    setGewichtungen(updatedGewichtungen);
  };

  // Beispiel-Handler für KombiInfoModal schließen
  const handleCloseKombiInfoModal = () => {
    setKombiInfoModalOpen(false);
    setKombiInfoPayload(null);
  };

  // Beispiel-Handler für SaveRunSuccess schließen
  const handleCloseSaveRunSuccess = () => {
    setSaveRunSuccessOpen(false);
    setSaveRunMessage("");
    setSaveRunId(undefined);
  };

  // Beispiel-Handler für StatistikForm schließen und Erfolg
  const handleCloseStatistikForm = () => {
    setStatistikFormOpen(false);
  };

  const handleSaveSuccess = (result: { run_id?: string; message: string }) => {
    setSaveRunId(result.run_id);
    setSaveRunMessage(result.message);
    setSaveRunSuccessOpen(true);
  };

  // Beispiel-Handler für StatusToast schließen
  const handleCloseStatusToast = () => {
    setStatusToastOpen(false);
    setStatusToastMessage("");
  };

  return (
    <div className="app-wrapper">
      {/* Sprachumschalter */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginBottom: 16 }}>
        <label htmlFor="lang-select" className="font-semibold">{t("language")}</label>
        <select id="lang-select" value={language} onChange={handleLanguageChange}>
          <option value="de">Deutsch</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <h1>{t("title")}</h1>

      <CollectionSelector
        sammlungTyp="ideen"
        aktuelleSammlungName={aktuelleIdeensammlung}
        //eigeneSammlungen={eigeneIdeensammlungen}
        onSammlungChange={handleIdeenSammlungChange}
        onUpload={handleIdeenUpload}
        templateUrl="/templates/ideen-vorlage.xlsx"
      />

      <IdeenSelector
        ideen={ideen}
        sprache={language as "de" | "en" | "fr"}
        onUpdate={handleIdeenUpdate}
      />

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

      <Ranking
        eintraege={rankingEintraege}
       // sprache={language as "de" | "en" | "fr"}
      />

      <ExportRankingButton eintraege={rankingEintraege} />

      <StatistikForm
        open={statistikFormOpen}
        onClose={handleCloseStatistikForm}
        payload={{
          ideenSammlung: aktuelleIdeensammlung,
          kombiSammlung: "", // TODO: Kombisammlung state ergänzen
          gewaehlteIdeen: ideen.filter(i => i.aktiv).map(i => i.id),
          deaktivierteIdeen: ideen.filter(i => !i.aktiv).map(i => i.id),
          gewichtungen: {}, // TODO: richtiges Mapping ergänzen
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
