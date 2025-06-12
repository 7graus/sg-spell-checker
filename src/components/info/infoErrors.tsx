import React from 'react';
import { useTranslation } from 'react-i18next';

interface InfoErrorsProps {
  quantity: number;
  type: 'spelling' | 'grammar';
}

export const InfoErrors: React.FC<InfoErrorsProps> = ({ quantity, type }) => {
  const { t } = useTranslation();

  const getColor = (type: 'spelling' | 'grammar') => {
    if (type === 'spelling') return 'bg-[#D93025]';
    if (type === 'grammar') return 'bg-[#9747FF]';
  };

  return (
    <div>
      <div className={`${getColor(type)} h-5 w-5 text-white text-sm rounded-[4px] inline-flex items-center justify-center mr-1`}>
        {quantity}
      </div>
      <span className="text-sm text-gray-text-secondary">{t(`info.errors.${type}`)}</span>
    </div>
  );
};
