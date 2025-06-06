import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface ErrorHoverCardProps {
  suggestions: string[];
  type: 'spelling' | 'grammar';
  onSuggestionClick: (suggestion: string) => void;
  onClose: () => void;
  targetElement: HTMLElement | null;
}

export const ErrorHoverCard: React.FC<ErrorHoverCardProps> = ({
  suggestions,
  type,
  onSuggestionClick,
  onClose,
  targetElement,
}) => {
  const { t } = useTranslation();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (!targetElement || !cardRef.current) return;
      const rect = targetElement.getBoundingClientRect();
      console.log(document.querySelector(targetElement.className));
      console.log('--------------------------------');
      console.log('targetElement', targetElement);
      console.log('rect', rect);
      const cardHeight = cardRef.current.offsetHeight;
      const cardWidth = cardRef.current.offsetWidth;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Position the card directly under the error
      let top = rect.bottom + window.scrollY + 5; // 5px gap
      let left = rect.left + window.scrollX;

      // If the card would go off the bottom of the screen, position it above the error
      if (top + cardHeight > windowHeight + window.scrollY) {
        top = rect.top + window.scrollY - cardHeight - 5; // 5px gap
      }

      // If the card would go off the right side of the screen, align it to the right edge
      if (left + cardWidth > windowWidth + window.scrollX) {
        left = windowWidth + window.scrollX - cardWidth - 10; // 10px margin from right edge
      }

      setPosition({ top, left });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [targetElement]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={cardRef}
      className="error-card fixed z-[9999] bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[200px]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      onClick={handleCardClick}
    >
      <div className="flex justify-start items-center mb-2">
        {type === 'spelling' ? (
          <div className="w-4 h-4 rounded-full bg-errorType-spelling-border mr-2" />
        ) : (
          <div className="w-4 h-4 rounded-full bg-errorType-grammar-border mr-2" />
        )}
        <div className="text-sm font-bold text-gray-700">
          {t(`editor.card.title.${type}`)}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors absolute top-2 right-2"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>
      <div className="space-y-1">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}; 