'use client';

import { ReactNode, useEffect, useState } from 'react';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { OnlineStatusProvider } from '@/contexts/online-status-context';
import { OfflineBanner } from '@/components/offline/offline-banner';
import { ServiceWorkerUpdater } from '@/components/pwa/service-worker-updater';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export function AppProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <OnlineStatusProvider>
            <OfflineBanner />
            <ServiceWorkerUpdater />
            {children}
            <InstallPrompt />
          </OnlineStatusProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
