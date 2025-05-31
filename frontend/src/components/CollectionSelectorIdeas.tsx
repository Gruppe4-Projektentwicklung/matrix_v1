// src/components/CollectionSelectorIdeas.tsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSessionId } from "@/utils/session";

type Props = {
  aktuelleSammlungName: string;
  eigeneSammlungen?: string[];
  onSammlungChange?: (dateiName: string) => void;
  onUpload?: (file: File) => void;
};

export const CollectionSelectorIdeas: React.FC<Props> = ({
  aktuelleSammlungName,
  eigeneSammlungen = [],
  onSammlungChange = () => {},
  onUpload = () => {},
}) => {
  const { t, i18n } = useTranslation();
  const [auswahl, setAuswahl] = useState<string>(aktuelleSammlungName);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<number>(0);
  const [eigeneSammlungenState, setEigeneSammlungen] = useState<string[]>(eigeneSammlungen);
  const sessionId = getSessionId();

  // sammlungListe ist jetzt die Liste aller verfügbaren Dateien (global + user)
  const sammlungListe = eigeneSammlungenState;

  // Sync Auswahl mit Prop
  useEffect(() => {
    setAuswahl(aktuelleSammlungName);
  }, [aktuelleSammlungName]);

  // Wenn Auswahl sich ändert, Callback feuern
  useEffect(() => {
    onSammlungChange(auswahl);
  }, [auswahl, onSammlungChange]);

  // Dateien aus Backend laden: globale + Session-Dateien
  useEffect(() => {
    if (!sessionId) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/selection/ideen?session=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.files && data.files.length > 0) {
          setEigeneSammlungen(data.files);
          // Falls aktuelle Auswahl nicht mehr in der Liste ist, wähle Default vom Backend oder erstes Element
          if (!data.files.includes(auswahl)) {
            const neueAuswahl = data.default || data.files[0];
            setAuswahl(neueAuswahl);
            onSammlungChange(neueAuswahl);
          }
        }
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Dateiliste:", err);
      });
  }, [sessionId]);

  // Datei-Upload Handler
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  setUploadError(null);
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  if (!file.name.endsWith(".xlsx")) {
    setUploadError(t("uploadErrorInvalidFile"));
    setFileKey((k) => k + 1);
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("session", sessionId); // session im FormData senden

  const uploadUrl = `${import.meta.env.VITE_API_URL}/upload/ideen`; // ohne session in URL

  fetch(uploadUrl, {
    method: "POST",
    body: formData,
  })
      .then(async (res) => {
        const text = await res.text();
        let result: any = {};
        try {
          result = JSON.parse(text);
        } catch (e) {
          throw new Error("Ungültige Serverantwort");
        }

        if (!res.ok) {
          throw new Error(result?.error || "Upload fehlgeschlagen");
        }

        setEigeneSammlungen((prev) =>
          prev.includes(result.filename) ? prev : [...prev, result.filename]
        );
        setAuswahl(result.filename);
      })
      .catch((err) => {
        setUploadError(err.message || "Upload fehlgeschlagen");
      });

    setFileKey((k) => k + 1);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{t("selectCollection")}</label>
      <select
        className="border p-2 rounded w-full max-w-xs"
        value={auswahl}
        onChange={(e) => setAuswahl(e.target.value)}
        disabled={sammlungListe.length === 0}
      >
        {sammlungListe.map((datei) => (
          <option key={datei} value={datei}>
            {datei}
          </option>
        ))}
      </select>
      <div className="mt-2 flex items-center space-x-4">
        <label className="cursor-pointer text-blue-600 underline">
          {t("uploadFile")}
          <input
            type="file"
            accept=".xlsx"
            onChange={handleUpload}
            className="hidden"
            key={fileKey}
          />
        </label>
        <a
          href={`${import.meta.env.VITE_API_URL}/download_template?type=ideen`}
          download
          className="text-blue-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          {t("downloadIdeaTemplate")}
        </a>
      </div>
      {uploadError && <p className="text-red-600 mt-1">{uploadError}</p>}
    </div>
  );
};

export default CollectionSelectorIdeas;
