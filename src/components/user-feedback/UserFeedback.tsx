import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';

interface UserFeedbackProps {
  projectId?: number;
  projectName?: string;
  contentType?: string;
  contentId?: number;
  contentUrl?: string;
  contentTitle?: string;
  contentText?: string;
  endpoint?: string;
  logId?: string | null;
  endpointFeedbackProject?: string;
}

export const UserFeedback: React.FC<UserFeedbackProps> = ({
  projectId = 0,
  projectName = '',
  contentType = '',
  contentId = 0,
  contentUrl = '',
  contentTitle = '',
  contentText = '',
  endpoint = '',
  logId = '',
  endpointFeedbackProject,
}) => {
  const { t } = useTranslation();
  const [feedbackText, setFeedbackText] = useState('');
  const [ratingValue, setRatingValue] = useState('');
  const [idResponse, setIdResponse] = useState('');
  const [hp, setHp] = useState(false);
  const [showExtraFeedback, setShowExtraFeedback] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const postFeedback = async (submitBtn = false, ratingNps = '', ratingValue = '') => {
    if (hp) return;

    const promises = [];

    if (endpointFeedbackProject) {
      promises.push(
        fetch(`${endpointFeedbackProject}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rating_nps: ratingNps,
            rating_note: feedbackText,
            log_id: logId,
          }),
        }).then(response => response.json())
      );
    }

    promises.push(
      fetch(`${endpoint}/feedbacks/${idResponse ?? ''}`, {
        method: idResponse ? 'PUT' : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: projectId,
          project_name: projectName,
          content_title: contentTitle,
          content_url: contentUrl,
          content_type: contentType,
          content_id: contentId,
          rating_nps: ratingNps,
          rating_value: ratingValue,
          rating_note: feedbackText,
          rating_context: contentText,
          screen_width: window.innerWidth,
          user_agent: window.navigator.userAgent,
          device: window.innerWidth > 768 ? 'desktop' : 'mobile',
        }),
      }).then(async response => {
        const responseData = await response.json();
        if (!idResponse) {
          setIdResponse(responseData.data.last_inserted_id);
        }
        return responseData;
      })
    );

    try {
      await Promise.all(promises);

      if (contentText && submitBtn) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowExtraFeedback(false);
          setShowSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const setRating = (rating: number) => {
    const ratingNps = rating === 100 ? 'positive' : 'negative';
    const ratingValue = rating === 100 ? '100' : '0';
    setRatingValue(ratingValue);

    return { ratingNps, ratingValue };
  };

  const handleButtonClick = async (value: number, submitBtn = false) => {
    const { ratingNps, ratingValue } = setRating(value);
    // Wait for state to update
    await new Promise((resolve) => setTimeout(resolve, 0));
    postFeedback(submitBtn, ratingNps, ratingValue);
    setShowExtraFeedback(true);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackText(e.target.value);
  };

  const renderExtraFeedback = () => {
    return (
      <>
        {isMobile && (
          <div
            onClick={() => setShowExtraFeedback(false)}
            className="fixed inset-0 bg-black/30 z-10"
          />
        )}
        <div
          className={`z-20 max-md:fixed max-md:bottom-0 max-md:left-0 md:absolute md:ml-2 md:-mr-2 w-full md:w-[calc(100%-1rem)] md:max-w-[400px] md:min-h-[165px] md:bottom-[45px] bg-gray-bg-light md:bg-gray-bg rounded-t-xl md:rounded-xl p-3 max-md:pb-4 md:p-2 border border-gray-border shadow-md flex flex-col ${
            showSuccess ? 'justify-center' : ''
          }`}
        >
          {isMobile && !showSuccess && (
            <div className="flex items-center justify-center w-full md:hidden mb-2">
              {ratingValue === '100' ? (
                <ThumbsUp className="translate-y-[-1px] text-gray-text-secondary" size={30} />
              ) : (
                <ThumbsDown className="translate-y-[1px] text-gray-text-secondary" size={30} />
              )}
            </div>
          )}
          {showSuccess ? (
            <div className="flex flex-col gap-2 items-center text-center">
              <div className="font-barlow font-bold antialiased text-lg">
                {t('feedback.success.title')}
              </div>
              <div className="text-base mb-4">{t('feedback.success.text')}</div>
              <button
                className="font-bold font-barlow antialiased mx-auto w-max md:w-auto bg-blue text-white px-8 md:px-4 py-1 border-2 border-blue-dark text-sm rounded-full transition-all duration-300 hover:bg-blue-dark"
                onClick={() => setShowExtraFeedback(false)}
              >
                {t('feedback.close')}
              </button>
              <button
                className="absolute top-3 right-3 cursor-pointer border-0 bg-transparent p-0"
                onClick={() => setShowExtraFeedback(false)}
              >
                <X className="text-gray-text" size={17} />
              </button>
            </div>
          ) : (
            <>
              <div className="font-barlow font-bold antialiased text-base mb-2 flex items-center justify-between">
                <div>{ratingValue === '100' ? t('feedback.success1') : t('feedback.success2')}</div>
                <button
                  className="max-md:absolute max-md:top-3 max-md:right-3 cursor-pointer border-0 bg-transparent p-0"
                  onClick={() => setShowExtraFeedback(false)}
                >
                  <X className="text-gray-text" size={17} />
                </button>
              </div>
              <div className="relative flex flex-1 flex-col">
                <textarea
                  className="w-full border border-gray-border-secondary rounded-md p-2 pr-[80px] mb-2 md:mb-0 flex-1 focus:outline-blue"
                  placeholder={t('feedback.textareaPlaceholder')}
                  onChange={handleTextareaChange}
                />
                <button
                  className="font-bold font-barlow antialiased mx-auto md:mx-0 w-max md:w-auto md:absolute md:bottom-2 md:right-2 bg-blue text-white px-8 md:px-4 py-1 border-2 border-blue-dark text-sm rounded-full transition-all duration-300 hover:bg-blue-dark"
                  onClick={() => handleButtonClick(ratingValue === '100' ? 100 : 0, true)}
                >
                  {t('feedback.submit')}
                </button>
              </div>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {isMobile && showExtraFeedback && renderExtraFeedback()}
      <div className="flex items-center gap-1.5 pl-2">
        {!isMobile && (
          <span className="text-sm text-[#525B66] font-bold">{t('feedback.question')}</span>
        )}
        <button
          className={`rounded-full border p-2 transition-all duration-300 hover:bg-gray-bg ${
            ratingValue === '100' ? 'border-gray-border-active' : 'border-gray-border-inactive'
          }`}
          onClick={() => handleButtonClick(100)}
        >
          <ThumbsUp
            size={17}
            className={`translate-y-[-1px] ${
              ratingValue === '100' ? 'text-gray-text' : 'text-gray-text-secondary'
            }`}
          />
        </button>
        <button
          className={`rounded-full border p-2 transition-all duration-300 hover:bg-gray-bg ${
            ratingValue === '0' ? 'border-gray-border-active' : 'border-gray-border-inactive'
          }`}
          onClick={() => handleButtonClick(0)}
        >
          <ThumbsDown
            size={17}
            className={`translate-y-[1px] ${
              ratingValue === '0' ? 'text-gray-text' : 'text-gray-text-secondary'
            }`}
          />
        </button>
        <input style={{ display: 'none' }} onChange={() => setHp(true)} />
        {!isMobile && showExtraFeedback && renderExtraFeedback()}
      </div>
    </>
  );
};
