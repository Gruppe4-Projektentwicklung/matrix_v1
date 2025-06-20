import React, { useEffect } from 'react';
import { Ranking } from '../components/Ranking';
import { ExportRankingButton } from '../components/ExportRankingButton';
import { useNavigate } from 'react-router-dom';
import { hasSessionStarted } from '../utils/session';
import { ResetButton } from '../components/ResetButton';
import { Box } from '@mui/material';
import { PageContainer } from '../components/PageContainer';

interface Props {
  rankingEintraege: any[];
  kombinationen: any[];
}

export const CalcResultsPage = ({ rankingEintraege, kombinationen }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <PageContainer>
      <Box>
        <Box sx={{ mt: 4, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <ResetButton />
          <ExportRankingButton eintraege={rankingEintraege} />
        </Box>
        <Ranking eintraege={rankingEintraege} kombinationen={kombinationen} />
      </Box>
    </PageContainer>
  );
};
