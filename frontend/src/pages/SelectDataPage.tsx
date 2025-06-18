import React, { useEffect } from 'react';
import { CollectionSelectorIdeas } from '../components/CollectionSelectorIdeas';
import { CollectionSelectorKombis } from '../components/CollectionSelectorKombis';
import { useNavigate } from 'react-router-dom';
import { ResetButton } from '../components/ResetButton';
import { useTranslation } from 'react-i18next';
import { hasSessionStarted } from '../utils/session';

interface Props {
  aktuelleIdeensammlung: string;
  aktuelleKombiSammlung: string;
  onIdeenSammlungChange: (name: string) => void;
  onKombiSammlungChange: (name: string) => void;
  onIdeenUpload: (file: File) => void;
  onKombiUpload: (file: File) => void;
}

export const SelectDataPage = ({
  aktuelleIdeensammlung,
  aktuelleKombiSammlung,
  onIdeenSammlungChange,
  onKombiSammlungChange,
  onIdeenUpload,
  onKombiUpload,
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
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            {t('back')}
          </button>
          <button
            onClick={() => navigate('/ideas')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {t('next')}
          </button>
        </div>
      </div>
      <CollectionSelectorIdeas
        aktuelleSammlungName={aktuelleIdeensammlung}
        onSammlungChange={onIdeenSammlungChange}
        onUpload={onIdeenUpload}
      />
      <CollectionSelectorKombis
        aktuelleSammlungName={aktuelleKombiSammlung}
        onSammlungChange={onKombiSammlungChange}
        onUpload={onKombiUpload}
      />
    </div>
  );
};
