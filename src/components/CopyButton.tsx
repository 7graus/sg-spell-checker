import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  textCopied: string;
  value: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  textCopied,
  value,
}) => {
  const [copied, setCopied] = useState(false);

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
      className={`border rounded-full text-sm py-1.5 px-3 flex items-center gap-1 transition-all duration-300
        ${
          copied
            ? 'bg-green-success border-green-success-border text-white'
            : 'text-gray-button hover:bg-gray-bg border-gray-border-secondary'
        }`}
      
    >
      <span>{copied ? textCopied : text}</span>
      {copied ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}; 