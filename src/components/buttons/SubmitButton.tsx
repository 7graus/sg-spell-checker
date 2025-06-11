import React from 'react';
import { getButtonStyles } from '../../helpers/buttonStyles';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SubmitButtonProps {
  showIcon: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
  loading: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ showIcon, isDisabled, onSubmit, loading }) => {
  const buttonStyles = getButtonStyles();
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className={`relative ${buttonStyles.cta.base} ${buttonStyles.cta.blue} ${
        isDisabled ? buttonStyles.cta.disabled : buttonStyles.cta.enabled
      }`}
      onClick={onSubmit}
      disabled={isDisabled}
    >
      <div className={`${buttonStyles.cta.text}`}>{loading ? t('loading') : t('submit')}</div>
      {!showIcon && <ArrowRight className={`${buttonStyles.cta.text} w-5 h-5 ml-2`} />}
    </button>
  );
};
