import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext, Results } from '../types';
import { TiptapEditor } from './TiptapEditor';
import { useResponsive } from '../hooks/useResponsive';
import { isSubmitDisabled } from '../helpers/buttonHelpers';
import { useUsage } from '../hooks/useUsage';
import { useAuthContext } from '../hooks/useAuthContext';
import { ConversionPopup } from './ConversionPopup';
import { UserFeedback } from './user-feedback/UserFeedback';
import { AcceptAllButton } from './buttons/AcceptAllButton';

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
  endpointFeedbackProject,
}) => {
  const { t } = useTranslation();
  const [results, setResults] = useState<Results | null>(null);
  const [_error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [logId, setLogId] = useState<string | null>(null);
  const { usageCount, maxUsage, incrementUsage, isLimitReached } = useUsage(tag);
  const { isPro } = useAuthContext();
  const [editorValue, setEditorValue] = useState('');
  // const [editorValue, setEditorValue] = useState(
  //   'Seja para corrigir e-meils profissionais, trabalhos acadêmicos, mensagens importantes ou qalquer outro tipo de texto, nossa ferramenta é a escolha ideal. Com tecnologia avançada de IA, identificamos erros ortográficos, gramaticais e oferecemos sugestões precisas de coreção.'
  // );
  const { isMobile } = useResponsive();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<{ handleAcceptAll: () => void }>(null);
  const [isSecondToLastAttempt, setIsSecondToLastAttempt] = useState(false);
  const [recheck, setRecheck] = useState(false);
  const [feedbackResetKey, setFeedbackResetKey] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const MAX_CHARS = 1000; // Define max chars constant

  const [warningUsageVisible, setWarningUsageVisible] = useState(false);

  useEffect(() => {
    if (!isPro && isLimitReached && !isSecondToLastAttempt && !recheck) {
      setWarningUsageVisible(true);
    }
  }, [isPro, isLimitReached, isSecondToLastAttempt]);

  const handleSubmit = async (valueOverride?: string) => {

    if(isDisabled) {
      return;
    }
    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (usageCount === maxUsage - 1) {
      setIsSecondToLastAttempt(true);
    } else {
      setIsSecondToLastAttempt(false);
    }

    if (!isPro && isLimitReached) {
      setWarningUsageVisible(true);
      return;
    }

    const textToSubmit = valueOverride !== undefined ? valueOverride : editorValue;
    if (textToSubmit.length === 0) {
      setError('Please enter a text to detect AI');
      return;
    }

    setLoading(true);
    setError(null);
    setLogId(null);
    if(!recheck){
      setResults(null);
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSubmit,
          recheck: recheck,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.description || 'An error occurred');
      }

      const dataJson = await response.json();

      const data = dataJson.data;

      if (data.errors) {
        setResults({ errors: data.errors });
      }
      if (data.logId) {
        setLogId(data.logId.toString());
      }

      if (!isPro && !recheck) {
        incrementUsage();
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Request was cancelled, do nothing
        return;
      }
      console.error('Stream error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
      setRecheck(true);
      abortControllerRef.current = null;
    }
  };

  const isDisabled = isSubmitDisabled({
    loading,
    editorValue: editorValue,
    isPro,
    maxChars: MAX_CHARS,
  });

  const handleClear = () => {
    // Abort any active request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setResults(null);
    setLogId(null);
    setRecheck(false);
    setFeedbackResetKey((k) => k + 1);
  };

  const handleAcceptAll = () => {
    editorRef.current?.handleAcceptAll();
  };

  // Clear results when editor is emptied
  useEffect(() => {
    if (editorValue === '' && (results || logId)) {
      handleClear();
    }
  }, [editorValue]);

  // Debounce submit: call handleSubmit 1.5s after user stops typing
  useEffect(() => {
    if (editorValue.length === 0) return;
    const timeout = recheck ? 1500 : 300;
    
    const handler = setTimeout(() => {
      handleSubmit(editorValue);
    }, timeout);
    return () => clearTimeout(handler);
  }, [editorValue]);

  return (
    <div className="block relative md:border md:border-gray-border-secondary rounded-lg md:shadow-lg md:bg-white mx-auto overflow-hidden">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-600 overflow-hidden opacity-50">
          <div
            className="absolute h-full w-[40%] bg-blue-100 animate-sg-bar-loading"
          />
        </div>
      )}
      <div className="flex flex-col border shadow-xl md:shadow-none rounded-lg md:rounded-none border-gray-border-secondary md:border-0 bg-white md:bg-transparent">
        <div className="w-full flex flex-col justify-between">
          <TiptapEditor
            ref={editorRef}
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

        <div className={`relative w-full p-2 flex items-center justify-between`}>
          <UserFeedback
            endpoint="https://api.7gra.us/feedback/v1"
            projectId={Number(projectId)}
            contentType="spell-checker"
            contentTitle="Reescrever Textos"
            contentText={results?.errors?.map((error) => error.word).join(', ')}
            contentUrl="/"
            contentId={1}
            projectName="Reescrever Textos"
            logId={logId || null}
            endpointFeedbackProject={endpointFeedbackProject}
            resetKey={feedbackResetKey}
          />

          {results && results.errors.length > 0 && (
            <AcceptAllButton
              successMessage={false}
              isDisabled={isDisabled}
              handleAcceptAll={handleAcceptAll}
            />
          )}
        </div>
      </div>
      {warningUsageVisible && (
        <div className="fixed inset-0 z-[9999]" id="conversion-popup-container">
          <ConversionPopup onClose={() => setWarningUsageVisible(false)} />
        </div>
      )}
    </div>
  );
};
