import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';

interface Props {
  onOpenStatistikForm: () => void;
  onCloseStatistikForm: () => void;
}

export const PersonalDataPage = ({
  onOpenStatistikForm,
  onCloseStatistikForm,
}: Props) => {
  const { t } = useTranslation();
  useEffect(() => {
    onOpenStatistikForm();
    return onCloseStatistikForm;
  }, [onOpenStatistikForm, onCloseStatistikForm]);
  return (
    <div className="text-center">
      <div className="mt-6 flex justify-between">
        <ResetButton />
        <div className="flex gap-4">
          <Link to="/combinations" className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </Link>
          <Link to="/summary" className="px-4 py-2 bg-blue-600 text-white rounded">
            {t('next')}
          </Link>
        </div>
      </div>
    </div>
  );
};
