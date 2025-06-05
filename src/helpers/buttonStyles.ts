export const getButtonStyles = () => ({
  toolOptions: {
    base: 'p-1 px-2 gap-2 border ml-[-1px] text-sm antialiased hover:border-gray-border-hover hover:z-10 transition-all duration-200',
    state: {
      normal: 'border-gray-border-secondary hover:bg-gray-50',
      active: 'text-blue border-blue bg-[#E5F2FF] z-10 font-bold',
      disabled: 'text-gray-text-secondary border-gray-border-secondary bg-gray-300',
    },

    rounded: {
      left: 'rounded-l-md',
      right: 'rounded-r-md',
    },
  },
  cta: {
    base: 'bg-blue border-2 px-6 pt-2 pb-2.5 rounded-full flex font-bold antialiased text-lg transition-all duration-200 leading-none group w-max group font-barlow',
    text: 'flex items-center justify-center gap-2 group-[&:not(:disabled)]:drop-shadow-cta',
    enabled: 'border-blue-dark text-white hover:bg-blue-dark',
    disabled:
      'disabled:cursor-not-allowed disabled:border-gray-bg-medium disabled:bg-gray-bg-medium disabled:text-gray-text-disabled',
    loading: 'bg-blue border border-blue-dark text-white',
    shine:
      'relative overflow-hidden before:animate-shine-1 before:absolute before:inset-0 before:w-[50%] before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:blur-sm',
  },
  gray: {
    base: 'px-3 py-1.5 text-sm border border-gray-border-dark rounded-full flex items-center gap-2 text-gray-text-secondary hover:bg-gray-bg transition-all duration-200',
  },
});
