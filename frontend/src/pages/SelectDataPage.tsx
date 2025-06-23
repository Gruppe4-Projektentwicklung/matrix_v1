import React, { useEffect } from 'react';
import { CollectionSelectorIdeas } from '../components/CollectionSelectorIdeas';
import { CollectionSelectorKombis } from '../components/CollectionSelectorKombis';
import { useNavigate } from 'react-router-dom';
import { ResetButton } from '../components/ResetButton';
import { useTranslation } from 'react-i18next';
import { hasSessionStarted, getSessionId, setPageStatus } from '../utils/session';
import { logEvent } from '../api/logEvent';
import { Box, Button, Divider } from '@mui/material';
import { PageContainer } from '../components/PageContainer';

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

  const handleWeiter = () => {
    logEvent(getSessionId(), 'select-data', {
      ideenSammlung: aktuelleIdeensammlung,
      kombiSammlung: aktuelleKombiSammlung,
    });
    setPageStatus('select-data', 'ok');
    navigate('/ideas');
  };

  return (
    <PageContainer>
      <Box>
      <Box sx={{ mt: 4, mb: 3, display: 'flex', justifyContent: 'space-between' }}>
        <ResetButton />
        <Button variant="contained" onClick={handleWeiter}>
          {t('next')}
        </Button>
      </Box>

      <h2 className="text-lg font-semibold text-center mb-4">
        {t('masterDataSelectionTitle')}
      </h2>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <Box mb={6} sx={{ width: '100%' }}>
          <CollectionSelectorIdeas
            aktuelleSammlungName={aktuelleIdeensammlung}
            onSammlungChange={onIdeenSammlungChange}
            onUpload={onIdeenUpload}
          />
        </Box>

        <Box mb={6} sx={{ width: '100%' }}>
          <CollectionSelectorKombis
            aktuelleSammlungName={aktuelleKombiSammlung}
            onSammlungChange={onKombiSammlungChange}
            onUpload={onKombiUpload}
          />
        </Box>

        <Divider sx={{ my: 6, width: '100%' }} />


        <div className="bg-[#f8fafc] p-6 rounded-xl shadow mt-6 flex items-center justify-center max-w-prose mx-auto">
          <p
            className="text-sm text-gray-700 text-left"
            dangerouslySetInnerHTML={{ __html: t('selectDataInfo') }}
          />
        </div>
      </Box>
      </Box>
    </PageContainer>
  );
};
