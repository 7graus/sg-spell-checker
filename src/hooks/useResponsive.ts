import { useState, useEffect } from 'react';

// Define breakpoints
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < BREAKPOINTS.md;
    }
    return false;
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const shouldBeMobile = width < BREAKPOINTS.md;
      setIsMobile(shouldBeMobile);
    }

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile,
    isTablet: false, // Simplified for now
    isDesktop: !isMobile,
    breakpoints: BREAKPOINTS,
  };
} 