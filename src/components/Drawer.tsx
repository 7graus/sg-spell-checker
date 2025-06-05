import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ButtonOption } from '../types';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: ButtonOption[];
  onSelect: (option: ButtonOption) => void;
  selectedValue?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  options,
  onSelect,
  selectedValue,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match the animation duration
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-[9999] transition-opacity duration-300 ease-in-out ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      tabIndex={0}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl py-3 px-2 shadow-lg max-h-[80vh] overflow-y-auto z-[10000] transform transition-transform duration-300 ease-in-out ${
          isClosing ? 'animate-slide-down' : 'animate-slide-up'
        }`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4 hidden"></div>

        <div className="flex justify-between items-center mb-2">
          <div className="text-lg pl-4 font-bold text-gray-900">{title}</div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-gray-text-secondary hover:bg-gray-100 hover:text-gray-text transition-colors duration-200"
            aria-label="Close"
          >
            <X size={24} className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col space-y-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSelect(option);
                handleClose();
              }}
              className={`w-full text-left p-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-bold antialiased text-base pl-4 ${
                option.value === selectedValue
                  ? 'bg-blue-bg text-blue-dark'
                  : 'text-gray-text hover:bg-gray-50 active:bg-gray-100'
              }`}
              role="menuitem"
            >
              {option.icon && (
                <div className="bg-blue-bg rounded-md p-1 w-8 h-8 shrink-0 flex items-center justify-center">
                  {option.icon}
                </div>
              )}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 