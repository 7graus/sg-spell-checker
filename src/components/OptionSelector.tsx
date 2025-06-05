import React from 'react';
import { ChevronDown } from 'lucide-react';
import { ButtonOption } from '../types';
import { getButtonStyles } from '../helpers/buttonStyles';

interface OptionSelectorProps {
  options: ButtonOption[];
  selectedValue: string;
  onSelect: (option: ButtonOption) => void;
  heading: string;
  isMobile?: boolean;
  onOpenDrawer?: (options: {
    type: string;
    title: string;
    options: ButtonOption[];
    selectedValue: string;
  }) => void;
}

const buttonStyles = getButtonStyles();

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  selectedValue,
  onSelect,
  heading,
  isMobile = false,
  onOpenDrawer,
}) => {
  const handleOpenDrawer = () => {
    if (onOpenDrawer) {
      onOpenDrawer({
        type: heading.toLowerCase(),
        title: heading,
        options,
        selectedValue,
      });
    }
  };

  if (isMobile) {
    const selectedOption = options.find(opt => opt.value === selectedValue);
    return (
      <button
        type="button"
        className="py-2 pl-2 pr-6 min-[360px]:pr-8 relative inline-flex text-xs min-[360px]:text-sm font-bold antialiased items-center rounded-lg bg-white border border-gray-border w-full"
        onClick={handleOpenDrawer}
      >
        <span className="text-gray-text-secondary mr-2">{heading}: </span>
        <span className="text-gray-text">
          {selectedOption?.label}
        </span>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-text">
          <ChevronDown size={15} />
        </div>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-1 md:flex-none">
      <span className="font-bold text-sm">
        <b>{heading}:</b>
      </span>
      <div className="inline-flex">
        {options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option)}
            className={
              `relative group hover:underline ` +
              buttonStyles.toolOptions.base +
              (index === 0 ? ` ${buttonStyles.toolOptions.rounded.left}` : '') +
              (index === options.length - 1 ? ` ${buttonStyles.toolOptions.rounded.right}` : '') +
              (selectedValue === option.value
                ? ` ${buttonStyles.toolOptions.state.active}`
                : ` ${buttonStyles.toolOptions.state.normal}`)
            }
          >
            {option.label}
            <span className="hidden group-hover:block min-w-[200px] z-10 absolute top-[calc(100%+10px)] right-1/2 translate-x-1/2 text-xs text-white bg-gray-bg-dark rounded-lg px-2 py-2 font-normal">
              {option.description}
            </span>
            <span className="hidden group-hover:block absolute w-2 h-2 top-[calc(100%+5px)] right-1/2 translate-x-1/2 bg-gray-bg-dark rotate-45"></span>
          </button>
        ))}
      </div>
    </div>
  );
}; 