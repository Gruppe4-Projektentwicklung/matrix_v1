import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="text-center text-sm py-4">
      <p className="mb-2">{t('footerText')}</p>
      <Link to="/impressum" className="text-blue-600 underline">
        {t('footerImpressum')}
      </Link>
    </footer>
  );
};

export default Footer;
