import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type Idee = {
  id: string;
  aktiv: boolean;
  attribute: Record<string, string | number>;
  [key: string]: any; // für dynamische Sprachspalten wie '#t_de#1', '#t_en#1', etc.
};

type AttributeMeta = Record<string, { name: string; unit: string; description?: string }>;

type Props = {
  ideen?: Idee[]; // optional für Robustheit
  sprache: "de" | "en" | "fr";
  attributeMeta?: AttributeMeta;
  onUpdate: (updated: Idee[]) => void;
};

export const IdeenSelector: React.FC<Props> = ({
  ideen = [],
  sprache,
  attributeMeta = {},
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [infoAttr, setInfoAttr] = useState<string | null>(null);

  const toggleActive = (id: string) => {
    const updated = (ideen || []).map((idee) =>
      idee.id === id ? { ...idee, aktiv: !idee.aktiv } : idee
    );
    onUpdate(updated);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (!Array.isArray(ideen) || ideen.length === 0) {
    return <div className="text-gray-500">{t("noIdeasLoaded")}</div>;
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">{t('active')} / {t('disabled')}</TableCell>
            <TableCell>{t('category')}</TableCell>
            <TableCell>{t('description')}</TableCell>
            <TableCell align="right">{t('info')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(ideen || []).map((idee) => {
            const name =
              typeof idee[`#t_${sprache}#1`] === "string"
                ? idee[`#t_${sprache}#1`]
                : t("noName");
            const beschreibung =
              typeof idee[`#t_${sprache}#2`] === "string"
                ? idee[`#t_${sprache}#2`]
                : t("noDescription");
            const kategorie =
              typeof idee[`#t_${sprache}#3`] === "string"
                ? idee[`#t_${sprache}#3`]
                : t("noCategory");
            const attribute =
              typeof idee.attribute === "object" && idee.attribute ? idee.attribute : {};

            const inactive = !idee.aktiv;

            return (
              <React.Fragment key={idee.id}>
                <TableRow
                  sx={{
                    bgcolor: inactive ? 'action.disabledBackground' : 'background.paper',
                    '& *': { color: inactive ? 'text.disabled' : 'inherit' },
                  }}
                >
                  <TableCell padding="checkbox" sx={{ borderRight: 1, borderColor: 'divider' }}>
                    <Checkbox
                      checked={!!idee.aktiv}
                      onChange={() => toggleActive(idee.id)}
                      inputProps={{ 'aria-label': idee.aktiv ? t('active') : t('disabled') }}
                    />
                  </TableCell>
                  <TableCell sx={{ borderRight: 1, borderColor: 'divider', width: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      {kategorie}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ px: 2 }}>
                    <Typography variant="subtitle1">{name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {beschreibung}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => toggleExpand(idee.id)}
                      size="small"
                      aria-label={
                        expandedId === idee.id ? t('hideAttributes') : t('showAttributes')
                      }
                    >
                      <InfoOutlinedIcon fontSize="inherit" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} sx={{ p: 0 }}>
                    <Collapse in={expandedId === idee.id} timeout="auto" unmountOnExit>
                      <Box sx={{ p: 2 }}>
                        {Object.keys(attribute).length > 0 ? (
                          <Table size="small">
                            <TableBody>
                              {(() => {
                                const pairs: Record<string, any> = {};
                                const pairOrder: string[] = [];
                                const singles: any[] = [];
                                Object.entries(attribute).forEach(([k, v]) => {
                                  const m = attributeMeta[k] || { name: k, unit: '', description: '' };
                                  const match = m.name.match(/^(.*?)(?:\s*(Alt|Neu))$/i);
                                  if (match) {
                                    const base = match[1].trim();
                                    const type = match[2].toLowerCase() === 'alt' ? 'alt' : 'neu';
                                    if (!pairs[base]) {
                                      pairs[base] = { base };
                                      pairOrder.push(base);
                                    }
                                    pairs[base][type] = { key: k, value: v, meta: m };
                                  } else {
                                    singles.push({ key: k, value: v, meta: m });
                                  }
                                });

                                const rows: JSX.Element[] = [];
                                pairOrder.forEach((base) => {
                                  const g = pairs[base];
                                  rows.push(
                                    <TableRow key={base}>
                                      {g.alt ? (
                                        <>
                                          <TableCell>{g.alt.meta.name}</TableCell>
                                          <TableCell>
                                            {g.alt.value} {g.alt.meta.unit}
                                          </TableCell>
                                          <TableCell width={40} align="right">
                                            <IconButton size="small" onClick={() => setInfoAttr(g.alt.key)}>
                                              <InfoOutlinedIcon fontSize="inherit" />
                                            </IconButton>
                                          </TableCell>
                                        </>
                                      ) : (
                                        <>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                        </>
                                      )}
                                      {g.neu ? (
                                        <>
                                          <TableCell>{g.neu.meta.name}</TableCell>
                                          <TableCell>
                                            {g.neu.value} {g.neu.meta.unit}
                                          </TableCell>
                                          <TableCell width={40} align="right">
                                            <IconButton size="small" onClick={() => setInfoAttr(g.neu.key)}>
                                              <InfoOutlinedIcon fontSize="inherit" />
                                            </IconButton>
                                          </TableCell>
                                        </>
                                      ) : (
                                        <>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                        </>
                                      )}
                                    </TableRow>
                                  );
                                });

                                for (let i = 0; i < singles.length; i += 2) {
                                  const left = singles[i];
                                  const right = singles[i + 1];
                                  rows.push(
                                    <TableRow key={`single-${i}`}> 
                                      {left ? (
                                        <>
                                          <TableCell>{left.meta.name}</TableCell>
                                          <TableCell>
                                            {left.value} {left.meta.unit}
                                          </TableCell>
                                          <TableCell width={40} align="right">
                                            <IconButton size="small" onClick={() => setInfoAttr(left.key)}>
                                              <InfoOutlinedIcon fontSize="inherit" />
                                            </IconButton>
                                          </TableCell>
                                        </>
                                      ) : (
                                        <>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                        </>
                                      )}
                                      {right ? (
                                        <>
                                          <TableCell>{right.meta.name}</TableCell>
                                          <TableCell>
                                            {right.value} {right.meta.unit}
                                          </TableCell>
                                          <TableCell width={40} align="right">
                                            <IconButton size="small" onClick={() => setInfoAttr(right.key)}>
                                              <InfoOutlinedIcon fontSize="inherit" />
                                            </IconButton>
                                          </TableCell>
                                        </>
                                      ) : (
                                        <>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                          <TableCell></TableCell>
                                        </>
                                      )}
                                    </TableRow>
                                  );
                                }

                                return rows;
                              })()}
                            </TableBody>
                          </Table>
                        ) : (
                          <Typography color="text.secondary">{t('noAttributes')}</Typography>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      <Dialog open={!!infoAttr} onClose={() => setInfoAttr(null)}>
        <DialogTitle>{attributeMeta[infoAttr || ""]?.name || ""}</DialogTitle>
        <DialogContent>
          <Typography>
            {attributeMeta[infoAttr || ""]?.description || t('attributeDescriptionPlaceholder')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInfoAttr(null)}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IdeenSelector;
