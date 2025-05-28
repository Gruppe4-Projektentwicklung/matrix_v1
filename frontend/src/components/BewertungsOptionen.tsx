import React from "react";
import { useTranslation } from "react-i18next";

type BewertungsOptionenProps = {
  runde1: boolean;
  runde2: boolean;
  appTester: boolean;
  datenfreigabe: "offen" | "anonym" | "keine";
  onChange: (field: string, value: any) => void;
};

export const BewertungsOptionen: React.FC<BewertungsOptionenProps> = ({
  runde1,
  runde2,
  appTester,
  datenfreigabe,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="border rounded-xl p-4 space-y-6 bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-center">{t("optionsTitle")}</h2>

      {/* Zentrierte Checkboxen */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-center">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={runde1}
            onChange={(e) => onChange("runde1", e.target.checked)}
            className="accent-[#1d2c5b]"
          />
          {t("optionConsiderRound1")}
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={runde2}
            onChange={(e) => onChange("runde2", e.target.checked)}
            className="accent-[#1d2c5b]"
          />
          {t("optionConsiderRound2")}
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={appTester}
            onChange={(e) => onChange("appTester", e.target.checked)}
            className="accent-[#1d2c5b]"
          />
          {t("optionAppTester")}
        </label>
      </div>

      <div className="mt-2 text-center">
        <label className="block mb-1 font-medium">{t("optionDataRelease")}</label>
        <select
          value={datenfreigabe}
          onChange={(e) => onChange("datenfreigabe", e.target.value)}
          className="border p-2 rounded w-full max-w-xs mx-auto"
        >
          <option value="offen">{t("optionDataReleaseOpen")}</option>
          <option value="anonym">{t("optionDataReleaseAnonym")}</option>
          <option value="keine">{t("optionDataReleaseNone")}</option>
        </select>
      </div>
    </div>
  );
};
