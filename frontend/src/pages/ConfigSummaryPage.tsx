import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';
import { Box, Button, Paper, Typography, LinearProgress } from '@mui/material';

interface Props {
  ideenCount: number;
  activeIdeen: number;
  kombiCount: number;
  activeKombis: number;
  loadingDuration: number;
  ideenSammlung: string;
  kombiSammlung: string;
  userData?: {
    alter?: string;
    geschlecht?: string;
    branche?: string;
    berufsrolle?: string;
  };
  onCalculate: () => Promise<void>;
}

export const ConfigSummaryPage = ({
  ideenCount,
  activeIdeen,
  kombiCount,
  activeKombis,
  loadingDuration,
  ideenSammlung,
  kombiSammlung,
  userData,
  onCalculate,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const disabled = activeIdeen === 0 || activeKombis === 0;
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressDuration, setProgressDuration] = useState(0);
  const [showResultButton, setShowResultButton] = useState(false);

  const handleCalculate = async () => {
    if (disabled) {
      alert(t('noDataLoaded'));
      return;
    }
    logEvent(getSessionId(), 'summary', {
      ideenCount,
      activeIdeen,
      kombiCount,
      activeKombis,
      ideenSammlung,
      kombiSammlung,
    });
    setPageStatus('summary', 'ok');
    const duration = loadingDuration + Math.random() * 0.4;
    setProgressDuration(duration);
    setProgress(0);

    setTimeout(() => setProgress(100), 50);
    try {
      await onCalculate();
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      setLoading(false);
      setShowResultButton(true);
    }, duration * 1000);

    setShowResultButton(false);
    setLoading(true);
  };

  useEffect(() => {
    if (!loading) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const percentage = Math.min((elapsed / progressDuration) * 100, 100);
      setProgress(percentage);
      if (percentage >= 100) {
        clearInterval(interval);
        setLoading(false);
        setShowResultButton(true);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [loading, progressDuration]);

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
          <Button variant="outlined" onClick={() => navigate('/personal')}>
            {t('back')}
          </Button>
        </Box>
        <Button variant="contained" onClick={handleCalculate} disabled={disabled}>
          {t('calculate')}
        </Button>
      </Box>
      <Typography variant="h5" mb={2} fontWeight="bold">
        {t('summary')}
      </Typography>
      <ul className="mb-4 list-disc list-inside">
        <li>
          {t('ideaCollectionName')}: {ideenSammlung}
        </li>
        <li>
          {t('combinationCollectionName')}: {kombiSammlung}
        </li>
        <li>
          {t('currentIdeaCollection')}: {activeIdeen} / {ideenCount}
        </li>
        <li>
          {t('currentCombinationCollection')}: {activeKombis} / {kombiCount}
        </li>
      </ul>
      {userData && (
        <Paper sx={{ mb: 2, p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            {t('personalDataSummary')}
          </Typography>
          <ul className="list-disc list-inside">
            <li>
              {t('age')}: {userData.alter || '-'}
            </li>
            <li>
              {t('gender')}: {userData.geschlecht || '-'}
            </li>
            <li>
              {t('industry')}: {userData.branche ? t(userData.branche) : '-'}
            </li>
            <li>
              {t('jobRole')}: {userData.berufsrolle ? t(userData.berufsrolle) : '-'}
            </li>
          </ul>
        </Paper>
      )}
      {loading && (
        <Box my={2}>
          <Typography mb={1}>
            {t('calculating')} {`${Math.round(progress)}/100 %`}
          </Typography>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
      {showResultButton && (
        <Box mt={2}>
          <Button variant="contained" onClick={() => navigate('/results')}>
            {t('showResults')}
          </Button>
        </Box>
      )}

    </Box>
  );
};
