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
  const headers = ["rank", "id", "name", "score", "description"];
  const allKombiKeys = Array.from(
    new Set(
      eintraege.flatMap(e =>
        e.details ? Object.keys(e.details) : []
      )
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

  const csv = [
    allHeaders.map(h => h === "rank" ? t("rank") :
                     h === "id" ? "ID" :
                     h === "name" ? t("name") :
                     h === "score" ? t("score") :
                     h === "description" ? t("description") : h).join(";"),
    ...rows.map(row => row.join(";"))
  ].join("\r\n");
  return csv;
}

export const ExportRankingButton: React.FC<Props> = ({ eintraege, fileName = "ranking.csv" }) => {
  const { t } = useTranslation();

  const handleExport = () => {
    const csv = toCSV(eintraege);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
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
