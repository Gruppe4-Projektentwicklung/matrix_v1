import React, { useState, useEffect, useRef } from "react";
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
  const { t } = useTranslation();
  const [auswahl, setAuswahl] = useState<string>(aktuelleSammlungName);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [eigeneSammlungenState, setEigeneSammlungen] = useState<string[]>(eigeneSammlungen);
  const sessionId = getSessionId();

  const backendUrl = import.meta.env.VITE_API_URL;

  const sammlungListe = eigeneSammlungenState;

  useEffect(() => {
    setAuswahl(aktuelleSammlungName);
  }, [aktuelleSammlungName]);

  useEffect(() => {
    onSammlungChange(auswahl);
  }, [auswahl, onSammlungChange]);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`${backendUrl}/api/selection/ideen?session=${sessionId}`)
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

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

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

    const uploadUrl = `${backendUrl}/upload/ideen`;

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
          // Strukturfehler
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
        <button
          type="button"
          onClick={handleUploadButtonClick}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {t("uploadFile")}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx"
          onChange={handleUpload}
          className="hidden"
          key={fileKey}
        />
        <button
          type="button"
          onClick={() => window.open(`${backendUrl}/download_template?type=ideen`, '_blank')}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          {t("downloadIdeaTemplate")}
        </button>
      </div>
      {uploadError && (
        <pre className="text-red-600 mt-1 whitespace-pre-wrap">{uploadError}</pre>
      )}
    </div>
  );
};

export default CollectionSelectorIdeas;
