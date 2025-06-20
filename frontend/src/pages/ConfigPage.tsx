import React from 'react';
import { IdeenSelector } from '../components/IdeenSelector';
import { BewertungsOptionen } from '../components/BewertungsOptionen';
import { WeightingSelector } from '../components/WeightingSelector';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../components/PageContainer';

interface Props {
  ideen: any[];
  sprache: 'de' | 'en' | 'fr';
  attributeMeta: Record<string, { name: string; unit: string; description?: string }>;
  runde1: boolean;
  runde2: boolean;
  appTester: boolean;
  datenfreigabe: 'offen' | 'anonym' | 'keine';
  gewichtungen: any[];
  onIdeenUpdate: (ideen: any[]) => void;
  onBewertungsOptionenChange: (field: string, value: any) => void;
  onGewichtungenUpdate: (g: any[]) => void;
  showRoundOptions?: boolean;
  showTesterOption?: boolean;
  onOpenStatistikForm?: (inline?: boolean) => void;
}

export const ConfigPage = ({
  ideen,
  sprache,
  attributeMeta,
  runde1,
  runde2,
  appTester,
  datenfreigabe,
  gewichtungen,
  onIdeenUpdate,
  onBewertungsOptionenChange,
  onGewichtungenUpdate,
  showRoundOptions = true,
  showTesterOption = true,
  onOpenStatistikForm = () => {},
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <PageContainer>
      <div>
      <IdeenSelector ideen={ideen} sprache={sprache} attributeMeta={attributeMeta} onUpdate={onIdeenUpdate} />
      <div className="bg-[#f8fafc] p-6 rounded-xl shadow mb-8">
        <BewertungsOptionen
          runde1={runde1}
          runde2={runde2}
          appTester={appTester}
          datenfreigabe={datenfreigabe}
          onChange={onBewertungsOptionenChange}
          showRoundOptions={showRoundOptions}
          showTesterOption={showTesterOption}
        />
      </div>
      <WeightingSelector kombinationen={gewichtungen} onUpdate={onGewichtungenUpdate} />
      <div className="mt-6 text-center">
        <button
          onClick={() => {
            onOpenStatistikForm && onOpenStatistikForm(false);
            navigate('/results');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {t('next')}
        </button>
      </div>
      </div>
    </PageContainer>
  );
};
