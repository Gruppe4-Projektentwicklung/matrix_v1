import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Combination = {
  id: string;
  name: string;
  beschreibung: string;
  gewichtung: number;
  aktiv: boolean;
};

type Props = {
  kombinationen?: Combination[]; // Optional für Robustheit!
  onUpdate: (updated: Combination[]) => void;
};

export const WeightingSelector: React.FC<Props> = ({
  kombinationen = [],
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const gewichtungLabels = [
    t("disabled"),
    t("notImportantAtAll"),
    t("slightlyImportant"),
    t("neutral"),
    t("important"),
    t("veryImportant"),
  ];

  const handleGewichtungChange = (id: string, value: number) => {
    const updated = (kombinationen || []).map((kombi) =>
      kombi.id === id ? { ...kombi, gewichtung: value, aktiv: value > 0 } : kombi
    );
    onUpdate(updated);
  };

  const toggleInfo = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!Array.isArray(kombinationen) || kombinationen.length === 0) {
    return (
      <div className="text-gray-500">{t("noWeightingCombinationsAvailable")}</div>
    );
  }

  return (
    <div className="space-y-6">
      {(kombinationen || []).map((kombi) => (
        <div key={kombi.id} className="border rounded-xl p-4 shadow-sm bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{kombi.name}</h2>
              {expandedId === kombi.id && (
                <p className="text-sm mt-1 text-gray-700">{kombi.beschreibung}</p>
              )}
            </div>
            <button
              onClick={() => toggleInfo(kombi.id)}
              className="text-blue-600 text-sm underline"
              type="button"
            >
              {expandedId === kombi.id
                ? t("hideDescription")
                : t("showDescription")}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 items-center">
            <label className="cursor-pointer border-r pr-4 mr-4 border-gray-300">
              <input
                type="radio"
                name={kombi.id}
                checked={kombi.gewichtung === 0}
                onChange={() => handleGewichtungChange(kombi.id, 0)}
                className="mr-1"
              />
              {gewichtungLabels[0]}
            </label>

            {gewichtungLabels.slice(1).map((label, i) => (
              <label key={i + 1} className="cursor-pointer">
                <input
                  type="radio"
                  name={kombi.id}
                  checked={kombi.gewichtung === i + 1}
                  onChange={() => handleGewichtungChange(kombi.id, i + 1)}
                  className="mr-1"
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeightingSelector;
