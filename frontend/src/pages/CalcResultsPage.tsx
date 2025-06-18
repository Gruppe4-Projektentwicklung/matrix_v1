import React, { useEffect } from 'react';
import { Ranking } from '../components/Ranking';
import { ExportRankingButton } from '../components/ExportRankingButton';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hasSessionStarted } from '../utils/session';

interface Props {
  rankingEintraege: any[];
}

export const CalcResultsPage = ({ rankingEintraege }: Props) => {
  const { t } = useTranslation();
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
        <Link to="/" className="px-4 py-2 bg-gray-300 rounded">
          {t('reset')}
        </Link>
        <ExportRankingButton eintraege={rankingEintraege} />
      </div>
    </div>
  );
};
