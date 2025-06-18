import { CollectionSelectorIdeas } from '../components/CollectionSelectorIdeas';
import { CollectionSelectorKombis } from '../components/CollectionSelectorKombis';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Props {
  aktuelleIdeensammlung: string;
  aktuelleKombiSammlung: string;
  onIdeenSammlungChange: (name: string) => void;
  onKombiSammlungChange: (name: string) => void;
  onIdeenUpload: (file: File) => void;
  onKombiUpload: (file: File) => void;
}

export const UploadPage = ({
  aktuelleIdeensammlung,
  aktuelleKombiSammlung,
  onIdeenSammlungChange,
  onKombiSammlungChange,
  onIdeenUpload,
  onKombiUpload,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div>
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
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/config')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {t('next')}
        </button>
      </div>
    </div>
  );
};
