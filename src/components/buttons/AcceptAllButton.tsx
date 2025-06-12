import React from 'react';
import { getButtonStyles } from '../../helpers/buttonStyles';
import { useTranslation } from 'react-i18next';
import { CheckIcon } from 'lucide-react';

interface AcceptAllButtonProps {
  isDisabled: boolean;
  handleAcceptAll: () => void;
  successMessage?: boolean;
}

export const AcceptAllButton: React.FC<AcceptAllButtonProps> = ({ isDisabled, handleAcceptAll, successMessage = true }) => {
  const buttonStyles = getButtonStyles();
  const { t } = useTranslation();

  if (successMessage) {
    return (
      <div className="text-[#008F7C] flex items-center gap-2">
        <div className="bg-[#008F7C] rounded-full p-1">
          <CheckIcon className="w-3 h-3 text-white" />
        </div> 
        <div className="text-base font-bold">
          {t('editor.acceptAllSuccess')}
        </div>
      </div>
    );
  }

  return (
    <button
    type="button"
    className={`relative ${buttonStyles.cta.base} ${buttonStyles.cta.green} ${
      isDisabled ? buttonStyles.cta.disabled : buttonStyles.cta.enabledGreen
    }`}
    onClick={handleAcceptAll}
    disabled={isDisabled}
  >
    <div className={`${buttonStyles.cta.text}`}>{t('editor.acceptAll')}</div>
  </button>
  );
};
