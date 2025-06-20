import React, { useEffect } from 'react';
import { WeightingSelector } from '../components/WeightingSelector';
import { BewertungsOptionen } from '../components/BewertungsOptionen';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';
import { Box, Button, Paper, Typography } from '@mui/material';

interface Props {
  gewichtungen: any[];
  runde1: boolean;
  runde2: boolean;
  appTester: boolean;
  datenfreigabe: 'offen' | 'anonym' | 'keine';
  showRoundOptions?: boolean;
  showTesterOption?: boolean;
  onGewichtungenUpdate: (g: any[]) => void;
  onOptionsChange: (field: string, value: any) => void;
}

export const CombinationSelectionPage = ({
  gewichtungen,
  runde1,
  runde2,
  appTester,
  datenfreigabe,
  showRoundOptions = true,
  showTesterOption = true,
  onGewichtungenUpdate,
  onOptionsChange,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <Box>
      <Box sx={{ mt: 4, mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ResetButton />
          <Button variant="outlined" onClick={() => navigate('/ideas')}>{t('back')}</Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            logEvent(getSessionId(), 'combinations', {
              gewichtungen,
              runde1,
              runde2,
              appTester,
              datenfreigabe,
            });
            setPageStatus('combination', 'ok');
            navigate('/personal');
          }}
        >
          {t('next')}
        </Button>
      </Box>
      <Paper sx={{ p: 3, mb: 4 }}>
        <BewertungsOptionen
          runde1={runde1}
          runde2={runde2}
          appTester={appTester}
          datenfreigabe={datenfreigabe}
          onChange={onOptionsChange}
          showDataRelease={false}
          showRoundOptions={showRoundOptions}
          showTesterOption={showTesterOption}
        />
        <Typography mt={2} textAlign="center" color="text.secondary">
          {t('selectWeightsInfo')}
        </Typography>
      </Paper>
      <WeightingSelector kombinationen={gewichtungen} onUpdate={onGewichtungenUpdate} />

    </Box>
  );
};
