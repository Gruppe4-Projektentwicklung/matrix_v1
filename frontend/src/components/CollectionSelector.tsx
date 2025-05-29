import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSessionId } from "@/utils/session";

type Props = {
  sammlungTyp: "ideen" | "kombis";
  aktuelleSammlungName: string;
  eigeneSammlungen?: string[];
  onSammlungChange?: (dateiName: string) => void;
  onUpload?: (file: File) => void;
  templateUrl: string;
};

export const CollectionSelector: React.FC<Props> = ({
  sammlungTyp,
  aktuelleSammlungName,
  eigeneSammlungen = [],
  onSammlungChange = () => {},
  onUpload = () => {},
  templateUrl,
}) => {
  const { t } = useTranslation();

  const [auswahl, setAuswahl] = useState<string>(aktuelleSammlungName);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<number>(0);
  const [eigeneSammlungenState, setEigeneSammlungen] = useState<string[]>(eigeneSammlungen);
  const sessionId = getSessionId();

  // Kombinierte Liste aus aktueller Sammlung und eigenen Uploads
  const sammlungListe = Array.from(
    new Set([aktuelleSammlungName, ...eigeneSammlungenState])
  );

  useEffect(() => {
    setAuswahl(aktuelleSammlungName);
  }, [aktuelleSammlungName]);

  useEffect(() => {
    onSammlungChange(auswahl);
  }, [auswahl, onSammlungChange]);

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/session_files?session=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        const relevant = sammlungTyp === "ideen" ? data.ideen : data.kombis;
        if (relevant && relevant.length > 0) {
          const uniqueList = Array.from(new Set([...eigeneSammlungen, ...relevant]));
          setEigeneSammlungen(uniqueList);
        }
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Dateiliste:", err);
      });
  }, [sessionId, sammlungTyp]);

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
    const uploadUrl = `/upload/${sammlungTyp}?session=${sessionId}`;

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

        console.log("Upload erfolgreich:", result);
        setEigeneSammlungen((prev) =>
          prev.includes(result.filename) ? prev : [...prev, result.filename]
        );
        setAuswahl(result.filename);
      })
      .catch((err) => {
        console.error("Upload fehlgeschlagen:", err);
        setUploadError(err.message || "Upload fehlgeschlagen");
      });

    setFileKey((k) => k + 1);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">
        {sammlungTyp === "ideen"
          ? t("selectIdeaCollection")
          : t("selectCombinationCollection")}
      </label>

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
		  href={`/download/template/${sammlungTyp}`}
		  download
		  className="text-blue-600 underline"
		  target="_blank"
		  rel="noreferrer"
			>
		  {t("downloadTemplate")}
		</a>
      </div>

      {uploadError && <p className="text-red-600 mt-1">{uploadError}</p>}
    </div>
  );
};

export default CollectionSelector;
