import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext, Results } from '../types';
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
  authContext: AuthContext;
  endpointFeedbackProject?: string;
}

export const SgSpellChecker: React.FC<SgSpellCheckerProps> = ({
  endpoint,
  projectId,
  tag,
  endpointFeedbackProject
}) => {
  const { t } = useTranslation();
  const [results, setResults] = useState<Results | null>(null);
  const [_error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logId, setLogId] = useState<string | null>(null);
  const { usageCount, maxUsage, incrementUsage, isLimitReached } = useUsage(tag);
  const { isPro } = useAuthContext();
  const [editorValue, setEditorValue] = useState('Seja para corrigir e-meils profissionais, trabalhos acadêmicos, mensagens importantes ou qalquer outro tipo de texto, nossa ferramenta é a escolha ideal. Com tecnologia avançada de IA, identificamos erros ortográficos, gramaticais e oferecemos sugestões precisas de coreção.');
  const { isMobile } = useResponsive();
  const buttonStyles = getButtonStyles();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [isSecondToLastAttempt, setIsSecondToLastAttempt] = useState(false);

  const MAX_CHARS = 1000; // Define max chars constant

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
    setResults(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: editorValue,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.description || 'An error occurred');
      }

      const dataJson = await response.json();
      const data = dataJson.data;

      console.log('data', data);
      
      if (data.errors) {
        setResults({ errors: data.errors });
      }
      if (data.logId) {
        setLogId(data.logId.toString());
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

  const isDisabled = isSubmitDisabled({
    loading,
    editorValue: editorValue,
    isPro,
    maxChars: MAX_CHARS,
  });

  const handleClear = () => {
    setResults(null);
    setLogId(null);
  };

  return (
    <div className="block md:border md:border-gray-border-secondary md:rounded-lg md:shadow-lg md:bg-white mx-auto">
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
            onClear={handleClear}
            resultErrors={results || undefined}
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
                contentText={results?.errors.map(error => error.word).join(', ')}
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
                value={editorValue}
              />
            )}
          </div>
        )}
      </div>

      {warningUsageVisible && (
        <div className="fixed inset-0 z-[9999]" id="conversion-popup-container">
          <ConversionPopup onClose={() => setWarningUsageVisible(false)} />
        </div>
      )}
    </div>
  );
}; 