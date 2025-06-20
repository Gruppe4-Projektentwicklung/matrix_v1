import React from 'react';
import { PageContainer } from '../components/PageContainer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useTranslation } from 'react-i18next';

export const ImpressumPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <Typography variant="h5" component="h1" mb={4} textAlign="center">
        {t('impressumTitle')}
      </Typography>
      <Box className="space-y-4" sx={{ '& p': { textAlign: 'justify' } }}>
        <Typography fontWeight="bold">{t('impressumResponsibleHeader')}</Typography>
        <Typography component="div" dangerouslySetInnerHTML={{ __html: t('impressumResponsibleContent') }} />
        <Typography component="div" dangerouslySetInnerHTML={{ __html: t('impressumEmail') }} />

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold">{t('impressumGroupHeader')}</Typography>
        <Typography component="div" dangerouslySetInnerHTML={{ __html: t('impressumGroupContent') }} />

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold">{t('impressumRStVHeader')}</Typography>
        <Typography component="div">{t('impressumRStVContent')}</Typography>

        <Divider sx={{ my: 2 }} />

        <Box className="p-4 bg-gray-100 rounded" component="div">
          <Typography fontWeight="bold" mb={1}>{t('impressumNoticeTitle')}</Typography>
          <Typography component="div">{t('impressumNoticeContent')}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography component="div">{t('impressumDisclaimer1')}</Typography>
        <Typography component="div">{t('impressumDisclaimer2')}</Typography>
        <Typography component="div">{t('impressumDisclaimer3')}</Typography>
      </Box>
    </PageContainer>
  );
};

export default ImpressumPage;
