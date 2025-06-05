import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface ShadowRootProps {
  children: React.ReactNode;
}

// Import the CSS as a string
import compiledCss from '../styles/shadow.css?inline';

const styles = `
  :host {
    display: block;
    width: 100%;
    height: 100%;
    isolation: isolate;
  }

  #app-mount {
    width: 100%;
    height: 100%;
  }

  ${compiledCss}
`;

export const ShadowRoot: React.FC<ShadowRootProps> = ({ children }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mountPoint, setMountPoint] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Create shadow root if it doesn't exist
    const root = host.shadowRoot || host.attachShadow({ 
      mode: 'open',
      delegatesFocus: true // Better focus handling for iOS
    });
    
    // Create a container for styles and content
    const container = document.createElement('div');
    container.id = 'shadow-container';
    
    // Add styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    container.appendChild(styleSheet);

    // Add mount point
    const mount = document.createElement('div');
    mount.id = 'app-mount';
    container.appendChild(mount);

    // Clear existing content and append new container
    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    root.appendChild(container);
    
    setMountPoint(mount);

    return () => {
      setMountPoint(null);
      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }
    };
  }, []);

  return (
    <div ref={hostRef} className="shadow-host">
      {mountPoint && createPortal(children, mountPoint)}
    </div>
  );
}; 