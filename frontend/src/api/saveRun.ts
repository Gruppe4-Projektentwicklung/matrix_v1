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

export async function saveRun(
  payload: BewertungsLaufPayload,
): Promise<{ run_id?: string; message: string; error?: string }> {
  let response: Response;
  try {
    response = await fetch("/save_run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Network error");
  }

  if (!response.ok) {
    let msg = "Unknown error";
    try {
      const err = await response.json();
      msg = err.error || err.detail || msg;
    } catch {
      // ignore json parse errors
    }
    throw new Error(msg);
  }

  return response.json();
}
