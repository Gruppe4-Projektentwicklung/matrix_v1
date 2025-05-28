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

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
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
      
      <CollectionSelector />
      <IdeenSelector />
      <BewertungsOptionen />
      <WeightingSelector />
      <Ranking />
      <ExportRankingButton />
      <StatistikForm />
      <SaveRunSuccess />
      <KombiInfoModal />
      <StatusToast />

      {/* Weitere Komponenten/Seiten kannst du hier einbauen */}
    </div>
  );
}

export default App;
