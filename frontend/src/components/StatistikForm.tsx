import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { saveRun } from "../api/saveRun";
import type { SaveRunResponse, BewertungsLaufPayload, UserData } from "../api/saveRun";
import { setSaveRunStatus } from "../utils/session";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

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

  const jobRoleOptionsByIndustry: Record<string, string[]> = {
    industryConstruction: [
      "jobEngineer",
      "jobArchitect",
      "jobSiteSupervisor",
      "jobSafetyInspector",
      "jobCarpenter",
      "jobElectrician",
      "jobPlumber",
      "jobSurveyor",
      "jobLaborer",
      "jobManager",
    ],
    industryEnergy: [
      "jobEngineer",
      "jobTechnician",
      "jobSafetyInspector",
      "jobConsultant",
      "jobElectrician",
      "jobAnalyst",
      "jobResearcher",
      "jobManager",
      "jobMarketingManager",
      "jobProductionManager",
    ],
    industryIT: [
      "jobDeveloper",
      "jobSystemAdmin",
      "jobDataScientist",
      "jobProductManager",
      "jobQAEngineer",
      "jobResearcher",
      "jobConsultant",
      "jobArchitect",
      "jobSupportSpecialist",
      "jobManager",
    ],
    industryEducation: [
      "jobTeacher",
      "jobProfessor",
      "jobResearcher",
      "jobAdministrator",
      "jobStudent",
      "jobLibrarian",
      "jobCounselor",
      "jobLecturer",
      "jobDeveloper",
      "jobManager",
    ],
    industryHealthcare: [
      "jobDoctor",
      "jobNurse",
      "jobTherapist",
      "jobPharmacist",
      "jobResearcher",
      "jobTechnician",
      "jobAdministrator",
      "jobConsultant",
      "jobParamedic",
      "jobManager",
    ],
    industryRetail: [
      "jobSales",
      "jobStoreManager",
      "jobCashier",
      "jobInventorySpecialist",
      "jobMarketingManager",
      "jobMerchandiser",
      "jobCustomerService",
      "jobBuyer",
      "jobLogisticsManager",
      "jobConsultant",
    ],
    industryTourism: [
      "jobTravelAgent",
      "jobTourGuide",
      "jobHotelManager",
      "jobEventPlanner",
      "jobChef",
      "jobConcierge",
      "jobReceptionist",
      "jobMarketingManager",
      "jobSales",
      "jobManager",
    ],
    industryFinance: [
      "jobAnalyst",
      "jobAccountant",
      "jobFinancialAdvisor",
      "jobBanker",
      "jobManager",
      "jobConsultant",
      "jobAuditor",
      "jobRiskManager",
      "jobTrader",
      "jobActuary",
    ],
    industryManufacturing: [
      "jobEngineer",
      "jobTechnician",
      "jobProductionManager",
      "jobQualityControl",
      "jobAssemblyWorker",
      "jobLogisticsManager",
      "jobSafetyInspector",
      "jobMaintenanceTechnician",
      "jobDesigner",
      "jobResearcher",
    ],
    industryPublic: [
      "jobCivilServant",
      "jobManager",
      "jobTeacher",
      "jobEngineer",
      "jobPolicyAdvisor",
      "jobSocialWorker",
      "jobPoliceOfficer",
      "jobFirefighter",
      "jobClerk",
      "jobConsultant",
    ],
  };

  const defaultJobRoleOptions = [
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

  const jobRoleOptions =
    jobRoleOptionsByIndustry[brancheOption as keyof typeof jobRoleOptionsByIndustry] ||
    defaultJobRoleOptions;

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
        <p>{t('appTesterMode')}</p>
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
      <Box display="flex" justifyContent="center">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 3, maxWidth: 400, width: 1, position: "relative" }}
        >
          {onClose && (
            <Button
              type="button"
              onClick={onClose}
              sx={{ position: "absolute", top: 8, right: 12, minWidth: 0 }}
              aria-label={t("close")}
            >
              ×
            </Button>
          )}

          <Box component="h2" sx={{ fontWeight: "bold", fontSize: "1.125rem", mb: 1 }}>
            {t("helpImproveStats")}
          </Box>
          <Box
            sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 2 }}
            dangerouslySetInnerHTML={{ __html: t("infoVoluntary") }}
          />
          {!tester && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
              <TextField
                type="number"
                inputProps={{ min: 10, max: 120 }}
                label={t("age") as string}
                value={alter}
                onChange={(e) => setAlter(e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>{t("gender")}</InputLabel>
                <Select
                  value={geschlecht}
                  label={t("gender")}
                  onChange={(e) => setGeschlecht(e.target.value as string)}
                >
                  <MenuItem value="male">{t("genderMale")}</MenuItem>
                  <MenuItem value="female">{t("genderFemale")}</MenuItem>
                  <MenuItem value="none">{t("genderNone")}</MenuItem>
                  <MenuItem value="mechanic">{t("genderMechanic")}</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>{t("industry")}</InputLabel>
                <Select
                  value={brancheOption}
                  label={t("industry")}
                  onChange={(e) => {
                    const val = e.target.value as string;
                    setBrancheOption(val);
                    if (val !== "other") {
                      setBranche(val);
                    } else {
                      setBranche("");
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>{t("industry")}</em>
                  </MenuItem>
                  {industryOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {t(opt)}
                    </MenuItem>
                  ))}
                  <MenuItem value="other">{t("other")}</MenuItem>
                </Select>
              </FormControl>
              {brancheOption === "other" && (
                <TextField
                  type="text"
                  label={t("industry") as string}
                  value={branche}
                  onChange={(e) => setBranche(e.target.value)}
                  fullWidth
                />
              )}
              <FormControl fullWidth>
                <InputLabel>{t("jobRole")}</InputLabel>
                <Select
                  value={berufsrolleOption}
                  label={t("jobRole")}
                  onChange={(e) => {
                    const val = e.target.value as string;
                    setBerufsrolleOption(val);
                    if (val !== "other") {
                      setBerufsrolle(val);
                    } else {
                      setBerufsrolle("");
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>{t("jobRole")}</em>
                  </MenuItem>
                  {jobRoleOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {t(opt)}
                    </MenuItem>
                  ))}
                  <MenuItem value="other">{t("other")}</MenuItem>
                </Select>
              </FormControl>
              {berufsrolleOption === "other" && (
                <TextField
                  type="text"
                  label={t("jobRole") as string}
                  value={berufsrolle}
                  onChange={(e) => setBerufsrolle(e.target.value)}
                  fullWidth
                />
              )}
            </Box>
          )}

          {fehler && (
            <Box sx={{ color: "error.main", fontSize: "0.875rem", mb: 1 }}>{fehler}</Box>
          )}

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={
                sending ||
                (!tester &&
                  (!alter || !geschlecht || !branche || !berufsrolle || !isValidAge(alter)))
              }
            >
              {tester ? t("submitWithoutData") : t("saveRating")}
            </Button>
            {onClose && (
              <Button type="button" onClick={onClose} disabled={sending} variant="outlined">
                {t("cancel")}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 3, maxWidth: 400, width: 1, position: "relative" }}
      >
        {onClose && (
          <Button
            type="button"
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 12, minWidth: 0 }}
            aria-label={t("close")}
          >
            ×
          </Button>
        )}
        <Box component="h2" sx={{ fontWeight: "bold", fontSize: "1.125rem", mb: 1 }}>
          {t("helpImproveStats")}
        </Box>
        <Box
          sx={{ color: "text.secondary", fontSize: "0.875rem", mb: 2 }}
          dangerouslySetInnerHTML={{ __html: t("infoVoluntary") }}
        />

        {!tester && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <TextField
              type="number"
              inputProps={{ min: 10, max: 120 }}
              label={t("age") as string}
              value={alter}
              onChange={(e) => setAlter(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t("gender")}</InputLabel>
              <Select
                value={geschlecht}
                label={t("gender")}
                onChange={(e) => setGeschlecht(e.target.value as string)}
              >
                <MenuItem value="male">{t("genderMale")}</MenuItem>
                <MenuItem value="female">{t("genderFemale")}</MenuItem>
                <MenuItem value="none">{t("genderNone")}</MenuItem>
                <MenuItem value="mechanic">{t("genderMechanic")}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t("industry")}</InputLabel>
              <Select
                value={brancheOption}
                label={t("industry")}
                onChange={(e) => {
                  const val = e.target.value as string;
                  setBrancheOption(val);
                  if (val !== "other") {
                    setBranche(val);
                  } else {
                    setBranche("");
                  }
                }}
              >
                <MenuItem value="">
                  <em>{t("industry")}</em>
                </MenuItem>
                {industryOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {t(opt)}
                  </MenuItem>
                ))}
                <MenuItem value="other">{t("other")}</MenuItem>
              </Select>
            </FormControl>
            {brancheOption === "other" && (
              <TextField
                type="text"
                label={t("industry") as string}
                value={branche}
                onChange={(e) => setBranche(e.target.value)}
                fullWidth
              />
            )}
            <FormControl fullWidth>
              <InputLabel>{t("jobRole")}</InputLabel>
              <Select
                value={berufsrolleOption}
                label={t("jobRole")}
                onChange={(e) => {
                  const val = e.target.value as string;
                  setBerufsrolleOption(val);
                  if (val !== "other") {
                    setBerufsrolle(val);
                  } else {
                    setBerufsrolle("");
                  }
                }}
              >
                <MenuItem value="">
                  <em>{t("jobRole")}</em>
                </MenuItem>
                {jobRoleOptions.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {t(opt)}
                  </MenuItem>
                ))}
                <MenuItem value="other">{t("other")}</MenuItem>
              </Select>
            </FormControl>
            {berufsrolleOption === "other" && (
              <TextField
                type="text"
                label={t("jobRole") as string}
                value={berufsrolle}
                onChange={(e) => setBerufsrolle(e.target.value)}
                fullWidth
              />
            )}
          </Box>
        )}

        {fehler && (
          <Box sx={{ color: "error.main", fontSize: "0.875rem", mb: 1 }}>{fehler}</Box>
        )}

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={
              sending ||
              (!tester && (!alter || !geschlecht || !branche || !berufsrolle || !isValidAge(alter)))
            }
          >
            {tester ? t("submitWithoutData") : t("saveRating")}
          </Button>
          {onClose && (
            <Button type="button" onClick={onClose} disabled={sending} variant="outlined">
              {t("cancel")}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

