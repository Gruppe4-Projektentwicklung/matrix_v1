import React, { useEffect } from 'react';
import { Ranking } from '../components/Ranking';
import { ExportRankingButton } from '../components/ExportRankingButton';
import { useNavigate } from 'react-router-dom';
import { hasSessionStarted } from '../utils/session';
import { ResetButton } from '../components/ResetButton';

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
    <div>
      <Ranking eintraege={rankingEintraege} />
      <div className="mt-6 flex justify-between items-center gap-4">
        <ResetButton />
        <ExportRankingButton eintraege={rankingEintraege} />
      </div>
    </div>
  );
};
