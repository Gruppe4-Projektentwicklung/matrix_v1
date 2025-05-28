import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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

import { saveRun } from "../api/saveRun";

type Props = {
  open: boolean;
  onClose: () => void;
  payload: Omit<BewertungsLaufPayload, "tester" | "userData">;
  onSaveSuccess: (result: { run_id?: string; message: string; error?: string }) => void;
};

export const StatistikForm: React.FC<Props> = ({
  open,
  onClose,
  payload,
  onSaveSuccess,
}) => {
  const { t } = useTranslation();

  const [alter, setAlter] = useState("");
  const [geschlecht, setGeschlecht] = useState("");
  const [branche, setBranche] = useState("");
  const [berufsrolle, setBerufsrolle] = useState("");
  const [tester, setTester] = useState(false);
  const [sending, setSending] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFehler(null);

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
    } catch {
      setFehler(t("submitError"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          aria-label={t("close")}
        >
          ×
        </button>
        <h2 className="font-bold text-lg mb-2">{t("helpImproveStats")}</h2>
        <p
          className="text-gray-700 text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: t("infoVoluntary") }}
        />

        <label className="block mb-2 font-semibold">
          <input
            type="checkbox"
            checked={tester}
            onChange={() => setTester((v) => !v)}
            className="mr-2"
          />
          {t("appTesterMode")}
        </label>

        {!tester && (
          <div className="space-y-2 mb-3">
            <input
              className="border p-2 rounded w-full"
              type="text"
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
            disabled={sending}
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          >
            {tester ? t("submitWithoutData") : t("saveRating")}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="bg-gray-200 rounded px-4 py-2"
          >
            {t("cancel")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatistikForm;
