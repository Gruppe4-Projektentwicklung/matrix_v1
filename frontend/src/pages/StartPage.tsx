import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
import { PageContainer } from '../components/PageContainer';
import { markSessionStarted } from '../utils/session';

interface Props {
  dev2Mode: boolean;
  onStart: (dev2: boolean) => void;
}
export const StartPage = ({ dev2Mode, onStart }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStart = () => {
    markSessionStarted();
    onStart(dev2Mode);
    navigate('/select-data');
  };
  return (
  <PageContainer className="min-h-[60vh] my-6">
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography
        variant="h4"
        component="h1"
        mb={4}
        color="primary"
        align="center"
      >
        {t('title')}
      </Typography>
      <Typography
        component="div"
        mb={3}
        color="text.secondary"
        sx={{ textAlign: 'left' }}
        dangerouslySetInnerHTML={{ __html: t('introText') }}
      />
      <Box mt={4} display="flex" justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleStart}>
          {t('start')}
        </Button>
      </Box>
    </Box>
  </PageContainer>
);
};
