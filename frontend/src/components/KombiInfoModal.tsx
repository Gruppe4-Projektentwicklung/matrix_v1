import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  if (!open || !kombi) return null;

  // Je nach Sprache die passenden Inhalte auswählen (Fallback auf Deutsch)
  const name =
    sprache === "en"
      ? kombi.name_en ?? kombi.name_de
      : sprache === "fr"
      ? kombi.name_fr ?? kombi.name_de
      : kombi.name_de;
  const erklaerung =
    sprache === "en"
      ? kombi.erklaerung_en ?? kombi.erklaerung_de
      : sprache === "fr"
      ? kombi.erklaerung_fr ?? kombi.erklaerung_de
      : kombi.erklaerung_de;
  const formeltext =
    sprache === "en"
      ? kombi.formeltext_en ?? kombi.formeltext_de
      : sprache === "fr"
      ? kombi.formeltext_fr ?? kombi.formeltext_de
      : kombi.formeltext_de;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          onClick={onClose}
          aria-label={t("close")}
        >
          ×
        </button>
        <h2 className="font-bold text-lg mb-3">{name}</h2>
        <div className="mb-2">
          <b>{t("explanation")}:</b> {erklaerung}
        </div>
        {formeltext && (
          <div className="mb-2">
            <b>{t("formula")}:</b> <span className="font-mono">{formeltext}</span>
          </div>
        )}
        {kombi.richtung && (
          <div className="mb-2">
            <b>{t("evaluationDirection")}:</b>{" "}
            <span>
              {kombi.richtung === "high"
                ? t("higherIsBetter")
                : t("lowerIsBetter")}
            </span>
          </div>
        )}
        <button
          className="mt-4 bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          onClick={onClose}
        >
          {t("close")}
        </button>
      </div>
    </div>
  );
};
