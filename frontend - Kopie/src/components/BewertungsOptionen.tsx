import React from "react";

type BewertungsOptionenProps = {
  runde1: boolean;
  runde2: boolean;
  appTester: boolean;
  datenfreigabe: "offen" | "anonym" | "keine";
  onChange: (field: string, value: any) => void;
};

export const BewertungsOptionen: React.FC<BewertungsOptionenProps> = ({
  runde1,
  runde2,
  appTester,
  datenfreigabe,
  onChange,
}) => {
  return (
    <div className="border rounded-xl p-4 space-y-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold">Bewertungsoptionen</h2>

      <label className="block">
        <input
          type="checkbox"
          checked={runde1}
          onChange={(e) => onChange("runde1", e.target.checked)}
          className="mr-2"
        />
        Runde 1 berücksichtigen
      </label>

      <label className="block">
        <input
          type="checkbox"
          checked={runde2}
          onChange={(e) => onChange("runde2", e.target.checked)}
          className="mr-2"
        />
        Runde 2 berücksichtigen
      </label>

      <label className="block">
        <input
          type="checkbox"
          checked={appTester}
          onChange={(e) => onChange("appTester", e.target.checked)}
          className="mr-2"
        />
        App-Tester (kein Logging, keine Datenabfrage)
      </label>

      <div>
        <label className="block mb-1 font-medium">Datenfreigabe für Statistiken</label>
        <select
          value={datenfreigabe}
          onChange={(e) => onChange("datenfreigabe", e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="offen">Daten eingeben (anonym)</option>
          <option value="anonym">Nur Nutzungsverhalten speichern</option>
          <option value="keine">Gar nichts speichern</option>
        </select>
      </div>
    </div>
  );
};
