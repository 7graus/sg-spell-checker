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
    const source = HTMLAttributes.source
      ? ` source-${HTMLAttributes.source}`
      : '';
    return ['span', { ...HTMLAttributes, class: `grammar-error${source}` }, 0];
  },
});
