import React, { useState, useEffect, useCallback } from "react";

import "./App.css";
import "./i18n";

import { useTranslation } from "react-i18next";

import { Routes, Route, useLocation } from "react-router-dom";

import { StartPage } from "./pages/StartPage";
import { SelectDataPage } from "./pages/SelectDataPage";
import { IdeaSelectionPage } from "./pages/IdeaSelectionPage";
import { CombinationSelectionPage } from "./pages/CombinationSelectionPage";
import { PersonalDataPage } from "./pages/PersonalDataPage";
import type { UserData } from "./api/saveRun";
import { ConfigSummaryPage } from "./pages/ConfigSummaryPage";
import { CalcResultsPage } from "./pages/CalcResultsPage";
import { ImpressumPage } from "./pages/ImpressumPage";

// import { KombiInfoModal } from "./components/KombiInfoModal"; // ← entfernt, da ungenutzt
import { StatusToast } from "./components/StatusToast";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { SelectChangeEvent } from "@mui/material/Select";
import { getSessionId, setPageStatus, clearSession, resetSessionId } from "./utils/session";
import { devConfig } from "./devConfig";
import { DevStatusBar } from "./components/DevStatusBar";
import { Footer } from "./components/Footer";
import { calculateRanking } from "./api/calculateRanking";

