import React, { useState } from "react";

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

const defaultAttrTable = <tr><td colSpan={2} className="text-gray-400">Keine Attribute vorhanden</td></tr>;

export const IdeenSelector: React.FC<Props> = ({
  ideen = [],
  sprache,
  onUpdate,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    const updated = ideen.map((idee) =>
      idee.id === id ? { ...idee, aktiv: !idee.aktiv } : idee
    );
    onUpdate(updated);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!Array.isArray(ideen) || ideen.length === 0) {
    return <div className="text-gray-500">Keine Ideen geladen.</div>;
  }

  return (
    <div className="space-y-4">
      {ideen.map((idee) => {
        const name =
          typeof idee[`#t_${sprache}#1`] === "string"
            ? idee[`#t_${sprache}#1`]
            : "Kein Name";
        const beschreibung =
          typeof idee[`#t_${sprache}#2`] === "string"
            ? idee[`#t_${sprache}#2`]
            : "Keine Beschreibung";
        const kategorie =
          typeof idee[`#t_${sprache}#3`] === "string"
            ? idee[`#t_${sprache}#3`]
            : "Keine Kategorie";
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
                <p className="text-xs text-gray-500 mt-1">Kategorie: {kategorie}</p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                <label className="text-sm">
                  <input
                    type="checkbox"
                    checked={!!idee.aktiv}
                    onChange={() => toggleActive(idee.id)}
                    className="mr-1"
                  />
                  Aktiv
                </label>
                <button
                  onClick={() => toggleExpand(idee.id)}
                  className="text-blue-600 text-sm underline"
                  type="button"
                >
                  {expandedId === idee.id
                    ? "Attribute ausblenden"
                    : "Attribute anzeigen"}
                </button>
              </div>
            </div>

            {expandedId === idee.id && (
              <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
                <table className="w-full table-auto text-left">
                  <thead>
                    <tr>
                      <th className="pr-4">Attribut</th>
                      <th>Wert</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(attribute).length > 0
                      ? Object.entries(attribute).map(([key, value]) => (
                          <tr key={key}>
                            <
