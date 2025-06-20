import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

type RankingEintrag = {
  id: string;
  name: string;
  score: number;
  beschreibung?: string;
  details?: Record<string, any>; // z.B. Attribut-Kombiwertungen
};

type Combination = {
  id: string;
  name?: string;
  formel?: string;
  einheit?: string;
  richtung?: string;
  [key: string]: any;
};

type Props = {
  eintraege?: RankingEintrag[];
  kombinationen?: Combination[];
};

export const Ranking = ({ eintraege, kombinationen }: Props) => {
  const { t, i18n } = useTranslation();
  const [infoId, setInfoId] = useState<string | null>(null);
  const [detailIds, setDetailIds] = useState<string[]>([]);

  // Robust: Fallback auf leeres Array, sortiere nur wenn Array vorhanden
  const sorted = Array.isArray(eintraege)
    ? [...eintraege].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    : [];

  return (
    <Box mt={4}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {t("rankingTitle")}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("rank")}</TableCell>
            <TableCell>{t("name")}</TableCell>
            <TableCell align="right">{t("score")}</TableCell>
            <TableCell align="center">{t("info")}</TableCell>
            <TableCell align="center">{t("details")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography color="text.secondary">{t("noEntries")}</Typography>
              </TableCell>
            </TableRow>
          )}
          {sorted.map((eintrag, idx) => {
            const showInfo = infoId === eintrag.id;
            const showDetails = detailIds.includes(eintrag.id);
            return (
              <React.Fragment key={eintrag.id}>
                <TableRow>
                  <TableCell>{idx + 1}.</TableCell>
                  <TableCell>{eintrag.name || t("noName")}</TableCell>
                  <TableCell align="right">
                    {typeof eintrag.score === "number" ? eintrag.score.toFixed(2) : "–"}
                  </TableCell>
                  <TableCell align="center">
                    {eintrag.beschreibung && (
                      <Button size="small" onClick={() => setInfoId(showInfo ? null : eintrag.id)}>
                        {t("info")}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {eintrag.details && (
                      <Button
                        size="small"
                        onClick={() =>
                          setDetailIds((prev) =>
                            prev.includes(eintrag.id)
                              ? prev.filter((id) => id !== eintrag.id)
                              : [...prev, eintrag.id]
                          )
                        }
                      >
                        {t("details")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                {eintrag.beschreibung && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Collapse in={showInfo} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2">{eintrag.beschreibung}</Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
                {eintrag.details && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Collapse in={showDetails} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2 }}>
                          <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                            {t("combiValues")}
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>{t("combination")}</TableCell>
                                <TableCell>{t("formula")}</TableCell>
                                <TableCell align="right">{t("value")}</TableCell>
                                <TableCell>{t("resultUnit")}</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(eintrag.details).length > 0 ? (
                                Object.entries(eintrag.details).map(([kombi, wert]) => {
                                  const id = kombi.replace(/^Kombi_/, "");
                                  const info = kombinationen?.find((k) => String(k.id) === id);
                                  const val =
                                    typeof wert === "number"
                                      ? Number(wert).toFixed(3)
                                      : wert;
                                  return (
                                    <TableRow key={kombi}>
                                      <TableCell>{info?.name || kombi}</TableCell>
                                      <TableCell>
                                        {info?.formel ||
                                          info?.[`#t_${i18n.language.slice(0, 2)}#3`] || ""}
                                      </TableCell>
                                      <TableCell align="right">{val}</TableCell>
                                      <TableCell>
                                        {info?.einheit || info?.Result_Unit || ""}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={4}>
                                    <Typography color="text.secondary">{t("noDetails")}</Typography>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  );
};

export default Ranking;
