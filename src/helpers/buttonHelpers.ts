import { ButtonOption } from '../types';

export function isSubmitDisabled(params: {
  loading: boolean;
  selectedStyle: ButtonOption | null;
  selectedCreativity: ButtonOption | null;
  editorValue?: string;
  isPro?: boolean;
  maxChars?: number;
}) {
  const { loading, selectedStyle, selectedCreativity, editorValue, isPro = false, maxChars = 1000 } = params;

  // Check if loading
  if (loading) return true;

  // Check if required options are selected
  if (!selectedStyle || !selectedCreativity) return true;

  // Check if editor has content (optional)
  // if (editorValue !== undefined && editorValue.trim().length === 0) return true;

  // Check character limit for non-pro users
  if (!isPro && editorValue !== undefined && editorValue.length > maxChars) return true;

  return false;
} 