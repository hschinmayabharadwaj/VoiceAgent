'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  Mic,
  Brain,
  Gamepad2,
  Shield,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const ONBOARDING_COMPLETED_KEY = 'manasmitra_onboarding_completed';

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    setShowOnboarding(!completed);
    setIsLoading(false);
  }, []);
  
  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    setShowOnboarding(false);
  };
  
  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
    setShowOnboarding(true);
  };
  
  return { showOnboarding, isLoading, completeOnboarding, resetOnboarding };
}

interface OnboardingStep {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const steps: OnboardingStep[] = [
  { id: 'welcome', icon: Sparkles, iconColor: 'text-primary', iconBg: 'bg-primary/10' },
  { id: 'features', icon: Heart, iconColor: 'text-rose-500', iconBg: 'bg-rose-100' },
  { id: 'privacy', icon: Shield, iconColor: 'text-blue-500', iconBg: 'bg-blue-100' },
  { id: 'crisis', icon: Heart, iconColor: 'text-green-500', iconBg: 'bg-green-100' },
];

const features = [
  { icon: Heart, color: 'text-rose-500', id: 'feature1' },
  { icon: Mic, color: 'text-blue-500', id: 'feature2' },
  { icon: Brain, color: 'text-purple-500', id: 'feature3' },
  { icon: Gamepad2, color: 'text-amber-500', id: 'feature4' },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  const step = steps[currentStep];
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Onboarding tutorial"
    >
      <Card className="w-full max-w-lg overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          {/* Progress indicators */}
          <div className="flex gap-2 p-4 justify-center" role="tablist" aria-label="Onboarding progress">
            {steps.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-primary'
                    : index < currentStep
                    ? 'w-2 bg-primary/60'
                    : 'w-2 bg-muted'
                }`}
                role="tab"
                aria-selected={index === currentStep}
                aria-label={`Step ${index + 1} of ${steps.length}`}
              />
            ))}
          </div>
          
          {/* Content */}
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={currentStep}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="p-8"
            >
              {/* Icon */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <div className={`p-4 rounded-full ${step.iconBg}`}>
                  <step.icon className={`w-12 h-12 ${step.iconColor}`} aria-hidden="true" />
                </div>
              </motion.div>
              
              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-center mb-4 font-headline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {t(`onboarding.${step.id}`)}
              </motion.h2>
              
              {/* Description */}
              <motion.p
                className="text-center text-muted-foreground mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {t(`onboarding.${step.id}Desc`)}
              </motion.p>
              
              {/* Features grid for features step */}
              {step.id === 'features' && (
                <motion.div
                  className="grid grid-cols-2 gap-4 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <feature.icon className={`w-5 h-5 ${feature.color} flex-shrink-0 mt-0.5`} aria-hidden="true" />
                      <div>
                        <p className="font-medium text-sm">{t(`onboarding.${feature.id}`)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t(`onboarding.${feature.id}Desc`)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {/* Privacy step checkmarks */}
              {step.id === 'privacy' && (
                <motion.div
                  className="space-y-3 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {['Your data stays on your device', 'No personal info shared with third parties', 'Anonymous forum participation'].map((item, index) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation */}
          <div className="flex items-center justify-between p-4 border-t bg-muted/30">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              {t('common.back')}
            </Button>
            
            <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
              {t('common.skip')}
            </Button>
            
            <Button onClick={handleNext} className="gap-1">
              {currentStep === steps.length - 1 ? t('onboarding.getStarted') : t('common.next')}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" aria-hidden="true" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
