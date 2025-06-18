import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted } from '../utils/session';

interface Props {
  ideenCount: number;
  activeIdeen: number;
  kombiCount: number;
  activeKombis: number;
}

export const ConfigSummaryPage = ({
  ideenCount,
  activeIdeen,
  kombiCount,
  activeKombis,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <div>
      <div className="mb-6 flex justify-between">
        <ResetButton />
        <div className="flex gap-4">
          <Link to="/personal" className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </Link>
          <Link to="/results" className="px-4 py-2 bg-blue-600 text-white rounded">
            {t('calculate')}
          </Link>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">{t('summary')}</h2>
      <ul className="mb-4 list-disc list-inside">
        <li>
          {t('currentIdeaCollection')}: {activeIdeen} / {ideenCount}
        </li>
        <li>
          {t('currentCombinationCollection')}: {activeKombis} / {kombiCount}
        </li>
      </ul>
    </div>
  );
};
