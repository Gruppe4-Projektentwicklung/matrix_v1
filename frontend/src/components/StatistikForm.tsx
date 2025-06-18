import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { saveRun } from "../api/saveRun";

export interface BewertungsLaufPayload {
  tester: boolean;
  userData?: {
    alter?: string;
    geschlecht?: string;
    branche?: string;
    berufsrolle?: string;
    [key: string]: any;
  };
  ideenSammlung: string;
  kombiSammlung: string;
  gewaehlteIdeen: string[];
  deaktivierteIdeen: string[];
  gewichtungen: Record<string, number>;
  ergebnisRanking: any[];
  zeitstempel?: string;
}

type Props = {
  open: boolean;
  tester: boolean;
  payload: Omit<BewertungsLaufPayload, "tester" | "userData">;
  onSaveSuccess: (result: { run_id?: string; message: string; error?: string }) => void;
  onClose?: () => void;    // <---- Das ergänzt!
  inline?: boolean;
};

export const StatistikForm: React.FC<Props> = ({
  open,
  tester,
  payload,
  onSaveSuccess,
  onClose,          // <--- und das hier!
  inline = false,
}) => {
  const { t } = useTranslation();

  const [alter, setAlter] = useState("");
  const [geschlecht, setGeschlecht] = useState("");
  const [branche, setBranche] = useState("");
  const [berufsrolle, setBerufsrolle] = useState("");
  const [sending, setSending] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const isValidAge = (value: string) => {
    const num = Number(value);
    return Number.isInteger(num) && num >= 0 && num <= 120;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFehler(null);

    if (!tester && (!alter || !geschlecht || !branche || !berufsrolle)) {
      setFehler(t('fieldsRequired'));
      setSending(false);
      return;
    }
    if (!tester && !isValidAge(alter)) {
      setFehler(t('invalidAge'));
      setSending(false);
      return;
    }

    const fullPayload: BewertungsLaufPayload = {
      ...payload,
      tester,
      userData: tester
        ? undefined
        : {
            alter,
            geschlecht,
            branche,
            berufsrolle,
          },
      zeitstempel: new Date().toISOString(),
    };

    try {
      const result = await saveRun(fullPayload);
      onSaveSuccess(result);
      if (onClose) onClose();    // <--- Callback nach Erfolg, falls übergeben
    } catch (e: any) {
      setFehler(e.message || t("submitError"));
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  if (inline) {
    return (
      <div className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full relative"
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
              aria-label={t("close")}
            >
              ×
            </button>
          )}

          <h2 className="font-bold text-lg mb-2">{t("helpImproveStats")}</h2>
          <p
            className="text-gray-700 text-sm mb-4"
            dangerouslySetInnerHTML={{ __html: t("infoVoluntary") }}
          />
          {!tester && (
            <div className="space-y-2 mb-3">
              <input
                className="border p-2 rounded w-full"
                type="number"
                min="0"
                max="120"
                placeholder={t("age")}
                value={alter}
                onChange={(e) => setAlter(e.target.value)}
              />
              <input
                className="border p-2 rounded w-full"
                type="text"
                placeholder={t("gender")}
                value={geschlecht}
                onChange={(e) => setGeschlecht(e.target.value)}
              />
              <input
                className="border p-2 rounded w-full"
                type="text"
                placeholder={t("industry")}
                value={branche}
                onChange={(e) => setBranche(e.target.value)}
              />
              <input
                className="border p-2 rounded w-full"
                type="text"
                placeholder={t("jobRole")}
                value={berufsrolle}
                onChange={(e) => setBerufsrolle(e.target.value)}
              />
            </div>
          )}

          {fehler && <div className="text-red-600 text-sm mb-2">{fehler}</div>}

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={
                sending ||
                (!tester &&
                  (!alter || !geschlecht || !branche || !berufsrolle || !isValidAge(alter)))
              }
              className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {tester ? t("submitWithoutData") : t("saveRating")}
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                disabled={sending}
                className="bg-gray-200 rounded px-4 py-2"
              >
                {t("cancel")}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full relative"
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
            aria-label={t("close")}
          >
            ×
          </button>
        )}
        <h2 className="font-bold text-lg mb-2">{t("helpImproveStats")}</h2>
        <p
          className="text-gray-700 text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: t("infoVoluntary") }}
        />

        {!tester && (
          <div className="space-y-2 mb-3">
            <input
              className="border p-2 rounded w-full"
              type="number"
              min="0"
              max="120"
              placeholder={t("age")}
              value={alter}
              onChange={(e) => setAlter(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full"
              type="text"
              placeholder={t("gender")}
              value={geschlecht}
              onChange={(e) => setGeschlecht(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full"
              type="text"
              placeholder={t("industry")}
              value={branche}
              onChange={(e) => setBranche(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full"
              type="text"
              placeholder={t("jobRole")}
              value={berufsrolle}
              onChange={(e) => setBerufsrolle(e.target.value)}
            />
          </div>
        )}

        {fehler && <div className="text-red-600 text-sm mb-2">{fehler}</div>}

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={
              sending ||
              (!tester &&
                (!alter || !geschlecht || !branche || !berufsrolle || !isValidAge(alter)))
            }
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {tester ? t("submitWithoutData") : t("saveRating")}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="bg-gray-200 rounded px-4 py-2"
            >
              {t("cancel")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// KEIN weiteres export default – das ist hier nicht mehr nötig!
