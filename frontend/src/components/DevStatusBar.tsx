import React from 'react';
import { getPageStatus, getSaveRunStatus } from '../utils/session';

const pages = ['select-data', 'idea', 'combination', 'personal', 'summary'];

export const DevStatusBar: React.FC = () => {
  const [status, setStatus] = React.useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = React.useState(getSaveRunStatus());

  React.useEffect(() => {
    const updateStatus = () => setStatus(getPageStatus());
    const updateSave = () => setSaveStatus(getSaveRunStatus());
    updateStatus();
    updateSave();
    window.addEventListener('pageStatusUpdated', updateStatus);
    window.addEventListener('saveRunStatusUpdated', updateSave);
    return () => {
      window.removeEventListener('pageStatusUpdated', updateStatus);
      window.removeEventListener('saveRunStatusUpdated', updateSave);
    };
  }, []);

  return (
    <div className="bg-gray-100 border-b border-gray-300 text-xs">
      <table className="mx-auto">
        <thead>
          <tr>
            <th className="px-2">Site</th>
            {pages.map((p) => (
              <th key={p} className="px-2 border">
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2">Status</td>
            {pages.map((p) => {
              const val = status[p] || 'nok';
              const color = val === 'ok' ? 'text-green-600' : 'text-red-600';
              return (
                <td key={p} className="px-2 border text-center">
                  <span className={color}>{val}</span>
                </td>
              );
            })}
          </tr>
          <tr>
            <td className="px-2">SaveRun</td>
            <td colSpan={pages.length} className="px-2 border text-center">
              <span>{saveStatus}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default DevStatusBar;
