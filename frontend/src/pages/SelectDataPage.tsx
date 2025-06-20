import React, { useEffect } from 'react';
import { CollectionSelectorIdeas } from '../components/CollectionSelectorIdeas';
import { CollectionSelectorKombis } from '../components/CollectionSelectorKombis';
import { useNavigate } from 'react-router-dom';
import { ResetButton } from '../components/ResetButton';
import { useTranslation } from 'react-i18next';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';
import { Box, Button } from '@mui/material';

interface Props {
  aktuelleIdeensammlung: string;
  aktuelleKombiSammlung: string;
  onIdeenSammlungChange: (name: string) => void;
  onKombiSammlungChange: (name: string) => void;
  onIdeenUpload: (file: File) => void;
  onKombiUpload: (file: File) => void;
}

export const SelectDataPage = ({
  aktuelleIdeensammlung,
  aktuelleKombiSammlung,
  onIdeenSammlungChange,
  onKombiSammlungChange,
  onIdeenUpload,
  onKombiUpload,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasSessionStarted()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  return (
    <Box>
      <Box sx={{ mt: 4, mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <ResetButton />
        <Button
          variant="contained"
          onClick={() => {
            logEvent(getSessionId(), 'select-data', {
              ideenSammlung: aktuelleIdeensammlung,
              kombiSammlung: aktuelleKombiSammlung,
            });
            setPageStatus('select-data', 'ok');
            navigate('/ideas');
          }}
        >
          {t('next')}
        </Button>
      </Box>
      <CollectionSelectorIdeas
        aktuelleSammlungName={aktuelleIdeensammlung}
        onSammlungChange={onIdeenSammlungChange}
        onUpload={onIdeenUpload}
      />
      <CollectionSelectorKombis
        aktuelleSammlungName={aktuelleKombiSammlung}
        onSammlungChange={onKombiSammlungChange}
        onUpload={onKombiUpload}
      />
    </Box>
  );
};
