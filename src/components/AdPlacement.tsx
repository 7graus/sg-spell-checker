import React from 'react';
import { useTranslation } from 'react-i18next';

interface AdPlacementProps {
  type: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ type }) => {
  const { t } = useTranslation();

  return (
    <div className="relative bg-gray-50 rounded-lg p-6 mb-6">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-base font-medium text-gray-900">
            {t('preloader.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t('preloader.description')}
          </p>
        </div>
      </div>
      <div id={type} className="relative z-10 min-h-[250px]" />
    </div>
  );
}; 