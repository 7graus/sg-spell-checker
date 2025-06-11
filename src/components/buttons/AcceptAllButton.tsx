import React from 'react';
import { getButtonStyles } from '../../helpers/buttonStyles';
import { useTranslation } from 'react-i18next';

interface AcceptAllButtonProps {
  isDisabled: boolean;
  handleAcceptAll: () => void;
}

export const AcceptAllButton: React.FC<AcceptAllButtonProps> = ({ isDisabled, handleAcceptAll }) => {
  const buttonStyles = getButtonStyles();
  const { t } = useTranslation();
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
