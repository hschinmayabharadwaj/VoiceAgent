'use client';

import { useEffect } from 'react';
import { useServiceWorker } from '@/hooks/use-service-worker';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ServiceWorkerUpdater() {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  
  if (!isUpdateAvailable) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground px-4 py-3 shadow-lg"
        role="alert"
      >
        <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
          <p className="font-medium">A new version is available!</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={updateServiceWorker}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Update Now
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
