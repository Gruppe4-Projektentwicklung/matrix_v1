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
  const { t, i18n } = useTranslation();
  const backendUrl = import.meta.env.VITE_API_URL;
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

  const handleInstructionDownload = () => {
    window.open(
      `${backendUrl}/download_instruction?lang=${i18n.language}`,
      '_blank',
    );
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


        <div className="bg-[#f8fafc] p-6 rounded-xl shadow mt-6 flex flex-col items-center justify-center max-w-prose mx-auto">
          <Button
            variant="outlined"
            sx={{ px: 1.5, py: 0.5, mb: 2, mt: 1, whiteSpace: 'nowrap' }}
            onClick={handleInstructionDownload}
            size="small"
          >
            {t('downloadInstructions')}
          </Button>
          <p className="text-sm text-gray-700" style={{ textAlign: 'center' }}>
            {t('selectDataInfo')}
          </p>
        </div>
      </Box>
      </Box>
    </PageContainer>
  );
};
