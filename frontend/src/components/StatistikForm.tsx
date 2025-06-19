import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { saveRun } from "../api/saveRun";
import pageDescriptions from "../pageDescriptions";
import type { SaveRunResponse, BewertungsLaufPayload, UserData } from "../api/saveRun";


import { setSaveRunStatus } from "../utils/session";

type Props = {
  open: boolean;
  tester: boolean;
  payload: Omit<BewertungsLaufPayload, "tester" | "userData">;
  onSaveSuccess: (result: SaveRunResponse) => void;
  onUserDataSaved?: (data: UserData | undefined) => void;
  onClose?: () => void;
  inline?: boolean;
};

export const StatistikForm: React.FC<Props> = ({
  open,
  tester,
  payload,
  onSaveSuccess,
  onUserDataSaved,
  onClose,
  inline = false,
}) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setSaveRunStatus("idle");
  }, []);

  // store translation keys for select options so the labels can be
  // translated dynamically via i18n
  const industryOptions = [
    "industryConstruction",
    "industryEnergy",
    "industryIT",
    "industryEducation",
    "industryHealthcare",
    "industryRetail",
    "industryTourism",
    "industryFinance",
    "industryManufacturing",
    "industryPublic",
  ];

  const jobRoleOptions = [
    "jobEngineer",
    "jobArchitect",
    "jobManager",
    "jobResearcher",
    "jobStudent",
    "jobDeveloper",
    "jobConsultant",
    "jobSales",
    "jobTeacher",
    "jobDoctor",
  ];

  const [alter, setAlter] = useState("");
  const [geschlecht, setGeschlecht] = useState("");
  const [brancheOption, setBrancheOption] = useState("");
  const [branche, setBranche] = useState("");
  const [berufsrolleOption, setBerufsrolleOption] = useState("");
  const [berufsrolle, setBerufsrolle] = useState("");
  const [sending, setSending] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const isValidAge = (value: string) => {
    const num = Number(value);
    return Number.isInteger(num) && num >= 10 && num <= 120;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFehler(null);
    setSaveRunStatus("sending");

    if (!tester && (!alter || !geschlecht || !branche || !berufsrolle)) {
      setFehler(t("fieldsRequired"));
      setSending(false);
      return;
    }
    if (!tester && !isValidAge(alter)) {
      setFehler(t("invalidAge"));
      setSending(false);
      return;
    }

    const fullPayload: BewertungsLaufPayload = {
      ...payload,
      tester,
      lang: i18n.language,
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
      if (onUserDataSaved) {
        onUserDataSaved(
          tester ? undefined : { alter, geschlecht, branche, berufsrolle }
        );
      }
      setSaveRunStatus("ok");
      if (onClose) onClose();
    } catch (e: any) {
      setFehler(e.message || t("submitError"));
      setSaveRunStatus("error");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  if (tester) {
    const content = (
      <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full text-center">
        <p>{pageDescriptions.personalData.testerMessage}</p>
      </div>
    );
    if (inline) {
      return <div className="flex justify-center">{content}</div>;
    }
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

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

          <h2 className="font-bold text-lg mb-2">{pageDescriptions.personalData.helpTitle}</h2>
          <p
            className="text-gray-700 text-sm mb-4"
            dangerouslySetInnerHTML={{ __html: pageDescriptions.personalData.infoText }}
          />
          {!tester && (
            <div className="space-y-2 mb-3">
              <input
                className="border p-2 rounded w-full"
                type="number"
                min="10"
                max="120"
                placeholder={t("age")}
                value={alter}
                onChange={(e) => setAlter(e.target.value)}
              />
              <select
                className="border p-2 rounded w-full"
                value={geschlecht}
                onChange={(e) => setGeschlecht(e.target.value)}
              >
                <option value="">{t("gender")}</option>
                <option value="male">{t("genderMale")}</option>
                <option value="female">{t("genderFemale")}</option>
                <option value="none">{t("genderNone")}</option>
              </select>
              <select
                className="border p-2 rounded w-full"
                value={brancheOption}
                onChange={(e) => {
                  const val = e.target.value;
                  setBrancheOption(val);
                  if (val !== "other") {
                    setBranche(val);
                  } else {
                    setBranche("");
                  }
                }}
              >
                <option value="">{t("industry")}</option>
                {industryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {t(opt)}
                  </option>
                ))}
                <option value="other">{t("other")}</option>
              </select>
              {brancheOption === "other" && (
                <input
                  className="border p-2 rounded w-full"
                  type="text"
                  placeholder={t("industry")}
                  value={branche}
                  onChange={(e) => setBranche(e.target.value)}
                />
              )}
              <select
                className="border p-2 rounded w-full"
                value={berufsrolleOption}
                onChange={(e) => {
                  const val = e.target.value;
                  setBerufsrolleOption(val);
                  if (val !== "other") {
                    setBerufsrolle(val);
                  } else {
                    setBerufsrolle("");
                  }
                }}
              >
                <option value="">{t("jobRole")}</option>
                {jobRoleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {t(opt)}
                  </option>
                ))}
                <option value="other">{t("other")}</option>
              </select>
              {berufsrolleOption === "other" && (
                <input
                  className="border p-2 rounded w-full"
                  type="text"
                  placeholder={t("jobRole")}
                  value={berufsrolle}
                  onChange={(e) => setBerufsrolle(e.target.value)}
                />
              )}
            </div>
          )}

          {fehler && <div className="text-red-600 text-sm mb-2">{fehler}</div>}

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={
                sending ||
                (!tester &&
                  (!alter ||
                    !geschlecht ||
                    !branche ||
                    !berufsrolle ||
                    !isValidAge(alter)))
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
        <h2 className="font-bold text-lg mb-2">{pageDescriptions.personalData.helpTitle}</h2>
        <p
          className="text-gray-700 text-sm mb-4"
          dangerouslySetInnerHTML={{ __html: pageDescriptions.personalData.infoText }}
        />

        {!tester && (
          <div className="space-y-2 mb-3">
            <input
              className="border p-2 rounded w-full"
              type="number"
              min="10"
              max="120"
              placeholder={t("age")}
              value={alter}
              onChange={(e) => setAlter(e.target.value)}
            />
            <select
              className="border p-2 rounded w-full"
              value={geschlecht}
              onChange={(e) => setGeschlecht(e.target.value)}
            >
              <option value="">{t("gender")}</option>
              <option value="male">{t("genderMale")}</option>
              <option value="female">{t("genderFemale")}</option>
              <option value="none">{t("genderNone")}</option>
            </select>
            <select
              className="border p-2 rounded w-full"
              value={brancheOption}
              onChange={(e) => {
                const val = e.target.value;
                setBrancheOption(val);
                if (val !== "other") {
                  setBranche(val);
                } else {
                  setBranche("");
                }
              }}
            >
              <option value="">{t("industry")}</option>
              {industryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {t(opt)}
                </option>
              ))}
              <option value="other">{t("other")}</option>
            </select>
            {brancheOption === "other" && (
              <input
                className="border p-2 rounded w-full"
                type="text"
                placeholder={t("industry")}
                value={branche}
                onChange={(e) => setBranche(e.target.value)}
              />
            )}
            <select
              className="border p-2 rounded w-full"
              value={berufsrolleOption}
              onChange={(e) => {
                const val = e.target.value;
                setBerufsrolleOption(val);
                if (val !== "other") {
                  setBerufsrolle(val);
                } else {
                  setBerufsrolle("");
                }
              }}
            >
              <option value="">{t("jobRole")}</option>
              {jobRoleOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {t(opt)}
                </option>
              ))}
              <option value="other">{t("other")}</option>
            </select>
            {berufsrolleOption === "other" && (
              <input
                className="border p-2 rounded w-full"
                type="text"
                placeholder={t("jobRole")}
                value={berufsrolle}
                onChange={(e) => setBerufsrolle(e.target.value)}
              />
            )}
          </div>
        )}

        {fehler && <div className="text-red-600 text-sm mb-2">{fehler}</div>}

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={
              sending ||
              (!tester &&
                (!alter ||
                  !geschlecht ||
                  !branche ||
                  !berufsrolle ||
                  !isValidAge(alter)))
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

