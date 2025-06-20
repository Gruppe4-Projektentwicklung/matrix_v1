import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
          <div
            key={idee.id}
            className={`border rounded-xl p-4 shadow-sm ${
              idee.aktiv ? "bg-white" : "bg-gray-100 text-gray-500"
            }`}
          >
            <div className="grid grid-cols-[auto_auto_1fr_auto] gap-4 items-start">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={!!idee.aktiv}
                  onChange={() => toggleActive(idee.id)}
                  className="mr-1 mt-1"
                />
                <span className="text-sm">
                  {idee.aktiv ? t("active") : t("disabled")}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{kategorie}</div>
              <div>
                <h2 className="font-semibold text-lg">{name}</h2>
                <p className="text-sm text-gray-700 mt-1">{beschreibung}</p>
              </div>
              <div className="flex justify-end">
                <IconButton
                  onClick={() => toggleExpand(idee.id)}
                  color="primary"
                  size="small"
                  aria-label={
                    expandedId === idee.id ? t("hideAttributes") : t("showAttributes")
                  }
                >
                  {expandedId === idee.id ? (
                    <VisibilityOffIcon fontSize="inherit" />
                  ) : (
                    <VisibilityIcon fontSize="inherit" />
                  )}
                </IconButton>
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
