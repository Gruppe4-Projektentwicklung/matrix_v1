import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSessionId } from "@/utils/session";

type Props = {
  aktuelleSammlungName: string;
  eigeneSammlungen?: string[];
  onSammlungChange?: (dateiName: string) => void;
  onUpload?: (file: File) => void;
};

export const CollectionSelectorKombis: React.FC<Props> = ({
  aktuelleSammlungName,
  eigeneSammlungen = [],
  onSammlungChange = () => {},
  onUpload = () => {},
}) => {
  const { t } = useTranslation();
  const [auswahl, setAuswahl] = useState<string>(aktuelleSammlungName);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<number>(0);
  const [eigeneSammlungenState, setEigeneSammlungen] = useState<string[]>(eigeneSammlungen);
  const sessionId = getSessionId();

  const backendUrl = import.meta.env.VITE_API_URL;

  // sammlungListe ist die kombinierte Liste aller verfügbaren Dateien (global + Session)
  const sammlungListe = eigeneSammlungenState;

  useEffect(() => {
    setAuswahl(aktuelleSammlungName);
  }, [aktuelleSammlungName]);

  useEffect(() => {
    onSammlungChange(auswahl);
  }, [auswahl, onSammlungChange]);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`${backendUrl}/api/selection/kombis?session=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.files && data.files.length > 0) {
          setEigeneSammlungen(data.files);
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
    formData.append("session", sessionId);

    const uploadUrl = `${backendUrl}/upload/kombis`;

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
          setUploadError(t("uploadError") || "Upload fehlgeschlagen");
          setFileKey((k) => k + 1);
          return;
        }
        if (!res.ok) {
          let meldung = "";
          // Spezialfall: Strukturfehler
          if (result.error === "uploadnotvalid") {
            meldung = t("uploadnotvalid");
            if (result.validation_errors && result.validation_errors.length) {
              meldung += "\n" + result.validation_errors.map((err: string) => `• ${err}`).join("\n");
            }
          } else {
            // Allgemeiner Fehler
            meldung = t("uploadError") || "Upload fehlgeschlagen";
            if (result.error && typeof result.error === "string") {
              meldung += ": " + result.error;
            }
          }
          setUploadError(meldung.trim());
          setFileKey((k) => k + 1);
          return;
        }

        setEigeneSammlungen((prev) =>
          prev.includes(result.filename) ? prev : [...prev, result.filename]
        );
        setAuswahl(result.filename);
      })
      .catch((err) => {
        setUploadError(t("uploadError") || "Upload fehlgeschlagen");
      });

    setFileKey((k) => k + 1);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{t("selectCombinationCollection")}</label>
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
          href={`${backendUrl}/download_template?type=kombi`}
          download
          className="text-blue-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          {t("downloadCombinationTemplate")}
        </a>
      </div>
      {uploadError && (
        <pre className="text-red-600 mt-1 whitespace-pre-wrap">{uploadError}</pre>
      )}
    </div>
  );
};

export default CollectionSelectorKombis;
