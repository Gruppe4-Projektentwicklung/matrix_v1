import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type Combination = {
  id: string;
  name: string;
  beschreibung?: string;
  gewichtung: number;
  aktiv: boolean;
  [key: string]: any;
};

type Props = {
  kombinationen?: Combination[]; // Optional für Robustheit!
  onUpdate: (updated: Combination[]) => void;
};

export const WeightingSelector: React.FC<Props> = ({
  kombinationen = [],
  onUpdate,
}) => {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const gewichtungLabels = [
    t("notImportantAtAll"),
    t("slightlyImportant"),
    t("neutral"),
    t("important"),
    t("veryImportant"),
  ];

  const getCategory = (k: any) =>
    k.kategorie || k.category || k.Kategorie || "";

  const hasCategory = kombinationen.some((k) => getCategory(k));

  const handleGewichtungChange = (id: string, value: number) => {
    const updated = (kombinationen || []).map((kombi) =>
      kombi.id === id ? { ...kombi, gewichtung: value, aktiv: value > 0 } : kombi
    );
    onUpdate(updated);
  };

  const toggleActive = (id: string) => {
    const updated = (kombinationen || []).map((kombi) =>
      kombi.id === id
        ? {
            ...kombi,
            gewichtung: kombi.gewichtung === 0 ? 3 : 0,
            aktiv: kombi.gewichtung === 0,
          }
        : kombi
    );
    onUpdate(updated);
  };

  const toggleInfo = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!Array.isArray(kombinationen) || kombinationen.length === 0) {
    return <div className="text-gray-500">{t("noWeightingCombinationsAvailable")}</div>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">{t('active')} / {t('disabled')}</TableCell>
          {hasCategory && <TableCell>{t('category')}</TableCell>}
          <TableCell>{t('description')}</TableCell>
          <TableCell align="right">{t('info')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {kombinationen.map((kombi) => {
          const inactive = kombi.gewichtung === 0;
          const category = getCategory(kombi) || t('noCategory');
          return (
            <React.Fragment key={kombi.id}>
              <TableRow
                sx={{
                  bgcolor: inactive ? 'action.disabledBackground' : 'background.paper',
                  '& *': { color: inactive ? 'text.disabled' : 'inherit' },
                }}
              >
                <TableCell padding="checkbox" sx={{ borderRight: 1, borderColor: 'divider' }}>
                  <Checkbox
                    checked={!inactive}
                    onChange={() => toggleActive(kombi.id)}
                    inputProps={{ 'aria-label': inactive ? t('disabled') : t('active') }}
                  />
                </TableCell>
                {hasCategory && (
                  <TableCell sx={{ borderRight: 1, borderColor: 'divider', width: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      {category}
                    </Typography>
                  </TableCell>
                )}
                <TableCell sx={{ px: 2 }}>
                  <Typography variant="subtitle1">{kombi.name}</Typography>
                  {kombi.beschreibung && (
                    <Typography variant="body2" color="text.secondary">
                      {kombi.beschreibung}
                    </Typography>
                  )}
                  <RadioGroup
  row
  value={kombi.gewichtung === 0 ? 3 : kombi.gewichtung}
  onChange={(e, v) => handleGewichtungChange(kombi.id, Number(v))}
  sx={{ mt: 1 }}
>
  {gewichtungLabels.map((label, i) => (
    <FormControlLabel
      key={i + 1}
      value={i + 1}
      control={<Radio size="small" />}
      label={label}
      disabled={inactive}
    />
  ))}
</RadioGroup>

                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => toggleInfo(kombi.id)}
                    size="small"
                    aria-label={expandedId === kombi.id ? t('hideDescription') : t('showDescription')}
                  >
                    <InfoOutlinedIcon fontSize="inherit" />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={hasCategory ? 4 : 3} sx={{ p: 0 }}>
                  <Collapse in={expandedId === kombi.id} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2 }}>
                      {(() => {
                        const formula =
                          kombi[`#t_${i18n.language}#3`] || kombi.formel || "";
                        const unit = kombi.einheit || kombi.Result_Unit || "";
                        const direction = kombi.richtung || kombi.Direction || "";

                        if (!formula && !unit && !direction) return null;

                        const directionText = (() => {
                          const dir = String(direction).toLowerCase();
                          if (["high", "hoch"].includes(dir)) return t("higherIsBetter");
                          if (["low", "niedrig"].includes(dir)) return t("lowerIsBetter");
                          return "";
                        })();

                        return (
                          <Table
                            size="small"
                            sx={{
                              mt: 1,
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 1,
                              '& td, & th': { borderColor: 'divider' },
                            }}
                          >
                            <TableHead>
                              <TableRow sx={{ bgcolor: "action.hover" }}>
                                <TableCell>{t("formula")}</TableCell>
                                <TableCell>{t("resultUnit")}</TableCell>
                                <TableCell>{t("evaluationDirection")}</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>{formula}</TableCell>
                                <TableCell>{unit}</TableCell>
                                <TableCell>
                                  {direction}
                                  {directionText && ` – ${directionText}`}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        );
                      })()}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default WeightingSelector;
