import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted } from '../utils/session';
import { StatistikForm } from '../components/StatistikForm';
import type { BewertungsLaufPayload } from '../components/StatistikForm';

interface Props {
  tester: boolean;
  payload: Omit<BewertungsLaufPayload, 'tester' | 'userData'>;
  onSaveSuccess: (result: { run_id?: string; message: string; error?: string }) => void;
}

export const PersonalDataPage = ({
  tester,
  payload,
  onSaveSuccess,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(true);
  const [saved, setSaved] = useState(false);


  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSaveSuccess = (result: { run_id?: string; message: string; error?: string }) => {
    setSaved(true);
    setFormOpen(false);
    onSaveSuccess(result);
  };

  const handleNext = () => {
    if (!tester && !saved) {
      alert(t('fieldsRequired'));
      setFormOpen(true);
      return;
    }
    navigate('/summary');
  };

  return (
    <div className="text-center">
      {formOpen && (
        <div className="mb-6 flex justify-center">
          <StatistikForm
            open={true}
            inline
            tester={tester}
            payload={payload}
            onSaveSuccess={handleSaveSuccess}
          />
        </div>
      )}
      <div className="mt-8 mb-6 flex justify-between">
        <ResetButton />
        <div className="flex gap-4">
          <button onClick={() => navigate('/combinations')} className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </button>
          <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
};
