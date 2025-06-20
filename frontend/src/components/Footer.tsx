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
    <footer className="text-sm py-4 flex flex-col sm:flex-row items-center justify-center">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <p className="mb-2 sm:mb-0">
          {t('footerText')} {new Date().getFullYear()}
        </p>
        <Link to="/impressum" className="text-blue-600 underline">
          {t('footerImpressum')}
        </Link>
        {runCount !== null && (
          <span className="text-xs text-gray-600">
            {t('calculationCounter', { count: runCount })}
          </span>
        )}
      </div>
    </footer>
  );
};

export default Footer;
