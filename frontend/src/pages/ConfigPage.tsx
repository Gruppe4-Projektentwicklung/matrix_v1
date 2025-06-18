import React from 'react';
import { IdeenSelector } from '../components/IdeenSelector';
import { BewertungsOptionen } from '../components/BewertungsOptionen';
import { WeightingSelector } from '../components/WeightingSelector';
import { Link } from 'react-router-dom';

interface Props {
  ideen: any[];
  sprache: 'de' | 'en' | 'fr';
  runde1: boolean;
  runde2: boolean;
  appTester: boolean;
  datenfreigabe: 'offen' | 'anonym' | 'keine';
  gewichtungen: any[];
  onIdeenUpdate: (ideen: any[]) => void;
  onBewertungsOptionenChange: (field: string, value: any) => void;
  onGewichtungenUpdate: (g: any[]) => void;
  onOpenStatistikForm?: () => void;
}

export const ConfigPage = ({
  ideen,
  sprache,
  runde1,
  runde2,
  appTester,
  datenfreigabe,
  gewichtungen,
  onIdeenUpdate,
  onBewertungsOptionenChange,
  onGewichtungenUpdate,
  onOpenStatistikForm = () => {},
}: Props) => {
  return (
    <div>
      <IdeenSelector ideen={ideen} sprache={sprache} onUpdate={onIdeenUpdate} />
      <div className="bg-[#f8fafc] p-6 rounded-xl shadow mb-8">
        <BewertungsOptionen
          runde1={runde1}
          runde2={runde2}
          appTester={appTester}
          datenfreigabe={datenfreigabe}
          onChange={onBewertungsOptionenChange}
        />
      </div>
      <WeightingSelector kombinationen={gewichtungen} onUpdate={onGewichtungenUpdate} />
      <div className="mt-6 text-center">
        <Link
          to="/results"
          onClick={onOpenStatistikForm}
          className="px-4 py-2 bg-[#1d2c5b] text-white rounded"
        >
          Weiter
        </Link>
      </div>
    </div>
  );
};
