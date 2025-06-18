import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted } from '../utils/session';

interface Props {
  onOpenStatistikForm: () => void;
  onCloseStatistikForm: () => void;
}

export const PersonalDataPage = ({
  onOpenStatistikForm,
  onCloseStatistikForm,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  useEffect(() => {
    onOpenStatistikForm();
    return onCloseStatistikForm;
  }, [onOpenStatistikForm, onCloseStatistikForm]);

  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <div className="text-center">
      <div className="mt-8 mb-6 flex justify-between">
        <ResetButton />
        <div className="flex gap-4">
          <button onClick={() => navigate('/combinations')} className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </button>

          <button onClick={() => navigate('/summary')} className="px-4 py-2 bg-blue-600 text-white rounded">

            {t('next')}
          </button>
        </div>
      </div>
    </div>
  );
};
