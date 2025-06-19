import React, { useEffect } from 'react';
import { IdeenSelector } from '../components/IdeenSelector';
import { BewertungsOptionen } from '../components/BewertungsOptionen';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';

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
      <div className="mt-8 mb-6 flex justify-between">
        <ResetButton />
        <div className="flex gap-4">
          <button onClick={() => navigate('/select-data')} className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </button>
          <button
            onClick={() => {
              logEvent(getSessionId(), 'ideas', {
                active: ideen.filter((i) => i.aktiv).map((i) => i.id),
                inactive: ideen.filter((i) => !i.aktiv).map((i) => i.id),
              });
              setPageStatus('idea', 'ok');
              navigate('/combinations');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {t('next')}
          </button>
        </div>
      </div>
      <div className="bg-[#f8fafc] p-6 rounded-xl shadow mb-8">
        <BewertungsOptionen
          runde1={true}
          runde2={true}
          appTester={false}
          datenfreigabe="offen"
          onChange={() => {}}
          showDataRelease={false}
        />
        <p className="mt-4 text-center text-sm text-gray-700">{t('selectWeightsInfo')}</p>
      </div>
      <IdeenSelector ideen={ideen} sprache={sprache} onUpdate={onIdeenUpdate} />
    </div>
  );
};
