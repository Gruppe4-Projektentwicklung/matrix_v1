import React, { useEffect } from "react";

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
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50`}>
      <div
        className={`px-5 py-3 rounded-xl shadow-lg text-white font-semibold ${colors[type]} flex items-center space-x-2`}
      >
        {type === "success" && <span>✅</span>}
        {type === "error" && <span>❌</span>}
        {type === "info" && <span>ℹ️</span>}
        <span>{message}</span>
        <button onClick={onClose} className="ml-2 text-xl" aria-label="Schließen">
          ×
        </button>
      </div>
    </div>
  );
};
