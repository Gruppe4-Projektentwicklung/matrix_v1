import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import { PageContainer } from '../components/PageContainer';
import { markSessionStarted } from '../utils/session';
import { getRunCount } from '../api/getRunCount';

interface Props {
  dev2Mode: boolean;
  onStart: (dev2: boolean) => void;
}
export const StartPage = ({ dev2Mode, onStart }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [runCount, setRunCount] = useState<number | null>(null);

  useEffect(() => {
    getRunCount()
      .then((count) => setRunCount(count))
      .catch(() => setRunCount(null));
  }, []);

  const handleStart = () => {
    markSessionStarted();
    onStart(dev2Mode);
    navigate('/select-data');
  };
  return (
    <PageContainer className="min-h-[80vh] text-center">
      <Typography variant="h4" component="h1" mb={4} color="primary">
        {t('title')}
      </Typography>
      <Typography mb={3} color="text.secondary">
        {t('introText')}
      </Typography>
      <Box mt={4} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleStart}>
          {t('start')}
        </Button>
      </Box>
      {runCount !== null && (
        <div className="fixed bottom-2 right-2 text-xs text-gray-600">
          {t('calculationCounter', { count: runCount })}
        </div>
      )}
    </PageContainer>
  );
};
