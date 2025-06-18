import React from 'react';
import { Ranking } from '../components/Ranking';
import { ExportRankingButton } from '../components/ExportRankingButton';

interface Props {
  rankingEintraege: any[];
}

export const ResultsPage = ({ rankingEintraege }: Props) => (
  <div>
    <Ranking eintraege={rankingEintraege} />
    <div className="mt-6 flex flex-col items-center gap-4">
      <ExportRankingButton eintraege={rankingEintraege} />
    </div>
  </div>
);
