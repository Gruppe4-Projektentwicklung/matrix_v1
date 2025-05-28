import React from "react";

type KombiInfo = {
  id: string;
  name_de: string;
  name_en?: string;
  name_fr?: string;
  erklaerung_de: string;
  erklaerung_en?: string;
  erklaerung_fr?: string;
  richtung?: "high" | "low";
  formeltext_de?: string;
  formeltext_en?: string;
  formeltext_fr?: string;
};

type Props = {
  open: boolean;
  kombi: KombiInfo | null;
  sprache: "de" | "en" | "fr";
  onClose: () => void;
};

export const KombiInfoModal: React.FC<Props> = ({ open, kombi, sprache, onClose }) => {
  if (!open || !kombi) return null;

  // Je nach Sprache anzeigen
  const name =
    sprache === "en"
      ? kombi.name_en
      : sprache === "fr"
      ? kombi.name_fr
      : kombi.name_de;
  const erklaerung =
    sprache === "en"
      ? kombi.erklaerung_en
      : sprache === "fr"
      ? kombi.erklaerung_fr
      : kombi.erklaerung_de;
  const formeltext =
    sprache === "en"
      ? kombi.formeltext_en
      : sprache === "fr"
      ? kombi.formeltext_fr
      : kombi.formeltext_de;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
          aria-label="Schließen"
        >
          ×
        </button>
        <h2 className="font-bold text-lg mb-3">{name}</h2>
        <div className="mb-2">
          <b>Erklärung:</b> {erklaerung}
        </div>
        {formeltext && (
          <div className="mb-2">
            <b>Formel:</b> <span className="font-mono">{formeltext}</span>
          </div>
        )}
        {kombi.richtung && (
          <div className="mb-2">
            <b>Bewertungsrichtung:</b>{" "}
            <span>
              {kombi.richtung === "high"
                ? sprache === "en"
                  ? "Higher is better"
                  : sprache === "fr"
                  ? "Plus élevé = mieux"
                  : "Höher ist besser"
                : sprache === "en"
                ? "Lower is better"
                : sprache === "fr"
                ? "Plus bas = mieux"
                : "Niedriger ist besser"}
            </span>
          </div>
        )}
        <button
          className="mt-4 bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          onClick={onClose}
        >
          Schließen
        </button>
      </div>
    </div>
  );
};
