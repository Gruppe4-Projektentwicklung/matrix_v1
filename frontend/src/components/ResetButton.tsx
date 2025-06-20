import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { clearSession } from '../utils/session';
import { resetSessionId } from '../utils/session';



export const ResetButton: React.FC = () => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (!window.confirm(t('resetWarning'))) return;

    clearSession();

    resetSessionId();

    window.location.href = '/';
  };

  return (
    <Button variant="outlined" color="inherit" onClick={handleClick} size="small">
      {t('reset')}
    </Button>
  );
};

export default ResetButton;
