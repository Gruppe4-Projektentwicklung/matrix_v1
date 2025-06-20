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
    <footer className="text-sm py-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between">
      <div className="flex items-center">
        <p className="mb-2 sm:mb-0 sm:mr-2">{t('footerText')}</p>
        <Link to="/impressum" className="text-blue-600 underline mr-2">
          {t('footerImpressum')}
        </Link>
      </div>
      {runCount !== null && (

        <div className="text-xs text-gray-600 ml-4">

        <div className="mt-2 sm:mt-0 sm:ml-auto text-xs text-gray-600">

          {t('calculationCounter', { count: runCount })}
        </div>
      )}
    </footer>
  );
};

export default Footer;
