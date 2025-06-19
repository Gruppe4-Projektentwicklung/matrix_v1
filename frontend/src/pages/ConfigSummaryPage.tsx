import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';

interface Props {
  ideenCount: number;
  activeIdeen: number;
  kombiCount: number;
  activeKombis: number;
  loadingDuration: number;
}

export const ConfigSummaryPage = ({
  ideenCount,
  activeIdeen,
  kombiCount,
  activeKombis,
  loadingDuration,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const disabled = activeIdeen === 0 || activeKombis === 0;
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressDuration, setProgressDuration] = useState(0);
  const [showResultButton, setShowResultButton] = useState(false);

  const handleCalculate = () => {
    if (disabled) {
      alert(t('noDataLoaded'));
      return;
    }
    logEvent(getSessionId(), 'summary', {
      ideenCount,
      activeIdeen,
      kombiCount,
      activeKombis,
    });
    setPageStatus('summary', 'ok');
    const duration = loadingDuration + Math.random() * 0.4;
    setProgressDuration(duration);
    setLoading(true);
    setShowResultButton(false);
    setProgress(0);
    setTimeout(() => setProgress(100), 50);
    setTimeout(() => {
      setLoading(false);
      setShowResultButton(true);
    }, duration * 1000);
  };

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
          <button onClick={() => navigate('/personal')} className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </button>
          <button
            onClick={handleCalculate}
            disabled={disabled}
            className={
              disabled
                ? 'px-4 py-2 bg-gray-300 rounded cursor-not-allowed'
                : 'px-4 py-2 bg-blue-600 text-white rounded'
            }
          >
            {t('calculate')}
          </button>
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
      {loading && (
        <div className="my-4">
          <p className="mb-2">{t('calculating')}</p>
          <div className="w-full bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded transition-all"
              style={{ width: `${progress}%`, transitionDuration: `${progressDuration}s` }}
            />
          </div>
        </div>
      )}
      {showResultButton && (
        <div className="mt-4">
          <button
            onClick={() => navigate('/results')}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {t('showResults')}
          </button>
        </div>
      )}

    </div>
  );
};
