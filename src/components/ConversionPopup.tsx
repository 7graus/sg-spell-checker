import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, LockOpen } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CircleCheck } from './icons/CircleCheck';
import { getButtonStyles } from '../helpers/buttonStyles';


interface ConversionPopupProps {
  onClose: () => void;
}

export const ConversionPopup: React.FC<ConversionPopupProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();

  const getListItems = () => {
    const items = [];
    for (let i = 1; i <= 4; i++) {
      const key = `convertionSite.popupUsage.list.item${i}`;
      items.push(key);
    }
    return items;
  };

  const listItems = getListItems();
  const buttonStyles = getButtonStyles();

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
      <div className="fixed z-50 max-md:w-full md:min-w-[650px] max-w-[900px] md:min-h-[200px] max-md:bottom-0 md:top-1/2 left-1/2 -translate-x-1/2 md:-translate-y-1/2 bg-white rounded-t-xl md:rounded-xl p-4 w-96">
        <button onClick={onClose} className="absolute top-3 right-3 cursor-pointer">
          <X size={17} className="text-gray-text-secondary" />
        </button>

        <div className="flex justify-center mb-4">
          <BrandLogo className="mx-auto" />
        </div>

        <div className="font-barlow font-bold text-3xl antialiased text-center w-full mb-4">
          {t('convertionSite.popupUsage.title')}
        </div>

        <div className="relative before:absolute before:inset-0 before:bg-gradient-border before:rounded-2xl before:-z-10 before:content-[''] p-1.5 shadow-xl rounded-2xl mb-7 before:opacity-70">
          <div className="space-y-6 bg-white rounded-xl p-3">
            <div className="text-xl font-barlow font-bold text-center mb-3 antialiased">
              {t('convertionSite.popupUsage.text')}
            </div>

            <hr className="border-gray-border-secondary hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pl-7 md:pl-0">
              {listItems.map((item, index) => (
                <div key={item} className="flex flex-col gap-2">
                  <div className="flex items-start gap-2 text-sm">
                    <CircleCheck className="translate-y-0.5 shrink-0" />
                    {t(item)}
                  </div>
                  {index === listItems.length - 1 && (
                    <div className="pl-7 text-sm">
                      {t('convertionSite.popupUsage.list.lastItem')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <a
                href={t('convertionSite.popupUsage.cta.href')}
                data-track-click="cta_pro_click_reescrever_popup_max_usage"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('sg-tool-click', {
                      detail: {
                        value: `cta_pro_click_reescrever_popup_max_usage`,
                      },
                      composed: true,
                      bubbles: true,
                    })
                  );
                }}
                className={`${buttonStyles.cta.base} ${buttonStyles.cta.enabled} ${buttonStyles.cta.shine} gap-2 px-2`}
              >
                <LockOpen size={18} className="text-white" />
                <span className={buttonStyles.cta.text}>
                  {t('convertionSite.popupUsage.cta.text')}
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-5">
          <button
            onClick={onClose}
            className="text-gray-text hover:text-gray-text-secondary transition-colors underline hover:no-underline font-bold antialiased text-lg"
          >
            {t('convertionSite.popupUsage.close')}
          </button>
        </div>

        <div className="text-sm text-gray-text-secondary text-center mb-4 antialiased">
          {t('convertionSite.popupUsage.secondaryText')}
        </div>
      </div>
    </>
  );
}; 