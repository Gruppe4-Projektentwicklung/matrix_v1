import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  onOpenStatistikForm: () => void;
}

export const PersonalDataPage = ({ onOpenStatistikForm }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <button
        onClick={onOpenStatistikForm}
        className="px-4 py-2 bg-gray-200 rounded mb-4"
      >
        {t('optionDataReleaseOpen')}
      </button>
      <div className="mt-6 flex justify-between">
        <Link to="/combinations" className="px-4 py-2 bg-gray-300 rounded">
          {t('back')}
        </Link>
        <Link to="/summary" className="px-4 py-2 bg-[#1d2c5b] text-white rounded">
          {t('next')}
        </Link>
      </div>
    </div>
  );
};
