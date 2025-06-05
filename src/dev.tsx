import React from 'react';
import { createRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { SgSpellChecker } from './components/SgSpellChecker';
import { ShadowRoot } from './components/ShadowRoot';

const mockAuthContext = {
  isAuthenticated: true,
  isPro: false,
  isLogged: true,
  isAdmin: false,
  isBlocked: false,
  isLimitReached: false,
  isRecaptchaRequired: false,
  isHpRequired: false,
  isWordInputRequired: true,
  isAdRequired: true,
  isPreloaderRequired: false,
  isRedirectRequired: false,
  isProRequired: false,
  isLoginRequired: false,
  isBlockedRequired: false,
  isLimitReachedRequired: false,
  isRecaptchaValidationRequired: false,
  isHpValidationRequired: false,
  isWordInputValidationRequired: false,
  isAdValidationRequired: false,
  isPreloaderValidationRequired: false,
  isRedirectValidationRequired: false,
  isProValidationRequired: false,
  isLoginValidationRequired: false,
  isBlockedValidationRequired: false,
  isLimitReachedValidationRequired: false,
};

// const LanguageSwitcher = () => {
//   const { i18n } = useTranslation();

//   return (
//     <div className="absolute top-4 right-4">
//       <select
//         value={i18n.language}
//         onChange={(e) => i18n.changeLanguage(e.target.value)}
//         className="bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//       >
//         <option value="pt">Português</option>
//         <option value="en">English</option>
//       </select>
//     </div>
//   );
// };

const App = () => {
  return (
    <ShadowRoot>
      <I18nextProvider i18n={i18n}>
        <div className="p-4 md:p-10">
          {/* <div className="min-h-screen bg-gray-50 py-8 relative"> */}
          {/* <LanguageSwitcher /> */}
          <SgSpellChecker
            endpoint="https://sinonimos-br.test/api/index.php?method=getspellchecker"
            endpointFeedbackProject='https://sinonimos-br.test/api/index.php?method=toolFeedback'
            projectId="11"
            tag="development"
            authContext={mockAuthContext}
          />
          {/* </div> */}
        </div>
      </I18nextProvider>
    </ShadowRoot>
  );
};

// Ensure the DOM is loaded before mounting
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (!container) {
    console.error('Root element not found');
    return;
  }

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}); 