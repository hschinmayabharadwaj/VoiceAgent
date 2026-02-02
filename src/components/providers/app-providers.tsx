'use client';

import { ReactNode, useEffect, useState } from 'react';
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { OnlineStatusProvider } from '@/contexts/online-status-context';
import { OfflineBanner } from '@/components/offline/offline-banner';
import { ServiceWorkerUpdater } from '@/components/pwa/service-worker-updater';
import { InstallPrompt } from '@/components/pwa/install-prompt';
import { OnboardingFlow, useOnboarding } from '@/components/onboarding/onboarding-flow';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SkipLink } from '@/components/accessibility/a11y-utils';
import { AnimatePresence } from 'framer-motion';

function OnboardingWrapper({ children }: { children: ReactNode }) {
  const { showOnboarding, isLoading, completeOnboarding } = useOnboarding();
  
  if (isLoading) {
    return <>{children}</>;
  }
  
  return (
    <>
      <AnimatePresence>
        {showOnboarding && <OnboardingFlow onComplete={completeOnboarding} />}
      </AnimatePresence>
      {children}
    </>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Prevent hydration mismatch - render children without context on server
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <OnlineStatusProvider>
            <SkipLink targetId="main-content" />
            <OfflineBanner />
            <ServiceWorkerUpdater />
            <OnboardingWrapper>
              {children}
            </OnboardingWrapper>
            <InstallPrompt />
          </OnlineStatusProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
