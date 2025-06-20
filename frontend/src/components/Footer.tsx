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
    <footer className="w-full text-sm py-4">
      <div
        className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left"
      >
        <p>
          {t('footerText')} {new Date().getFullYear()}
        </p>
        <Link to="/impressum" className="text-blue-600 underline">
          {t('footerImpressum')}
        </Link>
        {runCount !== null && (
          <span className="text-xs text-gray-600 sm:text-right">
            {t('calculationCounter', { count: runCount })}
          </span>
        )}
      </div>
    </footer>
  );
};

export default Footer;
