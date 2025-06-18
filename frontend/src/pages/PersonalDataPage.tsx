import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <div className="mt-6 flex justify-between">
        <ResetButton />

        <Link to="/" className="px-4 py-2 bg-gray-300 rounded">
          {t('reset')}
        </Link>

        <div className="flex gap-4">
          <Link to="/combinations" className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </Link>
          <Link to="/summary" className="px-4 py-2 bg-[#1d2c5b] text-white rounded">
            {t('next')}
          </Link>
        </div>
      </div>
    </div>
  );
};
