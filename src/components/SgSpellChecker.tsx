import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext, ButtonOption } from '../types';
// import { AdPlacement } from './AdPlacement';
import { Drawer } from './Drawer';
import { OptionSelector } from './OptionSelector';
import { ResultsSection } from './ResultsSection';
import { TiptapEditor } from './TiptapEditor';
import { useResponsive } from '../hooks/useResponsive';
import { getButtonStyles } from '../helpers/buttonStyles';
import { isSubmitDisabled } from '../helpers/buttonHelpers';
import { useUsage } from '../hooks/useUsage';
import { useAuthContext } from '../hooks/useAuthContext';
import { ConversionPopup } from './ConversionPopup';
import { CopyButton } from './CopyButton';
import { UserFeedback } from './user-feedback/UserFeedback';

interface SgSpellCheckerProps {
  endpoint: string;
  projectId: string;
  tag: string;
  showWordInput?: boolean;
  authContext: AuthContext;
  endpointFeedbackProject?: string;
}

interface Results {
  answer: string;
}

export const SgSpellChecker: React.FC<SgSpellCheckerProps> = ({
  endpoint,
  projectId,
  tag,
  showWordInput = true,
  endpointFeedbackProject
}) => {
  const { t } = useTranslation();
  const [results, setResults] = useState<Results | null>(null);
  const [_error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<
    'writtingStyle' | 'criativityLevel' | 'tools' | null
  >(null);
  const [drawerTitle, setDrawerTitle] = useState('');
  const [logId, setLogId] = useState<string | null>(null);
  const { usageCount, maxUsage, incrementUsage, isLimitReached } = useUsage(tag);
  const { isPro } = useAuthContext();

  const [selectedCreativity, setSelectedCreativity] = useState<ButtonOption>({
    value: '2',
    label: t('creativity.medium'),
    pro: false,
  });
  const [selectedStyle, setSelectedStyle] = useState<ButtonOption>({
    value: 'normal',
    label: t('style.normal'),
    pro: false,
  });
  const [editorValue, setEditorValue] = useState('');
  const { isMobile } = useResponsive();
  const buttonStyles = getButtonStyles();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [isSecondToLastAttempt, setIsSecondToLastAttempt] = useState(false);

  const MAX_CHARS = 1000; // Define max chars constant

  const [lastSelectedOption, setLastSelectedOption] = useState<{
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
  }>({});

  const [warningUsageVisible, setWarningUsageVisible] = useState(false);

  useEffect(() => {
    if (!isPro && isLimitReached && !isSecondToLastAttempt) {
      setWarningUsageVisible(true);
    }
  }, [isPro, isLimitReached, isSecondToLastAttempt]);

  const handleSubmit = async () => {
    if(usageCount === maxUsage - 1) {
      setIsSecondToLastAttempt(true);
    } else {
      setIsSecondToLastAttempt(false);
    }

    if (!isPro && isLimitReached) {
      setWarningUsageVisible(true);
      return;
    }

    if (editorValue.length === 0) {
      setError('Please enter a text to detect AI');
      return;
    }

    setLoading(true);
    setError(null);
    setLogId(null);
    setResults({ answer: '' });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: editorValue,
          writtingStyle: selectedStyle.value,
          creativity: selectedCreativity.value,
          projectId,
          tag,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.description || 'An error occurred');
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentText = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream complete');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr === '[DONE]') {
              console.log('Received DONE signal');
              continue;
            }
            
            try {
              const data = JSON.parse(jsonStr);
              console.log('Received chunk:', data);
              
              if (data.content) {
                currentText += data.content;
                setResults({ answer: currentText });
              }
              if (data.logId) {
                setLogId(data.logId.toString());
              }
            } catch (e) {
              console.error('Error parsing JSON:', e, 'Line:', line);
            }
          }
        }
      }

      if (!isPro) {
        incrementUsage();
      }
    } catch (err: unknown) {
      console.error('Stream error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: ButtonOption, type: 'style' | 'creativity') => {
    if (type === 'style') {
      setSelectedStyle(option);
    } else if (type === 'creativity') {
      setSelectedCreativity(option);
    }
    setDrawerOpen(false);

    if (option.pro && !isPro) {
      setLastSelectedOption((prev) => ({
        ...prev,
        [type]: {
          value: option.value,
          type: type === 'style' ? 'writtingStyle' : 'criativityLevel',
          pro: true,
        },
        activeType: type === 'style' ? 'writtingStyle' : 'criativityLevel',
      }));
    } else {
      setLastSelectedOption((prev) => {
        const newState = { ...prev };
        delete newState[type];
        if (type === 'style' && newState.creativity) {
          newState.activeType = 'criativityLevel';
        } else if (type === 'creativity' && newState.style) {
          newState.activeType = 'writtingStyle';
        }
        return newState;
      });
    }
  };

  const isDisabled = isSubmitDisabled({
    loading,
    selectedStyle,
    selectedCreativity,
    editorValue: showWordInput ? editorValue : undefined,
    isPro,
    maxChars: MAX_CHARS,
  });

  const handleDrawerOpen = (options: {
    type: string;
    title: string;
    options: ButtonOption[];
    selectedValue: string;
    isLinkDrawer?: boolean;
  }) => {
    // Map the heading to the correct drawer type
    const drawerTypeMap: Record<string, 'writtingStyle' | 'criativityLevel' | 'tools'> = {
      [t('style.label').toLowerCase()]: 'writtingStyle',
      [t('creativity.label').toLowerCase()]: 'criativityLevel',
      tools: 'tools',
    };

    const type =
      drawerTypeMap[options.type] ||
      (options.type as 'writtingStyle' | 'criativityLevel' | 'tools');
    setDrawerType(type);
    setDrawerTitle(options.title);
    setDrawerOpen(true);
  };

  // Memoize the options to prevent unnecessary re-renders
  const styleOptions = React.useMemo(
    () => [
      {
        value: t('style.normal.value'),
        label: t('style.normal.label'),
        description: t('style.normal.description'),
        pro: false,
      },
      {
        value: t('style.formal.value'),
        label: t('style.formal.label'),
        description: t('style.formal.description'),
        pro: true,
      },
      {
        value: t('style.academic.value'),
        label: t('style.academic.label'),
        description: t('style.academic.description'),
        pro: true,
      },
      {
        value: t('style.direct.value'),
        label: t('style.direct.label'),
        description: t('style.direct.description'),
        pro: true,
      },
      {
        value: t('style.humanize.value'),
        label: t('style.humanize.label'),
        description: t('style.humanize.description'),
        pro: true,
      },
    ],
    [t]
  );

  const creativityOptions = React.useMemo(
    () => [
      {
        value: t('creativity.low.value'),
        label: t('creativity.low.label'),
        description: t('creativity.low.description'),
        pro: false,
      },
      {
        value: t('creativity.medium.value'),
        label: t('creativity.medium.label'),
        description: t('creativity.medium.description'),
        pro: false,
      },
      {
        value: t('creativity.high.value'),
        label: t('creativity.high.label'),
        description: t('creativity.high.description'),
        pro: false,
      },
    ],
    [t]
  );

  const getDrawerOptions = React.useCallback(() => {
    switch (drawerType) {
      case 'writtingStyle':
        return styleOptions;
      case 'criativityLevel':
        return creativityOptions;
      default:
        return [];
    }
  }, [drawerType, styleOptions, creativityOptions]);

  const getDrawerSelectedValue = () => {
    switch (drawerType) {
      case 'writtingStyle':
        return selectedStyle?.value;
      case 'criativityLevel':
        return selectedCreativity?.value;
      default:
        return '/reescrever-texto/';
    }
  };

  const handleDrawerSelect = (option: ButtonOption) => {
    if (drawerType === 'tools') {
      window.location.href = option.value;
    } else {
      handleOptionSelect(option, drawerType === 'writtingStyle' ? 'style' : 'creativity');
    }
  };

  const handleProModeClose = () => {
    // Reset to default options
    setSelectedStyle({
      value: t('style.normal.value'),
      label: t('style.normal.label'),
      description: t('style.normal.description'),
      pro: false,
    });
    setSelectedCreativity({
      value: t('creativity.medium.value'),
      label: t('creativity.medium.label'),
      description: t('creativity.medium.description'),
      pro: false,
    });
    setLastSelectedOption({});
  };

  const handleClear = () => {
    setResults(null);
    setLogId(null);
  };

  return (
    <div className="block md:border md:border-gray-border-secondary md:rounded-lg md:shadow-lg md:bg-white mx-auto">


      {showWordInput && (
        <div className="flex flex-col md:flex-row border shadow-xl md:shadow-none rounded-lg md:rounded-none border-gray-border-secondary md:border-0 bg-white md:bg-transparent">
          <div className="w-full flex flex-col justify-between">
            <TiptapEditor
              value={editorValue}
              placeholder={isMobile ? t('general.info1-mobile') : t('general.info1-desktop')}
              onChange={setEditorValue}
              maxChars={MAX_CHARS}
              isPro={isPro}
              usageCount={usageCount}
              maxUsage={maxUsage}
              isLimitReached={isLimitReached}
              isMobile={isMobile}
              loading={loading}
              onSubmit={handleSubmit}
              isDisabled={isDisabled}
              submitButtonRef={submitButtonRef}
              warningUsageVisible={warningUsageVisible}
              showProModeTooltip={
                !isPro && (!!lastSelectedOption.style?.pro || !!lastSelectedOption.creativity?.pro)
              }
              onClear={handleClear}
              preventFocus={drawerOpen}
            />
          </div>

          {isMobile && (
            <div
              className={`w-full p-2 flex items-center ${results ? 'justify-between' : 'justify-center'}`}
            >
              {results && logId && (
                <UserFeedback
                  endpoint="https://api.7gra.us/feedback/v1"
                  projectId={Number(projectId)}
                  contentType="spell-checker"
                  contentTitle="Reescrever Textos"
                  contentText={results?.answer || ''}
                  contentUrl="/"
                  contentId={1}
                  projectName="Reescrever Textos"
                  logId={logId}
                  endpointFeedbackProject={endpointFeedbackProject}
                />
              )}
              <button
                ref={submitButtonRef}
                type="button"
                className={`${buttonStyles.cta.base} ${
                  isDisabled ? buttonStyles.cta.disabled : buttonStyles.cta.enabled
                }`}
                onClick={handleSubmit}
                disabled={isDisabled}
              >
                <div className={`${buttonStyles.cta.text}`}>
                  {loading ? t('loading') : t('submit')}
                </div>
              </button>
              {results && (
                <CopyButton
                  text={t('general.copy')}
                  textCopied={t('general.copied')}
                  value={results?.answer || ''}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* {authContext.isAdRequired && <AdPlacement type="adPlacement" />} */}

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={drawerTitle}
        options={getDrawerOptions()}
        selectedValue={getDrawerSelectedValue()}
        onSelect={handleDrawerSelect}
      />

      {warningUsageVisible && (
        <div className="fixed inset-0 z-[9999]" id="conversion-popup-container">
          <ConversionPopup onClose={() => setWarningUsageVisible(false)} />
        </div>
      )}
    </div>
  );
}; 