import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Clipboard, X, CircleAlert, ArrowRight } from 'lucide-react';
import { getButtonStyles } from '../helpers/buttonStyles';
import { useTranslation } from 'react-i18next';
import { useEditorHeight } from '../hooks/useEditorHeight';
import { SpellingErrorMark } from './editor-marks/SpellingErrorMark';
import { GrammarErrorMark } from './editor-marks/GrammarErrorMark';
import { ErrorCorrectionMark } from './editor-marks/ErrorCorrectionMark';
import { Results, TextError } from '../types';
import { ErrorHoverCard } from './ErrorHoverCard';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxChars?: number;
  disabled?: boolean;
  isPro?: boolean;
  usageCount?: number;
  maxUsage?: number;
  isLimitReached?: boolean;
  isMobile?: boolean;
  loading?: boolean;
  onSubmit?: () => void;
  isDisabled?: boolean;
  langCode?: string;
  submitButtonRef?: React.RefObject<HTMLButtonElement>;
  warningUsageVisible?: boolean;
  onClear?: () => void;
  resultErrors?: Results;
  onAcceptAll?: () => void;
}

export const TiptapEditor = React.forwardRef<{ handleAcceptAll: () => void }, TiptapEditorProps>(({
  value,
  onChange,
  placeholder = '',
  maxChars = 1000,
  disabled = false,
  isPro = false,
  usageCount = 0,
  maxUsage = 3,
  isMobile = false,
  loading = false,
  onSubmit,
  isDisabled = false,
  submitButtonRef,
  onClear,
  resultErrors,
}, ref) => {
  const [warningCharsVisible, setWarningCharsVisible] = useState(true);
  const [warningUsageVisible, setWarningUsageVisible] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const defaultSubmitButtonRef = useRef<HTMLButtonElement>(null);
  const { editorHeight } = useEditorHeight({
    isMobile,
    editorRef,
    submitButtonRef: submitButtonRef || defaultSubmitButtonRef,
  });

  const preferedErrorSource = 'languageTools';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      SpellingErrorMark,
      GrammarErrorMark,
      ErrorCorrectionMark,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      onChange(text);
    },
    editorProps: {
      handlePaste: (_view, event) => {
        event.preventDefault();

        // Get clipboard data
        const clipboardData = event.clipboardData;
        const html = clipboardData?.getData('text/html');
        const text = clipboardData?.getData('text/plain') || '';

        if (editor) {
          const pos = editor.state.selection.from;

          if (html) {
            // Create a temporary div to sanitize HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Remove meta tags and style attributes
            const metaTags = tempDiv.getElementsByTagName('meta');
            while (metaTags.length > 0) {
              metaTags[0].parentNode?.removeChild(metaTags[0]);
            }

            // Remove style attributes from all elements
            const allElements = tempDiv.getElementsByTagName('*');
            for (let i = 0; i < allElements.length; i++) {
              allElements[i].removeAttribute('style');
            }

            // Get the cleaned HTML content
            const cleanHtml = tempDiv.innerHTML
              .replace(/<span[^>]*>/g, '') // Remove span opening tags
              .replace(/<\/span>/g, '') // Remove span closing tags
              // .replace(/<div[^>]*>/g, '<p>') // Convert divs to paragraphs
              // .replace(/<\/div>/g, '</p>')
              .replace(/<br\s*\/?>(?!\n)/g, '\n') // Convert br tags to newlines
              .replace(/\n\s*\n/g, '\n') // Remove multiple consecutive newlines
              .trim();

            editor.chain().focus().insertContentAt(pos, cleanHtml).run();
          } else if (text) {
            // Mimic Quillbot: double newline = new paragraph, single newline = <br>
            const paragraphs = text.trim().split(/\r?\n\r?\n/);
            const html = paragraphs
              .map((paragraph) => `<p>${paragraph.replace(/\r?\n/g, '<br>')}</p>`)
              .join('');
            editor.chain().focus().insertContentAt(pos, html).run();
          }

          onChange(editor.getText());
        }
        return true;
      },
      attributes: {
        class: '',
        tabindex: '0',
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off',
        'data-gramm': 'false',
        'data-gramm_editor': 'false',
        'data-enable-grammarly': 'false',
      },
    },
  });
  const { t } = useTranslation();
  const buttonStyles = getButtonStyles();

  const [hoveredError, setHoveredError] = useState<{
    suggestions: string[];
    type: 'spelling' | 'grammar';
    range: { from: number; to: number };
    element: HTMLElement | null;
  } | null>(null);
  const activeErrorRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (editor && editor.getText() !== value) {
      editor.chain().setContent(value).focus().setTextSelection({ from: 0, to: 0 }).run();
    }
  }, [value, editor]);

  useEffect(() => {
    if (resultErrors) {
      checkText();
    }
  }, [resultErrors]);

  const findWordPosition = (word: string, startFrom: number = 0): number => {
    if (!editor) return -1;
    const text = editor.getText();
    return text.indexOf(word, startFrom);
  };

  const checkOverlap = (start: number, end: number, existingErrors: TextError[]): boolean => {
    return existingErrors.some(
      (error) =>
        (start >= error.start && start <= error.end) || (end >= error.start && end <= error.end)
    );
  };

  const handleErrorClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const element = event.target as HTMLElement;

    // Remove active class from previous element if exists
    if (activeErrorRef.current) {
      activeErrorRef.current.classList.remove('error-active');
    }

    // First: Clear hoveredError so ErrorHoverCard unmounts
    setHoveredError(null);

    // Delay opening new one by 1 frame (to allow unmount first)
    requestAnimationFrame(() => {
      element.classList.add('error-active');
      activeErrorRef.current = element;

      const suggestions = JSON.parse(element.getAttribute('data-suggestions') || '[]');
      const type = element.classList.contains('spelling-error') ? 'spelling' : 'grammar';

      if (editor) {
        const pos = editor.view.posAtDOM(element, 0);
        const textContent = element.textContent || '';
        const end = pos + textContent.length;
        setHoveredError({
          suggestions,
          type,
          range: { from: pos, to: end },
          element,
        });
      }
    });
  };
  const handleCloseCard = () => {
    setHoveredError(null);
    if (activeErrorRef.current) {
      activeErrorRef.current.classList.remove('error-active');
      activeErrorRef.current = null;
    }
  };

  // Add click handler to close the card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (hoveredError && !target.closest('.error-card')) {
        handleCloseCard();
      }
    };

    // document.addEventListener('mousedown', handleClickOutside);
    // return () => {
    //   document.removeEventListener('mousedown', handleClickOutside);
    // };
  }, [hoveredError]);

  const hasRemainingErrors = () => {
    if (!editor) return false;
    let hasErrors = false;
    editor.state.doc.descendants((node) => {
      if (node.marks) {
        node.marks.forEach(mark => {
          if (mark.type.name === 'spellingError' || mark.type.name === 'grammarError') {
            hasErrors = true;
          }
        });
      }
    });
    return hasErrors;
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (editor && hoveredError && hoveredError.element) {
      const { from, to } = hoveredError.range;
      const errorType = hoveredError.type === 'spelling' ? 'spellingError' : 'grammarError';

      // Remove any existing correction after the error
      const afterErrorPos = to;
      const doc = editor.state.doc;
      const afterErrorNode = doc.nodeAt(afterErrorPos);
      if (
        afterErrorNode &&
        afterErrorNode.marks &&
        afterErrorNode.marks.some(mark => mark.type.name === 'errorCorrection')
      ) {
        editor.chain().focus().deleteRange({ from: afterErrorPos, to: afterErrorPos + afterErrorNode.nodeSize }).run();
      }

      // Set selection to the error's range and set the mark
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .unsetMark(errorType)
        .setMark(errorType, { errorCorrected: true, source: preferedErrorSource, suggestions: hoveredError.suggestions })
        .insertContentAt(afterErrorPos, [
          {
            type: 'text',
            text: suggestion,
            marks: [{ type: 'errorCorrection' }],
          },
        ])
        .run();

      // Delete the error mark and content
      editor.chain().focus().setTextSelection({ from, to }).unsetMark(errorType).deleteRange({ from, to }).run();

      handleCloseCard();

      // Check if there are any remaining errors
      if (!hasRemainingErrors()) {
        onClear?.();
      }
    }
  };

  const handleIgnoreClick = () => {
    if (editor && hoveredError && hoveredError.element) {
      const { from, to } = hoveredError.range;
      const errorType = hoveredError.type === 'spelling' ? 'spellingError' : 'grammarError';
      editor.chain().focus().setTextSelection({ from, to }).unsetMark(errorType).run();

      handleCloseCard();
    }
  };

  const handleAcceptAll = () => {
    if (!editor || !resultErrors) return;

    // Collect all corrections first
    const corrections: { from: number; to: number; suggestion: string; type: string }[] = [];
    
    editor.state.doc.descendants((node, pos) => {
      if (node.marks) {
        node.marks.forEach(mark => {
          if (mark.type.name === 'spellingError' || mark.type.name === 'grammarError') {
            const suggestions = mark.attrs.suggestions || [];
            if (suggestions.length > 0) {
              corrections.push({
                from: pos,
                to: pos + node.nodeSize,
                suggestion: suggestions[0],
                type: mark.type.name
              });
            }
          }
        });
      }
    });

    // Sort corrections by position in reverse order (end to start)
    corrections.sort((a, b) => b.from - a.from);

    // Apply corrections in reverse order
    corrections.forEach(({ from, to, suggestion, type }) => {
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .unsetMark(type)
        .setMark(type, {
          errorCorrected: true,
          source: preferedErrorSource,
          suggestions: [suggestion],
        })
        .insertContentAt(to, [
          {
            type: 'text',
            text: suggestion,
            marks: [{ type: 'errorCorrection' }],
          },
        ])
        .run();

      // Delete the error mark and content
      editor.chain().focus().setTextSelection({ from, to }).unsetMark(type).deleteRange({ from, to }).run();
    });

    // Clear all error marks after processing
    editor.chain().focus().unsetAllMarks().run();

    // Reset errors since all corrections have been applied
    onClear?.();
  };

  const markErrorInEditor = (error: TextError) => {
    if (!editor) return;

    try {
      const from = error.start + 1; // +1 for paragraph node
      const to = error.end + 1;

      editor
        .chain()
        .setTextSelection({ from, to })
        .setMark(error.type === 'spelling' ? 'spellingError' : 'grammarError', {
          source: error.source,
          suggestions: error.suggestions || [],
          errorCorrected: false,
        })
        .run();
    } catch (e) {
      console.error('Error marking text:', e);
    }
  };

  const checkText = async () => {
    if (!resultErrors) return;

    editor?.commands.unsetAllMarks();
    const lastPositionMap = new Map<string, number>();
    const processedErrors: TextError[] = [];
    const errors = resultErrors.errors;
    const originalText = editor?.getText() || '';
    // Primeiro processa os erros do LanguageTools
    errors
      .filter((error) => error.source === preferedErrorSource)
      .forEach((originalError) => {
        const error = { ...originalError };
        const wordAtPosition = originalText.slice(error.start, error.end);
        if (wordAtPosition === error.word) {
          processedErrors.push(error);
        } else {
          const lastPos = lastPositionMap.get(error.word) || 0;
          const newPosition = findWordPosition(error.word, lastPos);
          if (
            newPosition !== -1 &&
            !checkOverlap(newPosition, newPosition + error.word.length, processedErrors)
          ) {
            error.start = newPosition;
            error.end = newPosition + error.word.length;
            lastPositionMap.set(error.word, newPosition + 1);
            processedErrors.push(error);
          }
        }
      });

    // Depois processa os outros erros, evitando sobreposições
    errors
      .filter((error) => error.source !== preferedErrorSource)
      .forEach((originalError) => {
        const error = { ...originalError };
        const wordAtPosition = originalText.slice(error.start, error.end);
        if (
          wordAtPosition === error.word &&
          !checkOverlap(error.start, error.end, processedErrors)
        ) {
          processedErrors.push(error);
        } else {
          const lastPos = lastPositionMap.get(error.word) || 0;
          const newPosition = findWordPosition(error.word, lastPos);
          if (
            newPosition !== -1 &&
            !checkOverlap(newPosition, newPosition + error.word.length, processedErrors)
          ) {
            error.start = newPosition;
            error.end = newPosition + error.word.length;
            lastPositionMap.set(error.word, newPosition + 1);
            processedErrors.push(error);
          }
        }
      });

    errors.forEach((error) => {
      markErrorInEditor(error);
    });
  };

  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      let text = '';

      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type === 'text/plain') {
            const blob = await clipboardItem.getType(type);
            text = await blob.text();
            break;
          }
        }
      }

      if (text && editor) {
        // Insert text at current cursor position without creating new paragraphs
        const pos = editor.state.selection.from;
        editor.chain().focus().insertContentAt(pos, text).run();

        onChange(editor.getText() || '');
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  const handleClearWarning = (type: 'characters' | 'usage') => {
    if (type === 'characters') {
      setWarningCharsVisible(false);
    } else if (type === 'usage') {
      setWarningUsageVisible(false);
    }
  };

  const renderWarningTooltip = (type: 'characters' | 'usage') => {
    const isCharacters = type === 'characters';
    const isVisible = isCharacters ? warningCharsVisible : warningUsageVisible;
    const message = isCharacters
      ? `${t('general.characters')}: ${value.length}/${maxChars}`
      : `${t('general.usage')}: ${usageCount}/${maxUsage}`;

    if (!isVisible) return null;

    return (
      <div className="absolute z-10 bottom-[33px] w-[calc(100%-1rem)] ml-2 left-0 p-2 bg-red-danger-bg border border-red-danger-border rounded-md">
        <div className="text-red-danger-text text-base font-bold antialiased flex flex-row gap-2 items-center">
          <CircleAlert size={18} className="text-red-danger-text" />
          {message}
          <button
            className="cursor-pointer absolute right-2 top-2"
            onClick={() => handleClearWarning(type)}
          >
            <X size={18} className="text-gray-text" />
          </button>
        </div>
        <div
          className="text-gray-text text-sm pl-7"
          onClick={(e) => {
            const target = e.target as HTMLElement;
            if (target.dataset.trackClick) {
              window.dispatchEvent(
                new CustomEvent(`sg-tool-click`, {
                  detail: {
                    value: `cta_pro_click_reescrever_editor_max_${type}`,
                  },
                  composed: true,
                  bubbles: true,
                })
              );
            }
          }}
          dangerouslySetInnerHTML={{
            __html: t(`convertionSite.text_${type}`, {
              cssClass: 'text-blue underline hover:no-underline',
            }),
          }}
        />
      </div>
    );
  };

  // Expose handleAcceptAll through ref
  React.useImperativeHandle(ref, () => ({
    handleAcceptAll
  }));

  return (
    <div className="w-full h-full md:py-2 md:pl-4 md:pr-1 border-b border-gray-border-secondary md:border-0 relative">
      <div className="relative h-full flex flex-col justify-between">
        {value && (
          <button
            className="absolute w-[36px] h-[36px] z-[1] top-2 right-2 cursor-pointer bg-gray-bg flex items-center justify-center rounded-md"
            onClick={handleClear}
            aria-label={t('general.clear')}
            tabIndex={0}
          >
            <X size={17} className="text-gray-text-secondary" />
          </button>
        )}

        <div
          ref={editorRef}
          className={`tiptap-editor overflow-hidden w-full h-full min-h-[30vh] md:min-h-[50vh] md:max-h-[100vh] flex bg-white rounded-md pl-3 py-2 focus:outline-none prose prose-sm max-w-none relative ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            maxHeight: isMobile ? undefined : '80vh',
            height: editorHeight ? `${editorHeight}px` : undefined,
          }}
          tabIndex={0}
        >
          <div className="flex-grow w-full">
            <EditorContent
              editor={editor}
              className="w-full h-full"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (
                  target.classList.contains('spelling-error') ||
                  target.classList.contains('grammar-error')
                ) {
                  handleErrorClick(e as any);
                }
              }}
            />
            {hoveredError && (
              <ErrorHoverCard
                key={`${hoveredError.range.from}-${hoveredError.range.to}`}
                suggestions={hoveredError.suggestions}
                onSuggestionClick={handleSuggestionClick}
                onIgnoreClick={handleIgnoreClick}
                onClose={handleCloseCard}
                targetElement={hoveredError.element}
                type={hoveredError.type}
              />
            )}
            {!value && (
              <button
                onClick={handlePaste}
                className={`absolute top-[70px] md:top-[80px] left-1/2 max-md:-translate-x-1/2 md:left-0 px-3 py-1.5 text-gray-text-secondary hover:bg-gray-100 flex items-center gap-2 ${buttonStyles.gray.base}`}
              >
                <Clipboard size={15} />
                {t('general.paste')}
              </button>
            )}
            {value && (
              <div className="absolute bottom-[-20px] md:bottom-[-12px] shadow-editor left-0 w-full h-5 bg-white pointer-events-none" />
            )}
          </div>
        </div>

        <div
          className={`flex flex-row gap-2 items-end py-2 px-3 md:py-0 md:px-0 ${isPro ? 'justify-end' : 'justify-between'}`}
        >
          {!isPro && (
            <div className="flex flex-row gap-5 items-end">
              <div
                className={`text-xs relative ${usageCount >= maxUsage ? 'text-red-danger-text' : 'text-gray-text-secondary'}`}
              >
                {t('general.usage')}: {usageCount}/{maxUsage}
                {usageCount >= maxUsage && warningUsageVisible && (
                  <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-red-danger-border rounded-sm absolute top-[-17px] left-1/2 -translate-x-1/2" />
                )}
              </div>
              <div
                className={`text-xs relative ${value.length > maxChars ? 'text-red-danger-text' : 'text-gray-text-secondary'}`}
              >
                {t('general.characters')}: {value.length}/{maxChars}
                {value.length > maxChars && warningCharsVisible && (
                  <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-red-danger-border rounded-sm absolute top-[-17px] left-1/2 -translate-x-1/2" />
                )}
              </div>
              {value.length > maxChars && renderWarningTooltip('characters')}
              {usageCount >= maxUsage && renderWarningTooltip('usage')}
            </div>
          )}

          {!isMobile && onSubmit && (
            <div className="relative">
              {resultErrors && (
                <button
                  type="button"
                  className={`relative ${buttonStyles.cta.base} ${
                    isDisabled ? buttonStyles.cta.disabled : buttonStyles.cta.enabled
                  }`}
                  onClick={handleAcceptAll}
                  disabled={isDisabled}
                >
                  <div className={`${buttonStyles.cta.text}`}>
                    {t('editor.acceptAllCorrections')}
                  </div>
                  <ArrowRight className={`${buttonStyles.cta.text} w-5 h-5 ml-2`} />
                </button>
              )}
              {!resultErrors && (
                <button
                  type="button"
                  className={`relative ${buttonStyles.cta.base} ${
                    isDisabled ? buttonStyles.cta.disabled : buttonStyles.cta.enabled
                  }`}
                  onClick={onSubmit}
                  disabled={isDisabled}
                >
                  <div className={`${buttonStyles.cta.text}`}>
                    {loading ? t('loading') : t('submit')}
                  </div>
                  <ArrowRight className={`${buttonStyles.cta.text} w-5 h-5 ml-2`} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
