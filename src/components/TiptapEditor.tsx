import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Clipboard, X, CircleAlert, ArrowRight } from 'lucide-react';
import { getButtonStyles } from '../helpers/buttonStyles';
import { useTranslation } from 'react-i18next';
import { useEditorHeight } from '../hooks/useEditorHeight';

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
  showProModeTooltip?: boolean;
  onClear?: () => void;
  preventFocus?: boolean;
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({
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
  showProModeTooltip = false,
  onClear,
  preventFocus = false
}) => {
  const [warningCharsVisible, setWarningCharsVisible] = useState(true);
  const [warningUsageVisible, setWarningUsageVisible] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const defaultSubmitButtonRef = useRef<HTMLButtonElement>(null);
  const { editorHeight } = useEditorHeight({ isMobile, editorRef, submitButtonRef: submitButtonRef || defaultSubmitButtonRef });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled && !preventFocus,
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
            
            editor.chain()
              .focus()
              .insertContentAt(pos, cleanHtml)
              .run();
          } else if (text) {
            // Mimic Quillbot: double newline = new paragraph, single newline = <br>
            const paragraphs = text.trim().split(/\r?\n\r?\n/);
            const html = paragraphs
              .map(paragraph => `<p>${paragraph.replace(/\r?\n/g, '<br>')}</p>`)
              .join('');
            editor.chain()
              .focus()
              .insertContentAt(pos, html)
              .run();
          }
          
          onChange(editor.getText());
        }
        return true;
      },
      attributes: {
        class: preventFocus ? 'pointer-events-none' : '',
        tabindex: preventFocus ? '-1' : '0',
        'data-ios-focus-prevent': preventFocus ? 'true' : 'false'
      }
    }
  });
  const { t } = useTranslation();
  const buttonStyles = getButtonStyles();

  useEffect(() => {
    if (editor && editor.getText() !== value) {
      editor
        .chain()
        .setContent(value)
        .focus()
        .setTextSelection({ from: 0, to: 0 })
        .run();
    }
  }, [value, editor]);

  // Add iOS-specific focus prevention
  useEffect(() => {
    if (preventFocus && editorRef.current) {
      const editorElement = editorRef.current;
      editorElement.setAttribute('tabindex', '-1');
      editorElement.setAttribute('data-ios-focus-prevent', 'true');
      
      // Prevent focus on iOS
      const preventFocusHandler = (e: FocusEvent) => {
        if (preventFocus) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      
      editorElement.addEventListener('focusin', preventFocusHandler, true);
      editorElement.addEventListener('focus', preventFocusHandler, true);
      
      return () => {
        editorElement.removeEventListener('focusin', preventFocusHandler, true);
        editorElement.removeEventListener('focus', preventFocusHandler, true);
      };
    }
  }, [preventFocus]);

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
        editor
          .chain()
          .focus()
          .insertContentAt(pos, text)
          .run();
        
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

  return (
    <div className="w-full h-full md:py-2 md:pl-4 md:pr-1 border-b border-gray-border-secondary md:border-0 relative">
      <div className="relative h-full flex flex-col justify-between">
        {value && (
          <button
            className="absolute w-[36px] h-[36px] z-[1] top-2 right-2 cursor-pointer bg-gray-bg flex items-center justify-center rounded-md"
            onClick={handleClear}
            aria-label={t('general.clear')}
            tabIndex={preventFocus ? -1 : 0}
          >
            <X size={17} className="text-gray-text-secondary" />
          </button>
        )}

        <div
          ref={editorRef}
          className={`tiptap-editor overflow-hidden w-full h-full min-h-[30vh] md:min-h-[50vh] md:max-h-[100vh] flex bg-white rounded-md pl-3 py-2 focus:outline-none prose prose-sm max-w-none relative ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          } ${preventFocus ? 'pointer-events-none' : ''}`}
          style={{
            maxHeight: isMobile ? undefined : '80vh',
            height: editorHeight ? `${editorHeight}px` : undefined,
          }}
          tabIndex={preventFocus ? -1 : 0}
        >
          <div className="flex-grow w-full">
            <EditorContent editor={editor} className="w-full h-full" />
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
              <button
                type="button"
                className={`relative ${buttonStyles.cta.base} ${
                  isDisabled || showProModeTooltip
                    ? buttonStyles.cta.disabled
                    : buttonStyles.cta.enabled
                }`}
                onClick={onSubmit}
                disabled={isDisabled || showProModeTooltip}
              >
                <div className={`${buttonStyles.cta.text}`}>
                  {loading ? t('loading') : t('submit')}
                </div>
                <ArrowRight className={`${buttonStyles.cta.text} w-5 h-5 ml-2`} />
              </button>
              {showProModeTooltip && (
                <>
                  <div
                    className="min-w-[150px] z-10 absolute top-[calc(100%+10px)] right-1/2 translate-x-1/2 text-xs text-white bg-gray-bg-dark rounded-lg px-2 pt-1.5 pb-2 font-normal"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (target.dataset.trackClick) {
                        window.dispatchEvent(
                          new CustomEvent(`sg-tool-click`, {
                            detail: {
                              value: `cta_pro_click_reescrever_popup_feat_pro`,
                            },
                            composed: true,
                            bubbles: true,
                          })
                        );
                      }
                    }}
                    dangerouslySetInnerHTML={{
                      __html: t('general.buttonTooltip', {
                        utmSource: 'sinonimos',
                        utmMedium: 'spell-checker_tooltip',
                        utmCampaign: 'spell-checker_tooltip',
                        linkCssClass: t('underline font-bold antialiased hover:no-underline'),
                      }),
                    }}
                  />

                  <span className="absolute w-2 h-2 top-[calc(100%+6px)] right-1/2 translate-x-1/2 bg-gray-bg-dark rotate-45"></span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 