function App() {
  const location = useLocation();
  const sessionId = getSessionId();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language || (import.meta.env.VITE_DEFAULT_LANGUAGE || "en"),
  );

  const [ideen, setIdeen] = useState<any[]>([]);
  const [attributeMeta, setAttributeMeta] = useState<Record<string, {name: string; unit: string; description?: string}>>({});
  const [runde1, setRunde1] = useState(true);
  const [runde2, setRunde2] = useState(true);
  const [appTester, setAppTester] = useState(false);
  const [datenfreigabe, setDatenfreigabe] = useState<"offen" | "anonym" | "keine">("offen");
  const [showRoundOptions, setShowRoundOptions] = useState(true);
  const [showTesterOption, setShowTesterOption] = useState(true);
  const [loadingScreenDuration, setLoadingScreenDuration] = useState(0.8);
  const [gewichtungen, setGewichtungen] = useState<any[]>([]);
  const [rankingEintraege, setRankingEintraege] = useState<any[]>([]);
  const [userData, setUserData] = useState<UserData | undefined>(undefined);
  /* const [kombiInfoModalOpen, setKombiInfoModalOpen] = useState(false);
  const [kombiInfoPayload, setKombiInfoPayload] = useState<any>(null); */
  const [dev2Mode, setDev2Mode] = useState(
    sessionStorage.getItem('dev2mode') === 'true'
  );
  const [statusToastOpen, setStatusToastOpen] = useState(false);
  const [statusToastMessage, setStatusToastMessage] = useState("");
  const [statusToastType, setStatusToastType] = useState<"success" | "error" | "info">("info");

  // Default file names should mirror the backend configuration
  // (see backend/matrixconfig.ini -> default_ideen / default_kombi)
  const [aktuelleIdeensammlung, setAktuelleIdeensammlung] = useState("standard_ideen.xlsx");
  const [aktuelleKombiSammlung, setAktuelleKombiSammlung] = useState("CW25_combi_list.xlsx");

  // Backend-Feature-Flags laden
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/features`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.show_round_options === "boolean") {
          setShowRoundOptions(data.show_round_options);
        }
        if (typeof data.show_tester_checkbox === "boolean") {
          setShowTesterOption(data.show_tester_checkbox);
        }
        if (typeof data.loadingscreen_duration === "number") {
          setLoadingScreenDuration(data.loadingscreen_duration);
        }
      })
      .catch((err) => {
        console.error("Fehler beim Laden der Features", err);
      });
  }, []);

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
          `${t("loadError")}: ${err instanceof Error ? err.message : String(err)}`,
        );
        setStatusToastType("error");
        setStatusToastOpen(true);
        return null;
      }
    },
    [sessionId, t],
  );

  const fetchAttributeDescriptions = useCallback(
    async (lang: string) => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/attribute_descriptions?lang=${lang}`;
        const response = await fetch(url);
        if (!response.ok) return {};
        const data = await response.json();
        return (data.attributes as Record<string, { name: string; description: string }>) || {};
      } catch (err) {
        console.error('Failed to load attribute descriptions', err);
        return {};
      }
    },
    []
  );

  const loadIdeen = useCallback(
    async (filename: string) => {
      // Clear previous ideas to avoid flicker while loading new data
      setIdeen([]);
      const data = await fetchCollectionContent("ideen", filename);
      if (!data) return;
      const rows = Array.isArray(data.rows) ? data.rows : [];
      const columns: string[] = Array.isArray(data.columns) ? data.columns : [];
      const columnNames: string[] = Array.isArray(data.column_names) ? data.column_names : [];

      const meta: Record<string, { name: string; unit: string; description?: string }> = {};
      columns.forEach((id, idx) => {
        if (id.startsWith("#-#")) {
          const num = id.slice(3);
          const unitId = `#+#${num}`;
          const unit = columnNames[columns.indexOf(unitId)] || "";
          meta[id] = { name: columnNames[idx] || id, unit };
        }
      });
      const descData = await fetchAttributeDescriptions(language);
      Object.entries(descData).forEach(([id, d]) => {
        if (meta[id]) {
          meta[id].name = d.name || meta[id].name;
          meta[id].description = d.description;
        } else {
          meta[id] = { name: d.name, unit: '', description: d.description };
        }
      });
      setAttributeMeta(meta);

      const parsed = rows.map((row: any, idx: number) => {
        const attrs: Record<string, any> = {};
        Object.keys(row).forEach((k) => {
          if (k.startsWith("#-#")) attrs[k] = row[k];
        });
        const rowId = row.ID || row.id || row["#ID#"] || String(idx + 1);
        return { id: rowId, aktiv: true, attribute: attrs, ...row };
      });
      setIdeen(parsed);
    },
    [fetchCollectionContent, fetchAttributeDescriptions, language],
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
        gewichtung: 3,
        aktiv: true,
        ...row,
      }));
      setGewichtungen(parsed);
    },
    [fetchCollectionContent],
  );


  const handleLanguageChange = (event: SelectChangeEvent) => {
    const lang = event.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleHeaderReset = () => {
    if (!window.confirm(t('resetWarning'))) return;
    clearSession();
    resetSessionId();
    window.location.href = '/';
  };

  const handleIdeenSammlungChange = useCallback(
    (dateiName: string) => {
      setAktuelleIdeensammlung(dateiName);
      loadIdeen(dateiName);
    },
    [loadIdeen],
  );
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

  const handleKombiSammlungChange = useCallback(
    (dateiName: string) => {
      setAktuelleKombiSammlung(dateiName);
      loadKombis(dateiName);
    },
    [loadKombis],
  );

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


  const handleUserDataSaved = (data: UserData | undefined) => {
    setUserData(data);
  };

  const handleCloseStatusToast = () => {
    setStatusToastOpen(false);
    setStatusToastMessage("");
  };


  const handleCalculateRanking = async () => {
    try {
      const gew: Record<string, number> = {};
      gewichtungen.forEach((k: any) => {
        gew[k.id] = Number(k.gewichtung || 0);
      });

      const result = await calculateRanking({
        session: sessionId,
        ideen_file: aktuelleIdeensammlung,
        kombi_file: aktuelleKombiSammlung,
        ideen_ids: ideen.filter((i) => i.aktiv).map((i) => i.id),
        gewichtungen: gew,
        lang: language,
      });
      setRankingEintraege(result);
    } catch (err) {
      console.error(err);
      setStatusToastMessage(
        `${t('loadError')}: ${err instanceof Error ? err.message : String(err)}`,
      );
      setStatusToastType('error');
      setStatusToastOpen(true);
    }
  };

  // Entfernt: useEffect mit setSaveRunSuccessOpen

  useEffect(() => {
    loadIdeen(aktuelleIdeensammlung);
    loadKombis(aktuelleKombiSammlung);
  }, [loadIdeen, loadKombis]);

  return (
    <div className="min-h-screen w-full bg-gray-200 text-gray-900 font-inter flex flex-col items-center pb-10">
    <AppBar position="sticky" color="primary" sx={{ mb: 2 }}>
  <Toolbar
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      gap: 2,
    }}
  >
    {/* Linke Seite */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography
        variant="caption"
        sx={{ bgcolor: 'primary.light', px: 1, py: 0.5, borderRadius: 1 }}
      >
        Session ID: {sessionId}
      </Typography>
      {location.pathname === '/' && devConfig.dataSaveStatus === 'on' && (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={dev2Mode}
              onChange={(e) => setDev2Mode(e.target.checked)}
              color="default"
            />
          }
          label={<Typography variant="caption">Dev2 mode</Typography>}
        />
      )}
    </Box>
    {/* Mitte */}
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <img
        src="/Logo.png"
        alt={t('appName')}
        style={{ height: 42, cursor: 'pointer', borderRadius: 8 }}
        onClick={handleHeaderReset}
      />
      <Typography
        variant="h6"
        sx={{ color: '#fff', textTransform: 'uppercase', cursor: 'pointer' }}
        onClick={handleHeaderReset}
      >
        {t('appName')}
      </Typography>
    </Box>

    {/* Rechte Seite */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Select
        id="lang-select"
        size="small"
        value={language}
        onChange={handleLanguageChange}
        sx={{ bgcolor: 'background.paper', minWidth: 80 }}
      >
        <MenuItem value="de">Deutsch</MenuItem>
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
      </Select>
    </Box>
  </Toolbar>
</AppBar>


      {dev2Mode && devConfig.dataSaveStatus === 'on' && <DevStatusBar />}

      <Container sx={{ flexGrow: 1, bgcolor: 'background.paper', py: 2 }} maxWidth="lg">
        <Routes>
          <Route
            path="/"
            element={
              <StartPage
                dev2Mode={dev2Mode}
                onStart={(v) => {
                  setDev2Mode(v);
                  sessionStorage.setItem('dev2mode', v ? 'true' : 'false');
                }}
              />
            }
          />
          <Route
            path="/select-data"
            element={(
              <SelectDataPage
                aktuelleIdeensammlung={aktuelleIdeensammlung}
                aktuelleKombiSammlung={aktuelleKombiSammlung}
                onIdeenSammlungChange={handleIdeenSammlungChange}
                onKombiSammlungChange={handleKombiSammlungChange}
                onIdeenUpload={(file) => handleIdeenUpload(file, sessionId)}
                onKombiUpload={(file) => handleKombiUpload(file, sessionId)}
              />
            )}
          />
          <Route
            path="/ideas"
            element={(
              <IdeaSelectionPage
                ideen={ideen}
                sprache={language as "de" | "en" | "fr"}
                attributeMeta={attributeMeta}
                onIdeenUpdate={handleIdeenUpdate}
              />
            )}
          />
          <Route
            path="/combinations"
            element={(
              <CombinationSelectionPage
                gewichtungen={gewichtungen}
                runde1={runde1}
                runde2={runde2}
                appTester={appTester}
                datenfreigabe={datenfreigabe}
                showRoundOptions={showRoundOptions}
                showTesterOption={showTesterOption}
                onGewichtungenUpdate={handleGewichtungenUpdate}
                onOptionsChange={handleBewertungsOptionenChange}
              />
            )}
          />
          <Route
            path="/personal"
            element={(
              <PersonalDataPage
                tester={appTester}
                payload={{
                  ideenSammlung: aktuelleIdeensammlung,
                  kombiSammlung: aktuelleKombiSammlung,
                  gewaehlteIdeen: ideen.filter((i) => i.aktiv).map((i) => i.id),
                  deaktivierteIdeen: ideen.filter((i) => !i.aktiv).map((i) => i.id),
                  gewichtungen: {},
                  ergebnisRanking: [],
                  lang: language,
                }}
                onUserDataSaved={handleUserDataSaved}
              />
            )}
          />
          <Route
            path="/summary"
            element={(
              <ConfigSummaryPage
                ideenCount={ideen.length}
                activeIdeen={ideen.filter((i) => i.aktiv).length}
                kombiCount={gewichtungen.length}
                activeKombis={gewichtungen.filter((k) => k.aktiv).length}
                loadingDuration={loadingScreenDuration}
                ideenSammlung={aktuelleIdeensammlung}
                kombiSammlung={aktuelleKombiSammlung}
                userData={userData}
                onCalculate={handleCalculateRanking}
              />
            )}
          />
          <Route
            path="/results"
            element={(
              <CalcResultsPage
                rankingEintraege={rankingEintraege}
                kombinationen={gewichtungen}
              />
            )}
          />
          <Route path="/impressum" element={<ImpressumPage />} />
        </Routes>

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
      </Container>
      <Footer />
    </div>
  );

}
export default App;
