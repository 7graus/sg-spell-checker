import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CopyButtonProps {
  value: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  value,
}) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = async () => {
    try {
      // Convert <br> tags to actual line breaks
      const formattedText = value.replace(/<br\s*\/?>/gi, '\n');
      await navigator.clipboard.writeText(formattedText);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
     <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? t('general.copied') : t('general.copy')}
      className={`w-[36px] h-[36px] cursor-pointer border rounded-full flex items-center justify-center transition-all duration-300
        ${
          copied
            ? 'bg-green-success border-green-success-border text-white'
            : 'hover:bg-gray-bg border-gray-border-secondary text-gray-text-secondary'
        }`}
      
    >
      {copied ? (
        <Check size={17}  />
      ) : (
        <Copy size={17}  />
      )}
    </button>
  );
}; 