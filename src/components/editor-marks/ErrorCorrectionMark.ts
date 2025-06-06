import { Mark } from '@tiptap/core';

export const ErrorCorrectionMark = Mark.create({
  name: 'errorCorrection',
  addAttributes() {
    return {
      class: {
        default: 'error-correction',
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'span.error-correction',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ['span', { ...HTMLAttributes, class: 'error-correction' }, 0];
  },
}); 