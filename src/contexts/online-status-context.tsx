'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface OnlineStatusContextType {
  isOnline: boolean;
  wasOffline: boolean;
  clearWasOffline: () => void;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  
  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      // Keep wasOffline true to show sync message
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const clearWasOffline = useCallback(() => {
    setWasOffline(false);
  }, []);
  
  return (
    <OnlineStatusContext.Provider value={{ isOnline, wasOffline, clearWasOffline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatus() {
  const context = useContext(OnlineStatusContext);
  
  // Return default values if used outside provider (during SSR or before mount)
  if (context === undefined) {
    return {
      isOnline: true,
      wasOffline: false,
      clearWasOffline: () => {},
    };
  }
  
  return context;
}
