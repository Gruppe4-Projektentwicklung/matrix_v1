// matrix_v1/frontend/api/saveRun.ts

export interface BewertungsLaufPayload {
  tester: boolean; // true, wenn Tester-Modus aktiviert
  userData?: {
    alter?: string;
    geschlecht?: string;
    branche?: string;
    berufsrolle?: string;
    [key: string]: any;
  };
  ideenSammlung: string; // Dateiname oder ID der verwendeten Ideensammlung
  kombiSammlung: string; // Dateiname oder ID der verwendeten Kombisammlung
  gewaehlteIdeen: string[]; // IDs der aktiven Ideen
  deaktivierteIdeen: string[]; // IDs der deaktivierten Ideen
  gewichtungen: Record<string, number>; // Kombi-ID -> Gewichtung (0-5)
  ergebnisRanking: any[]; // Die berechnete Ranking-Liste (z.B. [{id, score, ...}, ...])
  zeitstempel?: string;
  // ...weitere gewünschte Felder
}

export async function saveRun(payload: BewertungsLaufPayload): Promise<{run_id?: string, message: string, error?: string}> {
  const response = await fetch("/save_run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  return data;
}
