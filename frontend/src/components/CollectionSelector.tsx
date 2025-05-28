import React, { useState, useEffect } from "react";

type Props = {
  sammlungTyp: "ideen" | "kombis";
  aktuelleSammlungName: string;
  eigeneSammlungen?: string[];
  onSammlungChange?: (dateiName: string) => void; // Optional!
  onUpload?: (file: File) => void;                // Optional!
  templateUrl: string;
};

export const CollectionSelector: React.FC<Props> = ({
  sammlungTyp,
  aktuelleSammlungName,
  eigeneSammlungen = [],
  onSammlungChange = () => {}, // Leerer Fallback
  onUpload = () => {},         // Leerer Fallback
  templateUrl,
}) => {
  const [auswahl, setAuswahl] = useState<string>(aktuelleSammlungName);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileKey, setFileKey] = useState<number>(0);

  useEffect(() => {
    setAuswahl(aktuelleSammlungName);
  }, [aktuelleSammlungName]);

  useEffect(() => {
    onSammlungChange(auswahl);
  }, [auswahl, onSammlungChange]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith(".xlsx")) {
      setUploadError("Bitte eine Excel-Datei (.xlsx) hochladen.");
      setFileKey((k) => k + 1);
      return;
    }
    onUpload(file);
    setFileKey((k) => k + 1);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">
        {sammlungTyp === "ideen"
          ? "Ideensammlung auswählen"
          : "Kombinationssammlung auswählen"}
      </label>

      <select
        className="border p-2 rounded w-full max-w-xs"
        value={auswahl}
        onChange={(e) => setAuswahl(e.target.value)}
        disabled={eigeneSammlungen.length === 0 && !aktuelleSammlungName}
      >
        <option value={aktuelleSammlungName}>
          {sammlungTyp === "ideen"
            ? "Aktuelle Ideensammlung"
            : "Aktuelle Kombinationssammlung"}
        </option>
        {(eigeneSammlungen || []).map((datei) => (
          <option key={datei} value={datei}>
            {datei}
          </option>
        ))}
      </select>

      <div className="mt-2 flex items-center space-x-4">
        <label className="cursor-pointer text-blue-600 underline">
          Datei hochladen
          <input
            type="file"
            accept=".xlsx"
            onChange={handleUpload}
            className="hidden"
            key={fileKey}
          />
        </label>
        <a
          href={templateUrl}
          download
          className="text-blue-600 underline"
          target="_blank"
          rel="noreferrer"
        >
          Vorlage herunterladen
        </a>
      </div>

      {uploadError && (
        <p className="text-red-600 mt-1">{uploadError}</p>
      )}
    </div>
  );
};

export default CollectionSelector;
