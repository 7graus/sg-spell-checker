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
