import React from 'react';
import { WeightingSelector } from '../components/WeightingSelector';
import { BewertungsOptionen } from '../components/BewertungsOptionen';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResetButton } from '../components/ResetButton';

interface Props {
  gewichtungen: any[];
  runde1: boolean;
  runde2: boolean;
  appTester: boolean;
  datenfreigabe: 'offen' | 'anonym' | 'keine';
  onGewichtungenUpdate: (g: any[]) => void;
  onOptionsChange: (field: string, value: any) => void;
}

export const CombinationSelectionPage = ({
  gewichtungen,
  runde1,
  runde2,
  appTester,
  datenfreigabe,
  onGewichtungenUpdate,
  onOptionsChange,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      <WeightingSelector kombinationen={gewichtungen} onUpdate={onGewichtungenUpdate} />
      <div className="bg-[#f8fafc] p-6 rounded-xl shadow mb-8">
        <BewertungsOptionen
          runde1={runde1}
          runde2={runde2}
          appTester={appTester}
          datenfreigabe={datenfreigabe}
          onChange={onOptionsChange}
        />
      </div>
      <div className="mt-6 flex justify-between">

        <ResetButton />

        

        <div className="flex gap-4">
          <Link to="/ideas" className="px-4 py-2 bg-gray-300 rounded">
            {t('back')}
          </Link>

      
          <Link to="/personal" className="px-4 py-2 bg-[#1d2c5b] text-white rounded">

            {t('next')}
          </Link>
        </div>
      </div>
    </div>
  );
};
