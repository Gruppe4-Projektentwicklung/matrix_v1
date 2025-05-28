import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  type?: "success" | "error" | "info";
  message: string;
  onClose: () => void;
  duration?: number; // ms
};

export const StatusToast: React.FC<Props> = ({
  open,
  type = "info",
  message,
  onClose,
  duration = 3500,
}) => {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  const colors: Record<string, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  // Optional: Könnte hier noch übersetzte Icons verwenden, falls gewünscht.

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`px-5 py-3 rounded-xl shadow-lg text-white font-semibold ${colors[type]} flex items-center space-x-2`}
      >
        {type === "success" && <span>✅</span>}
        {type === "error" && <span>❌</span>}
        {type === "info" && <span>ℹ️</span>}
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-xl"
          aria-label={t("close")}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default StatusToast;
