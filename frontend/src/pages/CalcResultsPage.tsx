import React, { useEffect } from 'react';
import { Ranking } from '../components/Ranking';
import { ExportRankingButton } from '../components/ExportRankingButton';
import { useNavigate } from 'react-router-dom';
import { hasSessionStarted } from '../utils/session';
import { ResetButton } from '../components/ResetButton';
import { Box } from '@mui/material';

interface Props {
  rankingEintraege: any[];
}

export const CalcResultsPage = ({ rankingEintraege }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <Box>
      <Ranking eintraege={rankingEintraege} />
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <ResetButton />
        <ExportRankingButton eintraege={rankingEintraege} />
      </Box>
    </Box>
  );
};
