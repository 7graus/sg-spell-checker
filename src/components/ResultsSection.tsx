import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserFeedback } from './user-feedback/UserFeedback';
import { ConversionPopupProMode } from './ConversionPopupProMode';
import { CopyButton } from './CopyButton';
import { useResponsive } from '../hooks/useResponsive';

interface Results {
  answer: string;
}

interface ResultsSectionProps {
  results: Results;
  lastSelectedOption?: {
    style?: {
      value: string;
      type: string;
      pro: boolean;
    };
    creativity?: {
      value: string;
      type: string;
      pro: boolean;
    };
    activeType?: string;
  };
  isPro?: boolean;
  projectId?: string;
  onProModeClose?: () => void;
  logId?: string | null;
  endpointFeedbackProject?: string;
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ 
  results, 
  lastSelectedOption,
  isPro = true,
  projectId = '0',
  onProModeClose,
  logId,
  endpointFeedbackProject
}) => {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();

  // Check if there are any pro options selected
  const hasProOptionSelected = lastSelectedOption?.style?.pro || lastSelectedOption?.creativity?.pro;
  // Get the active pro option based on activeType
  const activeProOption = lastSelectedOption?.activeType === 'writtingStyle' 
    ? lastSelectedOption?.style 
    : lastSelectedOption?.creativity;

  return (
    <div className="flex w-full h-full px-3 md:px-4 py-2 border-b border-gray-border-secondary md:border-0 md:border-l md:border-l-gray-300 min-h-[100px] ">
      {hasProOptionSelected && !isPro && activeProOption ? (
        <>
          <div className="flex flex-col justify-start w-full">
            {!results.answer && (
              <span className="text-gray-text-placeholder mb-7 pt-2">{t('general.info4')}</span>
            )}
            <ConversionPopupProMode lastSelectedOption={activeProOption} onClose={onProModeClose} />
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-between w-full">
            {!results.answer && (
              <span className="text-gray-text-placeholder mb-7 pt-2">{t('general.info4')}</span>
            )}
            {results.answer && (
              <>
                <div
                  className="prose prose-sm max-w-none max-h-[100vh] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: results.answer }}
                />
                {!isMobile && logId && (
                  <div className="flex justify-between mt-4 relative">
                    {/* <div className="absolute bottom-[30px] md:bottom-[30px] shadow-editor left-0 w-full h-5 pointer-events-none" /> */}
                    <UserFeedback
                      endpoint="https://api.7gra.us/feedback/v1"
                      projectId={Number(projectId)}
                      contentType="spell-checker"
                      contentTitle="Reescrever Textos"
                      contentText={results.answer}
                      contentUrl="/"
                      contentId={1}
                      projectName="Reescrever Textos"
                      logId={logId}
                      endpointFeedbackProject={endpointFeedbackProject}
                    />
                    <CopyButton
                      text={t('general.copy')}
                      textCopied={t('general.copied')}
                      value={results.answer}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}; 