import React, { useEffect } from 'react';
import { IdeenSelector } from '../components/IdeenSelector';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';
import { Box, Button, Paper, Typography } from '@mui/material';
import { PageContainer } from '../components/PageContainer';

interface Props {
  ideen: any[];
  sprache: 'de' | 'en' | 'fr';
  attributeMeta: Record<string, { name: string; unit: string; description?: string }>;
  onIdeenUpdate: (ideen: any[]) => void;
}

export const IdeaSelectionPage = ({ ideen, sprache, attributeMeta, onIdeenUpdate }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <PageContainer>
      <Box>
      <Box sx={{ mt: 4, mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ResetButton />
          <Button variant="outlined" onClick={() => navigate('/select-data')}>{t('back')}</Button>
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            logEvent(getSessionId(), 'ideas', {
              active: ideen.filter((i) => i.aktiv).map((i) => i.id),
              inactive: ideen.filter((i) => !i.aktiv).map((i) => i.id),
            });
            setPageStatus('idea', 'ok');
            navigate('/combinations');
          }}
        >
          {t('next')}
        </Button>
      </Box>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" textAlign="center">
          {t('ideaSelectionTitle')}
        </Typography>
        <Typography mt={2} textAlign="center" color="text.secondary">
          {t('selectIdeasInfo')}
        </Typography>
      </Paper>
      <IdeenSelector ideen={ideen} sprache={sprache} attributeMeta={attributeMeta} onUpdate={onIdeenUpdate} />
      </Box>
    </PageContainer>
  );
};
