import React from "react";
import { useTranslation } from "react-i18next";

type RankingEintrag = {
  id: string;
  name: string;
  score: number;
  beschreibung?: string;
  details?: Record<string, any>;
};

type Props = {
  eintraege: RankingEintrag[];
  fileName?: string;
};

function toCSV(eintraege: RankingEintrag[]): string {
  const headers = ["Platz", "ID", "Name", "Score", "Beschreibung"];
  const allKombiKeys = Array.from(
    new Set(
      eintraege.flatMap(e => (e.details ? Object.keys(e.details) : []))
    )
  );
  const allHeaders = [...headers, ...allKombiKeys];

  const rows = eintraege.map((eintrag, idx) => [
    (idx + 1).toString(),
    eintrag.id,
    `"${eintrag.name.replace(/"/g, '""')}"`,
    eintrag.score.toFixed(2),
    eintrag.beschreibung ? `"${eintrag.beschreibung.replace(/"/g, '""')}"` : "",
    ...allKombiKeys.map(k => (eintrag.details && eintrag.details[k] !== undefined ? eintrag.details[k] : ""))
  ]);

  return [allHeaders.join(";"), ...rows.map(row => row.join(";"))].join("\r\n");
}

export const ExportRankingButton: React.FC<Props> = ({ eintraege, fileName }) => {
  const { t } = useTranslation();

  const handleExport = () => {
    const csv = toCSV(eintraege);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ?? "ranking.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white rounded px-4 py-2 font-semibold hover:bg-green-700 mt-3"
    >
      {t("exportRankingCSV")}
    </button>
  );
};

export default ExportRankingButton;
