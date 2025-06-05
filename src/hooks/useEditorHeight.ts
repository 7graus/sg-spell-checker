import { useEffect, useRef, useState, RefObject } from 'react';

interface UseEditorHeightProps {
  isMobile: boolean;
  editorRef: RefObject<HTMLDivElement>;
  submitButtonRef: RefObject<HTMLButtonElement>;
}

export const useEditorHeight = ({ isMobile, editorRef, submitButtonRef }: UseEditorHeightProps) => {
  const [editorHeight, setEditorHeight] = useState<number | null>(null);
  const lastWindowHeight = useRef(window.innerHeight);

  const adjustEditorHeight = () => {
    if (!isMobile) return;

    const submitButton = submitButtonRef.current;
    if (!submitButton) {
      console.error('Submit button ref not found');
      return;
    }

    const editorElement = editorRef.current;
    if (!editorElement) {
      console.error('Editor ref not found');
      return;
    }

    // Calculate height to position button at bottom of viewport
    const viewportHeight = window.innerHeight;
    const editorTop = editorElement.getBoundingClientRect().top;
    const buttonRect = submitButton.getBoundingClientRect();
    const buttonContainerHeight = buttonRect.height + 16; // 16px for p-2 padding

    // These values are hardcoded for now because the result section is not yet implemented
    const resultSectionHeight = 100;
    const bottomInfoHeight = 32;
    const viewportPadding = 30; // Extra padding from bottom of viewport

    // Height = viewport height - editor's top position - button container height - margins - viewport padding
    const availableHeight =
      viewportHeight -
      editorTop -
      buttonContainerHeight -
      resultSectionHeight -
      bottomInfoHeight -
      viewportPadding;

    if (availableHeight > 0) {
      // Set editor container height
      editorElement.style.setProperty('height', `${availableHeight}px`, 'important');
      editorElement.style.setProperty('max-height', `${availableHeight}px`, 'important');
      
      // Also set the ProseMirror element height
      const proseMirror = editorElement.querySelector('.ProseMirror') as HTMLElement;
      if (proseMirror) {
        proseMirror.style.setProperty('height', `${availableHeight - 15}px`, 'important');
        proseMirror.style.setProperty('max-height', `${availableHeight - 15}px`, 'important');
        proseMirror.style.setProperty('overflow-y', 'auto', 'important');
      }
      
      setEditorHeight(availableHeight);
    }
  };

  const handleResize = () => {
    if (!isMobile) {
      // Reset heights when not mobile
      const editorElement = editorRef.current;
      if (editorElement) {
        editorElement.style.removeProperty('height');
        editorElement.style.removeProperty('max-height');
        
        const proseMirror = editorElement.querySelector('.ProseMirror') as HTMLElement;
        if (proseMirror) {
          proseMirror.style.removeProperty('height');
          proseMirror.style.removeProperty('max-height');
        }
      }
      
      setEditorHeight(null);
      return;
    }

    const editorElement = editorRef.current;
    if (!editorElement) return;

    const currentHeight = parseInt(editorElement.style.height, 10);
    if (!currentHeight) {
      adjustEditorHeight();
      return;
    }

    const heightDiff = window.innerHeight - lastWindowHeight.current;
    const newHeight = currentHeight + heightDiff;

    if (newHeight > 0) {
      editorElement.style.setProperty('height', `${newHeight}px`, 'important');
      const proseMirror = editorElement.querySelector('.ProseMirror') as HTMLElement;
      if (proseMirror) {
        proseMirror.style.setProperty('height', `${newHeight}px`, 'important');
      }
    }

    lastWindowHeight.current = window.innerHeight;
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Initial height adjustment after a short delay to ensure elements are mounted
    const timer = setTimeout(() => {
      adjustEditorHeight();
    }, 300); // Increased timeout to ensure elements are mounted

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [isMobile]);

  // Re-adjust height when mobile state changes
  useEffect(() => {
    if (isMobile) {
      adjustEditorHeight();
    } else {
      const editorElement = editorRef.current;
      if (editorElement) {
        editorElement.style.removeProperty('height');
        editorElement.style.removeProperty('max-height');
        
        const proseMirror = editorElement.querySelector('.ProseMirror') as HTMLElement;
        if (proseMirror) {
          proseMirror.style.removeProperty('height');
          proseMirror.style.removeProperty('max-height');
        }
      }
      
      setEditorHeight(null);
    }
  }, [isMobile]);

  return { editorHeight };
}; 