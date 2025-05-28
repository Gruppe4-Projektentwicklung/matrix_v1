import React, { useState } from "react";

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

import { saveRun } from "../api/saveRun";
import type { BewertungsLaufPayload as SaveRunPayload } from "../api/saveRun";

type Props = {
  open: boolean;
  onClose: () => void;
  payload: Omit<BewertungsLaufPayload, "tester" | "userData">;
  onSaveSuccess: (result: { run_id?: string; message: string; error?: string }) => void;
};

export const StatistikForm: React.FC<Props> = ({
  open,
  onClose,
  payload,
  onSaveSuccess,
}) => {
  const [alter, setAlter] = useState("");
  const [geschlecht, setGeschlecht] = useState("");
  const [branche, setBranche] = useState("");
  const [berufsrolle, setBerufsrolle] = useState("");
  const [tester, setTester] = useState(false);
  const [sending, setSending] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setFehler(null);

    const fullPayload: BewertungsLaufPayload = {
      ...payload,
      tester,
      userData: tester
        ? undefined
        : {
            alter,
            geschlecht,
            branche,
            berufsrolle,
          },
      zeitstempel: new Date().toISOString(),
    };

    try {
      const result = await saveRun(fullPayload);
      onSaveSuccess(result);
    } catch (err) {
      setFehler("Fehler beim Senden der Bewertung. Bitte erneut versuchen.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
          aria-label="Schließen"
        >
          ×
        </button>
        <h2 className="font-bold text-lg mb-2">Bitte helfen Sie uns, die Statistik zu verbessern</h2>
        <p className="text-gray-700 text-sm mb-4">
          Ihre Angaben sind <b>freiwillig</b>, anonym und werden nur für Auswertungen gespeichert. Sie können auch als App-Tester fortfahren, dann wird <b>gar nichts</b> gespeichert.
        </p>

        <label className="block mb-2 font-semibold">
          <input
            type="checkbox"
            checked={tester}
            onChange={() => setTester((v) => !v)}
            className="mr-2"
          />
          App-Tester: Keine Daten speichern und keine Angaben machen
        </label>

        {!tester && (
          <div className="space-y-2 mb-3">
            <input
              className="border p-2 rounded w-full"
              type="text"
              placeholder="Alter"
              value={alter}
              onChange={(e) => setAlter(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full"
              type="text"
              placeholder="Geschlecht"
              value={geschlecht}
              onChange={(e) => setGeschlecht(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full"
              type="text"
              placeholder="Branche"
              value={branche}
              onChange={(e) => setBranche(e.target.value)}
            />
            <input
              className="border p-2 rounded w-full"
              type="text"
              placeholder="Berufsrolle"
              value={berufsrolle}
              onChange={(e) => setBerufsrolle(e.target.value)}
            />
          </div>
        )}

        {fehler && <div className="text-red-600 text-sm mb-2">{fehler}</div>}

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={sending}
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          >
            {tester ? "Ohne Angaben abschicken" : "Bewertung speichern"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="bg-gray-200 rounded px-4 py-2"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatistikForm;
