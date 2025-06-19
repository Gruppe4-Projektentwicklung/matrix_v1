import React, { useEffect } from 'react';
import { WeightingSelector } from '../components/WeightingSelector';
import { BewertungsOptionen } from '../components/BewertungsOptionen';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';

interface Props {
  gewichtungen: any[];
  runde1: boolean;
  runde2: boolean;
  appTester: boolean;
  datenfreigabe: 'offen' | 'anonym' | 'keine';
  showRoundOptions?: boolean;
  onGewichtungenUpdate: (g: any[]) => void;
  onOptionsChange: (field: string, value: any) => void;
}

export const CombinationSelectionPage = ({
  gewichtungen,
  runde1,
  runde2,
  appTester,
  datenfreigabe,
  showRoundOptions = true,
  onGewichtungenUpdate,
  onOptionsChange,
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
      <div className="mt-8 mb-6 flex justify-between">
        <ResetButton />
        <div className="flex gap-4">
          <button onClick={() => navigate('/ideas')} className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </button>
          <button
            onClick={() => {
              logEvent(getSessionId(), 'combinations', {
                gewichtungen,
                runde1,
                runde2,
                appTester,
                datenfreigabe,
              });
              setPageStatus('combination', 'ok');
              navigate('/personal');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {t('next')}
          </button>
        </div>
      </div>
      <WeightingSelector kombinationen={gewichtungen} onUpdate={onGewichtungenUpdate} />
      <div className="bg-[#f8fafc] p-6 rounded-xl shadow mb-8">
        <BewertungsOptionen
          runde1={runde1}
          runde2={runde2}
          appTester={appTester}
          datenfreigabe={datenfreigabe}
          onChange={onOptionsChange}
          showDataRelease={false}
          showRoundOptions={showRoundOptions}
        />
        <p className="mt-4 text-center text-sm text-gray-700">{t('selectWeightsInfo')}</p>
      </div>
      
    </div>
  );
};
