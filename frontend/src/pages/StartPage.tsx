import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { markSessionStarted } from '../utils/session';

export const StartPage = () => {
  const { t } = useTranslation();
  useEffect(() => {
    markSessionStarted();
  }, []);
  return (
    <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10 text-center">
      <h1 className="text-4xl font-bold mb-8 text-[#1d2c5b] tracking-tight drop-shadow">
        {t('title')}
      </h1>
      <p className="mb-6 text-gray-700">{t('introText')}</p>
      <Link to="/select-data" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">
        {t('start')}
      </Link>
  
    </div>
  );
};
