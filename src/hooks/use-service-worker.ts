'use client';

import { useEffect, useState } from 'react';

export function useServiceWorker() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }
    
    const registerSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none', // Always fetch fresh SW
        });
        
        setRegistration(reg);
        setIsInstalled(true);
        
        // Force update check on page load
        reg.update();
        
        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setIsUpdateAvailable(true);
                // Auto-update for better UX
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });
        
        // Listen for SW update messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data?.type === 'SW_UPDATED') {
            // SW was updated, reload to get fresh content
            window.location.reload();
          }
        });
        
        // Check for updates periodically
        setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000); // Every hour
        
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };
    
    registerSW();
  }, []);
  
  const updateServiceWorker = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };
  
  return {
    isInstalled,
    isUpdateAvailable,
    updateServiceWorker,
    registration,
  };
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    
    // Check for iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    
    // Listen for install prompt
    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstall as EventListener);
    
    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as EventListener);
    };
  }, []);
  
  const promptInstall = async () => {
    if (!installPrompt) return false;
    
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
      return true;
    }
    
    return false;
  };
  
  return {
    canInstall: !!installPrompt || (isIOS && !isInstalled),
    isInstalled,
    isIOS,
    promptInstall,
  };
}

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
