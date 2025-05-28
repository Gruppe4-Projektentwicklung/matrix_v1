import React, { useState } from "react";

type RankingEintrag = {
  id: string;
  name: string;
  score: number;
  beschreibung?: string;
  details?: Record<string, any>; // z.B. Attribut-Kombiwertungen
};

type Props = {
  eintraege?: RankingEintrag[]; // optional für Robustheit!
  sprache: "de" | "en" | "fr";
};

export const Ranking: React.FC<Props> = ({ eintraege = [], sprache }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  // Robust: Fallback auf leeres Array, sortiere nur wenn Array vorhanden
  const sorted = Array.isArray(eintraege)
    ? [...eintraege].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    : [];

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-3">
      <h2 className="text-xl font-bold mb-2">Ranking der Ideen</h2>
      <div className="bg-gray-100 rounded-t-lg grid grid-cols-12 px-4 py-2 font-semibold">
        <div className="col-span-1">Platz</div>
        <div className="col-span-4">Name</div>
        <div className="col-span-2 text-right">Score</div>
        <div className="col-span-2 text-center">Info</div>
        <div className="col-span-3"></div>
      </div>
      {sorted.length === 0 && (
        <div className="text-gray-500 px-4 py-2 bg-white border-b rounded-b-lg">
          Keine Ergebnisse vorhanden.
        </div>
      )}
      {sorted.map((eintrag, idx) => (
        <React.Fragment key={eintrag.id}>
          <div
            className={`grid grid-cols-12 px-4 py-2 items-center bg-white border-b ${idx === 0 ? "rounded-t-lg" : ""}`}
          >
            <div className="col-span-1 font-bold">{idx + 1}.</div>
            <div className="col-span-4 font-semibold">{eintrag.name || "Kein Name"}</div>
            <div className="col-span-2 text-right">
              {typeof eintrag.score === "number" ? eintrag.score.toFixed(2) : "–"}
            </div>
            <div className="col-span-2 text-center">
              <button
                className="text-blue-600 hover:underline"
                title="Ideenbeschreibung anzeigen"
                onClick={() => setOpenId(openId === eintrag.id ? null : eintrag.id)}
                type="button"
              >
                i
              </button>
            </div>
            <div className="col-span-3 text-right">
              {eintrag.details && (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setOpenId(openId === eintrag.id ? null : eintrag.id)}
                  type="button"
                >
                  Details
                </button>
              )}
            </div>
          </div>
          {/* Beschreibung und Details ausklappbar */}
          {openId === eintrag.id && (
            <div className="col-span-12 bg-blue-50 rounded-b p-3 mt-2" style={{ gridColumn: "1 / -1" }}>
              {eintrag.beschreibung && (
                <div className="mb-2">
                  <b>Beschreibung:</b> {eintrag.beschreibung}
                </div>
              )}
              {eintrag.details && typeof eintrag.details === "object" && (
                <div>
                  <b>Kombinationswerte:</b>
                  <table className="mt-2 w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left pr-3">Kombination</th>
                        <th className="text-left">Wert</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(eintrag.details).length > 0 ? (
                        Object.entries(eintrag.details).map(([kombi, wert]) => (
                          <tr key={kombi}>
                            <td className="pr-3">{kombi}</td>
                            <td>{wert}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={2} className="text-gray-400">Keine Details vorhanden</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Ranking;
