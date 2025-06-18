import React from 'react';
import { IdeenSelector } from '../components/IdeenSelector';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  ideen: any[];
  sprache: 'de' | 'en' | 'fr';
  onIdeenUpdate: (ideen: any[]) => void;
}

export const IdeaSelectionPage = ({ ideen, sprache, onIdeenUpdate }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <IdeenSelector ideen={ideen} sprache={sprache} onUpdate={onIdeenUpdate} />
      <div className="mt-6 flex justify-between">
        <Link to="/select-data" className="px-4 py-2 bg-gray-300 rounded">
          {t('back')}
        </Link>
        <Link to="/combinations" className="px-4 py-2 bg-[#1d2c5b] text-white rounded">
          {t('next')}
        </Link>
      </div>
    </div>
  );
};
