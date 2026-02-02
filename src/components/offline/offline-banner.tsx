'use client';

import { useOnlineStatus } from '@/contexts/online-status-context';
import { useLanguage } from '@/contexts/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OfflineBanner() {
  const { isOnline, wasOffline, clearWasOffline } = useOnlineStatus();
  const { t } = useLanguage();
  
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-amber-950 px-4 py-3 shadow-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
            <WifiOff className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-medium">{t('common.offline')}</p>
              <p className="text-sm opacity-90">{t('common.offlineDesc')}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {isOnline && wasOffline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-green-950 px-4 py-3 shadow-lg"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
            <Wifi className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <p className="font-medium flex-1">You're back online!</p>
            <Button
              size="sm"
              variant="ghost"
              className="text-green-950 hover:bg-green-600/20"
              onClick={clearWasOffline}
            >
              Dismiss
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OfflinePage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center"
        >
          <WifiOff className="w-12 h-12 text-muted-foreground" aria-hidden="true" />
        </motion.div>
        
        <h1 className="text-2xl font-bold mb-4 font-headline">{t('offline.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('offline.description')}</p>
        
        <div className="bg-muted/50 rounded-lg p-4 text-left mb-6">
          <p className="font-medium text-sm mb-3">{t('offline.available')}</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
              {t('offline.feature1')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
              {t('offline.feature2')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
              {t('offline.feature3')}
            </li>
          </ul>
        </div>
        
        <Button
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          {t('common.retry')}
        </Button>
      </motion.div>
    </div>
  );
}
