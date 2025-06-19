export interface CalcPayload {
  session: string;
  ideen_file: string;
  kombi_file: string;
  ideen_ids: string[];
  gewichtungen: Record<string, number>;
  lang: string;
}

export interface RankingEntry {
  id: string;
  name: string;
  beschreibung?: string;
  score: number | null;
  details?: Record<string, any>;
}

export async function calculateRanking(
  payload: CalcPayload,
): Promise<RankingEntry[]> {
  const apiBase = import.meta.env.VITE_API_URL;
  const response = await fetch(`${apiBase}/api/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let msg = 'Unknown error';
    try {
      const err = await response.json();
      msg = err.error || err.detail || msg;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const data = await response.json();
  return Array.isArray(data.ranking) ? data.ranking : [];
}

