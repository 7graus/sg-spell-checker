# SG Spell Checker Texts React Component

A React component for text rewriting with various styles and creativity levels.

## Features

- Rich text editor with TipTap
- Multiple writing styles (Normal, Formal, Casual)
- Adjustable creativity levels
- Word exclusion support
- Ad integration
- User feedback system
- Internationalization support
- Tailwind CSS styling

## Installation

```bash
npm install sg-spell-checker
```

## Usage

```jsx
import { SgSpellChecker } from 'sg-spell-checker';

function App() {
  return (
    <SgSpellChecker
      endpoint="https://api.example.com/spell-checker"
      showWordInput={true}
      langCode="pt"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| endpoint | string | - | API endpoint for text rewriting |
| endpointAds | string | '' | API endpoint for ads |
| endpointUpdAds | string | '' | API endpoint for updating ads |
| endpointFeedback | string | '' | API endpoint for user feedback |
| sitekey | string | '' | reCAPTCHA site key |
| showWordInput | boolean | true | Show word exclusion input |
| redirect | boolean | false | Enable redirection |
| debug | boolean | false | Enable debug mode |
| redirectPlaceholder | string | 'teste?w=to&w=$toRewrite' | Redirect URL template |
| toExclude | string | '' | Initial excluded words |
| toRewrite | string | '' | Initial text to spell-checker |
| tag | string | '' | Tag for analytics |
| idTool | string | '' | Tool ID |
| adType | 'adPlacement' \| 'preloader' | 'adPlacement' | Type of ad to display |
| adPlacementClientId | string | '' | Ad placement client ID |
| adPlacementAdChannelId | string | '' | Ad placement channel ID |
| langCode | string | 'pt' | Language code |
| projectId | string | '0' | Project ID |
| utmSource | string | '' | UTM source |
| authContext | { isLogged: boolean; isPremium: boolean } | undefined | Authentication context |

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Lint code:
```bash
npm run lint
```

5. Format code:
```bash
npm run format
```

## License

MIT 