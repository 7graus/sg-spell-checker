import React from 'react';
import { useTranslation } from 'react-i18next';
import { LockOpen, X } from 'lucide-react';
import { getButtonStyles } from '../helpers/buttonStyles';
import { useResponsive } from '../hooks/useResponsive';
import { BrandLogoPro } from './BrandLogoPro';

interface ConversionPopupProModeProps {
  lastSelectedOption: {
    value: string;
    type: string;
    pro: boolean;
  };
  onClose?: () => void;
}

export const ConversionPopupProMode: React.FC<ConversionPopupProModeProps> = ({
  lastSelectedOption,
  onClose
}) => {
  const { t } = useTranslation();
  const buttonStyles = getButtonStyles();

  const { isMobile } = useResponsive();

  const renderContent = () => {
    return (
      <div className="relative before:absolute before:inset-0 before:bg-gradient-border before:rounded-2xl before:z-[1] before:content-[''] p-1.5 shadow-xl rounded-2xl w-full before:opacity-70">
        <div className="rounded-xl p-4 z-[2] bg-white relative">
          <div className="font-barlow font-bold text-lg antialiased w-full mb-4">
            {lastSelectedOption.type === 'writtingStyle'
              ? t(
                  `convertionSite.popupProWarning.${lastSelectedOption.type}.${lastSelectedOption.value}.title`
                )
              : t(`convertionSite.popupProWarning.${lastSelectedOption.type}.title`)}
          </div>
          <div className="text-base w-full mb-4">
            {lastSelectedOption.type === 'writtingStyle'
              ? t(
                  `convertionSite.popupProWarning.${lastSelectedOption.type}.${lastSelectedOption.value}.text`
                )
              : t(`convertionSite.popupProWarning.${lastSelectedOption.type}.text`)}
          </div>
          <div className="text-base w-full mb-4">{t('convertionSite.popupProWarning.text')}</div>
          <div className="flex justify-center">
            <a
              href={t('convertionSite.popupProWarning.cta.href')}
              data-track-click="spell-checker-texts-popup-feat-pro"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(
                  new CustomEvent('sg-tool-click', {
                    detail: {
                      value: `cta_pro_click_reescrever_popup_feat_pro`,
                    },
                    composed: true,
                    bubbles: true,
                  })
                );
                window.location.href = t('convertionSite.popupProWarning.cta.href');
              }}
              className={`bg-blue border-2 px-2 md:px-4 pt-2 pb-2.5 rounded-full flex font-bold antialiased text-base md:text-lg transition-all duration-200 leading-none group w-max group items-center ${buttonStyles.cta.enabled} ${buttonStyles.cta.shine}`}
            >
              <LockOpen className="flex-shrink-0 w-5 h-5 mr-2" />
              {t('convertionSite.popupProWarning.cta.text')}
            </a>
          </div>
        </div>
      </div>
    );
  };

  return isMobile ? (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
      <div className="fixed z-50 max-md:w-full md:min-w-[650px] max-w-[900px] md:min-h-[200px] max-md:bottom-0 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-xl md:rounded-xl py-4 px-2 w-96">
        <button
          onClick={onClose}
          className="w-[36px] h-[36px] absolute top-3 right-3 cursor-pointer"
        >
          <X size={17} className="text-gray-text-secondary right-1/2 translate-x-1/2" />
        </button>

        <div className="flex justify-center mb-4">
          <BrandLogoPro className="mx-auto" />
        </div>

        {renderContent()}
      </div>
    </>
  ) : (
    renderContent()
  );
};
