import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';
import { StatistikForm } from '../components/StatistikForm';
import { SaveRunSuccess } from '../components/SaveRunSuccess';
import { Box, Button, Typography } from '@mui/material';
import { PageContainer } from '../components/PageContainer';

import type { BewertungsLaufPayload, UserData, SaveRunResponse } from '../api/saveRun';


interface Props {
  tester: boolean;
  payload: Omit<BewertungsLaufPayload, 'tester' | 'userData'>;
  onSaveSuccess?: (result: SaveRunResponse) => void;
  onUserDataSaved: (data: UserData | undefined) => void;
}

export const PersonalDataPage = ({
  tester,
  payload,
  onSaveSuccess,
  onUserDataSaved,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formOpen, setFormOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveRunId, setSaveRunId] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSaveSuccess = (result: SaveRunResponse) => {
    setSaved(true);
    setFormOpen(false);
    setSaveMessage(result.message);
    setSaveRunId(result.run_id);
    logEvent(getSessionId(), 'personal-data', result);
    if (!result.error && result.status === 'ok') {
      setPageStatus('personal', 'ok');
    }
    if (onSaveSuccess) onSaveSuccess(result);
  };

  const handleNext = () => {
    if (!tester && !saved) {
      alert(t('fieldsRequired'));
      setFormOpen(true);
      return;
    }
    logEvent(getSessionId(), 'personal-next', { saved });
    if (saved || tester) {
      setPageStatus('personal', 'ok');
    }
    navigate('/summary');
  };

  return (
    <PageContainer>
      <Box textAlign="center">
      {tester ? (
        <Typography mb={3}>{t('appTesterMode')}</Typography>
      ) : (
        <>
          {formOpen && (
            <Box mb={3} display="flex" justifyContent="center">
              <StatistikForm
                open={true}
                inline
                tester={tester}
                payload={payload}
                onSaveSuccess={handleSaveSuccess}
                onUserDataSaved={onUserDataSaved}
              />
            </Box>
          )}
          {!formOpen && saved && (
            <SaveRunSuccess
              open={true}
              inline
              message={saveMessage}
              runId={saveRunId}
              isTester={tester}
              onEdit={() => {
                setFormOpen(true);
                setSaved(false);
              }}
            />
          )}
        </>
      )}
           <Box sx={{ mt: 4, mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ResetButton />
          <Button variant="outlined" onClick={() => navigate('/combinations')}>
            {t('back')}
          </Button>
        </Box>
        <Button variant="contained" onClick={handleNext}>
          {t('next')}
        </Button>
      </Box>
    </Box> {/* <---- DAS FEHLTE! */}
    </PageContainer>
  );
};

