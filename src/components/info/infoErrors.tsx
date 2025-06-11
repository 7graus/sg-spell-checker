import React from 'react';
import { useTranslation } from 'react-i18next';
import { Results } from '../../types';

interface InfoErrorsProps {
  resultErrors: Results;
  type: 'spelling' | 'grammar';
}

export const InfoErrors: React.FC<InfoErrorsProps> = ({ resultErrors, type }) => {
  const { t } = useTranslation();

  const getColor = (type: 'spelling' | 'grammar') => {
    if (type === 'spelling') return 'bg-[#D93025]';
    if (type === 'grammar') return 'bg-[#9747FF]';
  };

  return (
    <div>
      <div className={`${getColor(type)} h-5 w-5 text-white text-sm rounded-[4px] inline-flex items-center justify-center mr-1`}>
        {resultErrors.errors.filter((error) => error.type === type).length}
      </div>
      <span className="text-sm text-gray-text-secondary">{t(`info.errors.${type}`)}</span>
    </div>
  );
};
