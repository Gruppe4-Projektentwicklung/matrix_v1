import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getRunCount } from "../api/getRunCount";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [runCount, setRunCount] = useState<number | null>(null);

  useEffect(() => {
    getRunCount()
      .then((count) => setRunCount(count))
      .catch(() => setRunCount(null));
  }, []);

  return (
    <footer className="text-sm py-4 flex items-center justify-between flex-wrap">
      <div className="flex items-center flex-wrap gap-2">
        <p>{t('footerText')}</p>
        <Link to="/impressum" className="text-blue-600 underline">
          {t('footerImpressum')}
        </Link>
      </div>
      {runCount !== null && (
        <div className="text-xs text-gray-600 ml-4">
          {t('calculationCounter', { count: runCount })}
        </div>
      )}
    </footer>
  );
};

export default Footer;
