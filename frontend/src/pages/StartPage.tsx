import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { markSessionStarted } from '../utils/session';
import pageDescriptions from '../pageDescriptions';

interface Props {
  dev2Mode: boolean;
  onStart: (dev2: boolean) => void;
}
export const StartPage = ({ dev2Mode, onStart }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleStart = () => {
    markSessionStarted();
    onStart(dev2Mode);
    navigate('/select-data');
  };
  return (
    <div className="w-[65%] max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10 my-10 text-center min-h-[80vh]">
      <h1 className="text-4xl font-bold mb-8 text-[#1d2c5b] tracking-tight drop-shadow">
        {t('title')}
      </h1>
      <p className="mb-6 text-gray-700">{pageDescriptions.startIntro}</p>
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {t('start')}
        </button>
      </div>
  
    </div>
  );
};
