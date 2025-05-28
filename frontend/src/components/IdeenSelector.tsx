import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type Idee = {
  id: string;
  aktiv: boolean;
  attribute: Record<string, string | number>;
  [key: string]: any; // für dynamische Sprachspalten wie '#t_de#1', '#t_en#1', etc.
};

type Props = {
  ideen?: Idee[];  // optional für Robustheit
  sprache: "de" | "en" | "fr";
  onUpdate: (updated: Idee[]) => void;
};

export const IdeenSelector: React.FC<Props> = ({
  ideen = [],
  sprache,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    const updated = (ideen || []).map((idee) =>
      idee.id === id ? { ...idee, aktiv: !idee.aktiv } : idee
    );
    onUpdate(updated);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!Array.isArray(ideen) || ideen.length === 0) {
    return <div className="text-gray-500">{t("noIdeasLoaded")}</div>;
  }

  return (
    <div className="space-y-4">
      {(ideen || []).map((idee) => {
        const name =
          typeof idee[`#t_${sprache}#1`] === "string"
            ? idee[`#t_${sprache}#1`]
            : t("noName");
        const beschreibung =
          typeof idee[`#t_${sprache}#2`] === "string"
            ? idee[`#t_${sprache}#2`]
            : t("noDescription");
        const kategorie =
          typeof idee[`#t_${sprache}#3`] === "string"
            ? idee[`#t_${sprache}#3`]
            : t("noCategory");
        const attribute =
          typeof idee.attribute === "object" && idee.attribute
            ? idee.attribute
            : {};

        return (
          <div key={idee.id} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">{name}</h2>
                <p className="text-sm text-gray-700">{beschreibung}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t("category")}: {kategorie}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <label className="text-sm">
                  <input
                    type="checkbox"
                    checked={!!idee.aktiv}
                    onChange={() => toggleActive(idee.id)}
                    className="mr-1"
                  />
                  {t("active")}
                </label>
                <button
                  onClick={() => toggleExpand(idee.id)}
                  className="text-blue-600 text-sm underline"
                  type="button"
                >
                  {expandedId === idee.id ? t("hideAttributes") : t("showAttributes")}
                </button>
              </div>
            </div>

            {expandedId === idee.id && (
              <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
                <table className="w-full table-auto text-left">
                  <thead>
                    <tr>
                      <th className="pr-4">{t("attribute")}</th>
                      <th>{t("value")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(attribute).length > 0 ? (
                      Object.entries(attribute).map(([key, value]) => (
                        <tr key={key}>
                          <td className="pr-4 text-gray-700">{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={2} className="text-gray-400">
                          {t("noAttributes")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default IdeenSelector;
