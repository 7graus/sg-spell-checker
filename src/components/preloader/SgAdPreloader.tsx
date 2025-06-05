import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SgAdPreloaderProps {
  onComplete: () => void;
  onError: () => void;
}

export const SgAdPreloader: React.FC<SgAdPreloaderProps> = ({
  onComplete,
  onError,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    // Simulating ad preloader behavior
    const timer = setTimeout(() => {
      // Randomly decide whether to complete or error
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        onComplete();
      } else {
        onError();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, onError]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('preloader.title')}
          </h3>
          <p className="text-sm text-gray-500">
            {t('preloader.description')}
          </p>
        </div>
      </div>
    </div>
  );
}; 