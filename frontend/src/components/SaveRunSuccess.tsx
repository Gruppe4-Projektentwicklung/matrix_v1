import React from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  message: string;
  runId?: string;
  onClose?: () => void;
  isTester?: boolean;
  inline?: boolean;
  onEdit?: () => void;
};

export const SaveRunSuccess: React.FC<Props> = ({
  open,
  message,
  runId,
  onClose,
  isTester,
  inline = false,
  onEdit,
}) => {
  const { t } = useTranslation();

  if (!open) return null;
  const content = (
    <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center relative">
      <h2 className="font-bold text-lg mb-2">{t("thankYouForRating")}</h2>
      <div className="mb-3 text-gray-700">{message}</div>
      {runId && !isTester && (
        <div className="text-xs text-gray-500 mb-2">
          {t("evaluationId")}: <span className="font-mono">{runId}</span>
        </div>
      )}
      {isTester && (
        <div className="text-sm text-blue-600">
          <span dangerouslySetInnerHTML={{ __html: t("testerModeNotice") }} />
        </div>
      )}
      {onEdit ? (
        <button
          className="mt-4 bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          onClick={onEdit}
        >
          {t("editData")}
        </button>
      ) : (
        <button
          className="mt-4 bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700"
          onClick={onClose}
        >
          {t("close")}
        </button>
      )}
    </div>
  );

  if (inline) {
    return <div className="flex justify-center">{content}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center text-center">
      {content}
    </div>
  );
};
