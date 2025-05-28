import React, { useState, useEffect } from "react";

type Props = {
  sammlungTyp: "ideen" | "kombis"; // entscheidet, ob Ideen oder Kombis verwaltet werden
  aktuelleSammlungName: string;
  eigeneSammlungen: string[]; // Dateinamen eigener Uploads
  onSammlungChange: (dateiName: string) => void;
  onUpload: (file: File) => void;
  templateUrl: string;
};

export const CollectionSelector: React.FC<Props> = ({
  sammlungTyp,
  aktuelleSammlungName,
  eigeneSammlungen,
  onSammlungChange,
  onUpload,
  templateUrl,
}) => {
  const [auswahl, setAuswahl] = useState<string>(aktuelleSammlungName);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Wenn sich Auswahl ändert, callback triggern
    onSammlungChange(auswahl);
  }, [auswahl, onSammlungChange]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Optional: hier Dateityp/Name prüfen
    if (!file.name.endsWith(".xlsx")) {
      setUploadError("Bitte eine Excel-Datei (.xlsx) hochladen.");
      return;
    }
    onUpload(file);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">
        {sammlungTyp === "ideen" ? "Ideensammlung auswählen" : "Kombinationssammlung auswählen"}
      </label>

      <select
        className="border p-2 rounded w-full max-w-xs"
        value={auswahl}
        onChange={(e) => setAuswahl(e.target.value)}
      >
        <option value={aktuelleSammlungName}>
          {sammlungTyp === "ideen" ? "Aktuelle Ideensammlung" : "Aktuelle Kombinationssammlung"}
        </option>
        {eigeneSammlungen.map((datei) => (
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
            key={eigeneSammlungen.length} // reset input nach Upload
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

      {uploadError && <p className="text-red-600 mt-1">{uploadError}</p>}
    </div>
  );
};
