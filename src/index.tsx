import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { SgSpellChecker as SgSpellCheckerComponent } from './components/SgSpellChecker';
import { ShadowRoot } from './components/ShadowRoot';
import { AuthContext } from './types';

interface Props {
  endpoint: string;
  projectId: string;
  tag: string;
  authContext: AuthContext;
}

// Main component wrapper
const WrappedComponent: React.FC<Props> = (props) => {
  return (
    <ShadowRoot>
      <I18nextProvider i18n={i18n}>
        <SgSpellCheckerComponent {...props} />
      </I18nextProvider>
    </ShadowRoot>
  );
};

// Mount function for external usage
function mount(container: HTMLElement, props: Props) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <WrappedComponent {...props} />
    </React.StrictMode>
  );
  return () => root.unmount();
}

// Export both the component and mount function
export { WrappedComponent as SgSpellChecker, mount };

// For UMD build
const lib = {
  SgSpellChecker: WrappedComponent,
  mount
};

export default lib; 