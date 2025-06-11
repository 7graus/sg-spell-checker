import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ClearButtonProps {
  handleClear: () => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ handleClear }) => {
  const { t } = useTranslation();
  return (
    <button
      className="w-[36px] h-[36px] cursor-pointer hover:bg-gray-bg transition-all duration-300 flex items-center justify-center rounded-full border border-gray-border-secondary"
      onClick={handleClear}
      aria-label={t('general.clear')}
      tabIndex={0}
    >
      <X size={17} className="text-gray-text-secondary" />
    </button>
  );
};
