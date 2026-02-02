'use client';

import { useEffect, useRef } from 'react';

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
}

export function SkipLink({ targetId = 'main-content', children }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
    >
      {children || 'Skip to main content'}
    </a>
  );
}

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
}

export function FocusTrap({ children, isActive }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);
  
  return <div ref={containerRef}>{children}</div>;
}

interface VisuallyHiddenProps {
  children: React.ReactNode;
}

export function VisuallyHidden({ children }: VisuallyHiddenProps) {
  return <span className="sr-only">{children}</span>;
}

interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
}

export function LiveRegion({ 
  children, 
  politeness = 'polite',
  atomic = true 
}: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
}

// Hook for announcing messages to screen readers
export function useAnnounce() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };
  
  return { announce };
}

// Keyboard navigation helper
export function useKeyboardNavigation(
  items: HTMLElement[],
  options?: {
    loop?: boolean;
    horizontal?: boolean;
  }
) {
  const { loop = true, horizontal = false } = options || {};
  
  const handleKeyDown = (e: KeyboardEvent, currentIndex: number) => {
    const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown';
    
    let newIndex = currentIndex;
    
    if (e.key === prevKey) {
      e.preventDefault();
      newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = loop ? items.length - 1 : 0;
      }
    } else if (e.key === nextKey) {
      e.preventDefault();
      newIndex = currentIndex + 1;
      if (newIndex >= items.length) {
        newIndex = loop ? 0 : items.length - 1;
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = items.length - 1;
    }
    
    items[newIndex]?.focus();
    return newIndex;
  };
  
  return { handleKeyDown };
}
