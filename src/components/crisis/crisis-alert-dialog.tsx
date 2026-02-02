'use client';

import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, MessageSquare, Heart, ExternalLink, AlertTriangle } from 'lucide-react';
import { CrisisLevel, HELPLINES, getHelplinesByCountry } from '@/lib/crisis-detection';
import { useLanguage } from '@/contexts/language-context';
import { motion, AnimatePresence } from 'framer-motion';

interface CrisisAlertDialogProps {
  crisisLevel: CrisisLevel | null;
  isOpen: boolean;
  onClose: () => void;
  onContinue?: () => void;
}

export function CrisisAlertDialog({
  crisisLevel,
  isOpen,
  onClose,
  onContinue,
}: CrisisAlertDialogProps) {
  const { t, language } = useLanguage();
  const [showAllHelplines, setShowAllHelplines] = useState(false);
  const helplines = getHelplinesByCountry();
  
  if (!crisisLevel || crisisLevel.level === 'none') return null;
  
  const isCritical = crisisLevel.level === 'critical' || crisisLevel.level === 'high';
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${
              isCritical ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
            }`}>
              {isCritical ? (
                <AlertTriangle className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Heart className="w-6 h-6" aria-hidden="true" />
              )}
            </div>
            <AlertDialogTitle className="text-xl">
              {isCritical ? t('crisis.titleUrgent') : t('crisis.titleSupport')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base leading-relaxed">
            {isCritical 
              ? t('crisis.messageUrgent')
              : t('crisis.messageSupport')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 my-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            {t('crisis.helplineTitle')}
          </h4>
          
          <AnimatePresence>
            {helplines.slice(0, showAllHelplines ? undefined : 2).map((helpline, index) => (
              <motion.div
                key={helpline.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${isCritical ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h5 className="font-semibold text-foreground">{helpline.name}</h5>
                        <p className="text-sm text-muted-foreground mt-1">{helpline.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('crisis.available')}: {helpline.available}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {helpline.number.includes('Text') ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => window.open(`sms:741741?body=HOME`, '_blank')}
                            aria-label={`Text ${helpline.name}`}
                          >
                            <MessageSquare className="w-4 h-4" />
                            Text
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => window.open(`tel:${helpline.number.replace(/\D/g, '')}`, '_blank')}
                            aria-label={`Call ${helpline.name} at ${helpline.number}`}
                          >
                            <Phone className="w-4 h-4" />
                            {helpline.number}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {helplines.length > 2 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowAllHelplines(!showAllHelplines)}
            >
              {showAllHelplines ? t('crisis.showLess') : t('crisis.showMore')}
            </Button>
          )}
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 text-sm">
          <p className="text-muted-foreground">
            <strong>{t('crisis.reminder')}:</strong> {t('crisis.reminderText')}
          </p>
        </div>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose}>
              {t('crisis.close')}
            </Button>
          </AlertDialogCancel>
          {onContinue && !isCritical && (
            <AlertDialogAction asChild>
              <Button onClick={onContinue}>
                {t('crisis.continue')}
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
