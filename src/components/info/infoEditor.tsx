import React from 'react';
import { useTranslation } from 'react-i18next';

interface InfoEditorProps {
  currentNumber: number;
  maxNumber: number;
  warningUsageVisible: boolean;
}

export const InfoEditor: React.FC<InfoEditorProps> = ({
  currentNumber,
  maxNumber,
  warningUsageVisible,
}) => {
  const { t } = useTranslation();



  return (
    <div
    className={`text-xs relative ${currentNumber >= maxNumber ? 'text-red-danger-text' : 'text-gray-text-secondary'}`}
  >
    {t('general.usage')}: {currentNumber}/{maxNumber}
    {currentNumber >= maxNumber && warningUsageVisible && (
      <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-red-danger-border rounded-sm absolute top-[-17px] left-1/2 -translate-x-1/2" />
    )}
  </div>
  );
}; 