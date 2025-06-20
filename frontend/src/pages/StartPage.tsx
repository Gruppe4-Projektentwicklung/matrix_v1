import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Typography } from '@mui/material';
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
    <Box
      sx={{
        maxWidth: 800,
        mx: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        p: 4,
        my: 4,
        textAlign: 'center',
        minHeight: '80vh',
      }}
    >
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
    </Box>
  );
};
