export function isSubmitDisabled(params: {
  loading: boolean;
  editorValue?: string;
  isPro?: boolean;
  maxChars?: number;
}) {
  const { loading, editorValue, isPro = false, maxChars = 1000 } = params;

  // Check if loading
  if (loading) return true;

  // Check if editor has content (optional)
  // if (editorValue !== undefined && editorValue.trim().length === 0) return true;

  // Check character limit for non-pro users
  if (!isPro && editorValue !== undefined && editorValue.length > maxChars) return true;

  return false;
} 