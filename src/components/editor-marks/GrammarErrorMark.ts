import { Mark } from '@tiptap/core';

export const GrammarErrorMark = Mark.create({
  name: 'grammarError',
  addAttributes() {
    return {
      class: {
        default: 'grammar-error',
      },
      source: {
        default: null,
      },
      suggestions: {
        default: [],
        parseHTML: element => {
          const suggestions = element.getAttribute('data-suggestions');
          return suggestions ? JSON.parse(suggestions) : [];
        },
        renderHTML: attributes => {
          return {
            'data-suggestions': JSON.stringify(attributes.suggestions),
          };
        },
      },
      explanation: {
        default: '',
        parseHTML: element => element.getAttribute('data-explanation'),
        renderHTML: attributes => {
          return {
            'data-explanation': attributes.explanation,
          };
        },
      },
      errorCorrected: {
        default: false,
        parseHTML: element => element.classList.contains('error-corrected'),
        renderHTML: attributes => {
          return {
            class: attributes.errorCorrected ? 'error-corrected' : null,
          };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span.grammar-error',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const classes = ['grammar-error'];
    if (HTMLAttributes.class) classes.push(HTMLAttributes.class);
    if (HTMLAttributes.source) classes.push(`source-${HTMLAttributes.source}`);
    return [
      'span',
      {
        'data-suggestions': HTMLAttributes['data-suggestions'],
        'data-explanation': HTMLAttributes['data-explanation'],
        class: classes.join(' '),
      },
      0,
    ];
  },
});
