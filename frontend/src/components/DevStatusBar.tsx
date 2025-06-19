import React from 'react';
import { getPageStatus } from '../utils/session';

const pages = ['select-data', 'idea', 'combination', 'personal', 'summary'];

export const DevStatusBar: React.FC = () => {
  const [status, setStatus] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const update = () => setStatus(getPageStatus());
    update();
    window.addEventListener('pageStatusUpdated', update);
    return () => window.removeEventListener('pageStatusUpdated', update);
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
        </tbody>
      </table>
    </div>
  );
};
export default DevStatusBar;
