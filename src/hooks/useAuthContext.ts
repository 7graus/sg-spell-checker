import { useState, useEffect } from 'react';

interface AuthContextEvent extends CustomEvent {
  detail: {
    isLogged: boolean;
    isPremium: boolean;
  };
}

export function useAuthContext() {
  const [authContext, setAuthContext] = useState({
    isLogged: false,
    isPro: false,
  });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initial check of data attributes
    const sgContext = document.querySelector('sg-a-context');
    const slottedElement = sgContext?.querySelector('*');

    const updateAuthContext = (element: Element) => {
      const isLogged = element.getAttribute('data-sg-a-context') === 'true';
      const isPremium = element.getAttribute('data-sg-isp') === '1';

      setAuthContext({
        isLogged,
        isPro: isPremium,
      });
      setIsInitialized(true);
    };

    if (slottedElement) {
      updateAuthContext(slottedElement);

      // Create a MutationObserver to watch for attribute changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-sg-isp') {
            updateAuthContext(slottedElement);
          }
        });
      });

      // Start observing the slotted element for attribute changes
      observer.observe(slottedElement, {
        attributes: true,
        attributeFilter: ['data-sg-isp', 'data-sg-a-context'],
      });

      // Cleanup observer on unmount
      return () => observer.disconnect();
    }

    const handleAuthContextChange = (event: AuthContextEvent) => {
      console.log('React received auth context:', event.detail);
      setAuthContext({
        isLogged: event.detail.isLogged,
        isPro: event.detail.isPremium,
      });
      setIsInitialized(true);
    };

    // Listen on both document and sg-a-context element
    document.addEventListener('auth-context-changed', handleAuthContextChange as EventListener);

    if (sgContext) {
      sgContext.addEventListener('auth-context-changed', handleAuthContextChange as EventListener);
    }

    // Request auth context
    const event = new CustomEvent('get-auth-context', {
      bubbles: true,
      composed: true,
    });
    document.dispatchEvent(event);

    return () => {
      document.removeEventListener(
        'auth-context-changed',
        handleAuthContextChange as EventListener
      );
      if (sgContext) {
        sgContext.removeEventListener(
          'auth-context-changed',
          handleAuthContextChange as EventListener
        );
      }
    };
  }, []);

  return {
    ...authContext,
    isInitialized,
  };
}
