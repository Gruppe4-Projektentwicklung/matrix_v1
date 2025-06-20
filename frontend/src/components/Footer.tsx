import React from "react";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => (
  <footer className="text-center text-sm py-4">
    <p className="mb-2">
      Team Sustainabuild (Gruppe4 Projektentwicklung) – alle Rechte vorbehalten ©
    </p>
    <Link to="/impressum" className="text-blue-600 underline">
      Impressum/Kontakt
    </Link>
  </footer>
);

export default Footer;
