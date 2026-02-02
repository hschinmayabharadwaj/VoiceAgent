'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ThemeSelector } from '@/components/settings/theme-selector';
import { LanguageSelector } from '@/components/settings/language-selector';
import { EmergencyContactsManager } from '@/components/crisis/emergency-contacts';
import { InstallButton } from '@/components/pwa/install-prompt';
import { useOnboarding } from '@/components/onboarding/onboarding-flow';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';
import { RotateCcw, Info, Download, Trash2, RefreshCw, Check } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { resetOnboarding } = useOnboarding();
  const [isClearing, setIsClearing] = useState(false);
  const [clearComplete, setClearComplete] = useState(false);
  
  const clearAllCaches = async () => {
    setIsClearing(true);
    try {
      // Unregister service workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
      
      // Clear all caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          await caches.delete(cacheName);
        }
      }
      
      // Clear localStorage (except important keys)
      const keysToKeep = Object.keys(localStorage).filter(k => 
        k.startsWith('firebase') || k.includes('auth')
      );
      const savedData: Record<string, string | null> = {};
      keysToKeep.forEach(key => {
        savedData[key] = localStorage.getItem(key);
      });
      localStorage.clear();
      keysToKeep.forEach(key => {
        if (savedData[key]) localStorage.setItem(key, savedData[key]!);
      });
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      setClearComplete(true);
      
      // Reload after a delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error clearing caches:', error);
      setIsClearing(false);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col">
      <PageHeader breadcrumbs={[{ href: '/', label: t('nav.dashboard') }, { label: t('common.settings') }]} />
      
      <motion.div
        className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerItemVariants} className="mb-8">
          <h1 className="text-3xl font-bold font-headline">{t('common.settings')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('settings.customizeDesc')}
          </p>
        </motion.div>
        
        <div className="space-y-6">
          <motion.div variants={staggerItemVariants}>
            <ThemeSelector />
          </motion.div>
          
          <motion.div variants={staggerItemVariants}>
            <LanguageSelector />
          </motion.div>
          
          <motion.div variants={staggerItemVariants}>
            <EmergencyContactsManager />
          </motion.div>
          
          {/* App Installation */}
          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" aria-hidden="true" />
                  <CardTitle>{t('settings.installApp')}</CardTitle>
                </div>
                <CardDescription>
                  {t('settings.installAppDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InstallButton />
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Reset Onboarding */}
          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" aria-hidden="true" />
                  <CardTitle>{t('settings.tutorial')}</CardTitle>
                </div>
                <CardDescription>
                  {t('settings.tutorialDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={resetOnboarding} className="gap-2">
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  {t('settings.restartTutorial')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Clear Cache */}
          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-primary" aria-hidden="true" />
                  <CardTitle>Clear App Cache</CardTitle>
                </div>
                <CardDescription>
                  Clear cached data and refresh the app. Use this if the app is not updating properly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {clearComplete ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-4 h-4" />
                    <span>Cache cleared! Reloading...</span>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={clearAllCaches} 
                    disabled={isClearing}
                    className="gap-2"
                  >
                    {isClearing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        Clear Cache &amp; Reload
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* About */}
          <motion.div variants={staggerItemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.about')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{t('settings.version')} 1.0.0</p>
                <p>
                  {t('settings.aboutDesc')}
                </p>
                <p className="pt-2">
                  <strong>{t('settings.crisisSupport')}:</strong> {t('settings.crisisSupportDesc')}
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>988 Suicide & Crisis Lifeline (US): Call or text 988</li>
                  <li>Crisis Text Line: Text HOME to 741741</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
