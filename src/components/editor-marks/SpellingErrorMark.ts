import { Mark } from '@tiptap/core';

export const SpellingErrorMark = Mark.create({
  name: 'spellingError',
  addAttributes() {
    return {
      class: {
        default: 'spelling-error',
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
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span.spelling-error',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const source = HTMLAttributes.source
      ? ` source-${HTMLAttributes.source}`
      : '';
    return ['span', { ...HTMLAttributes, class: `spelling-error${source}` }, 0];
  },
});
