import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const StartPage = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-5xl w-full mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10 text-center">
      <h1 className="text-4xl font-bold mb-8 text-[#1d2c5b] tracking-tight drop-shadow">
        {t('title')}
      </h1>
      <Link to="/upload" className="mt-4 inline-block px-4 py-2 bg-[#1d2c5b] text-white rounded">
        Start
      </Link>
    </div>
  );
};
