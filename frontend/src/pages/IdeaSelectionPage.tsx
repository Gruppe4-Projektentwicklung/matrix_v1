import React, { useEffect } from 'react';
import { IdeenSelector } from '../components/IdeenSelector';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted } from '../utils/session';

interface Props {
  ideen: any[];
  sprache: 'de' | 'en' | 'fr';
  onIdeenUpdate: (ideen: any[]) => void;
}

export const IdeaSelectionPage = ({ ideen, sprache, onIdeenUpdate }: Props) => {
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
          <Link to="/select-data" className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </Link>
          <Link to="/combinations" className="px-4 py-2 bg-blue-600 text-white rounded">
            {t('next')}
          </Link>
        </div>
      </div>
      <IdeenSelector ideen={ideen} sprache={sprache} onUpdate={onIdeenUpdate} />
      <div className="mt-6 flex justify-between">
        <ResetButton />
        <Link to="/" className="px-4 py-2 bg-gray-300 rounded">
          {t('reset')}
        </Link>
        <div className="flex gap-4">
          <Link to="/select-data" className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </Link>
          <Link to="/combinations" className="px-4 py-2 bg-[#1d2c5b] text-white rounded">
            {t('next')}
          </Link>
        </div>
      </div>
    </div>
  );
};
