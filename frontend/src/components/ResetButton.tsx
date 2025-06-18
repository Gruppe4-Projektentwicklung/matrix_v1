import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { clearSession } from '../utils/session';

import { resetSessionId } from '../utils/session';



export const ResetButton: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {


    clearSession();

    resetSessionId();

    navigate('/');
  };

  return (
    <button onClick={handleClick} className="px-4 py-2 bg-gray-300 rounded">
      {t('reset')}
    </button>
  );
};

export default ResetButton;
