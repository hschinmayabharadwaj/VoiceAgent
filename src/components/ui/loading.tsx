'use client';

import { motion } from 'framer-motion';
import { Loader2, Sparkles, Brain, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  return (
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    />
  );
}

interface AILoadingProps {
  message?: string;
  variant?: 'default' | 'affirmation' | 'response' | 'voice';
}

export function AILoading({ message, variant = 'default' }: AILoadingProps) {
  const { t } = useLanguage();
  
  const defaultMessages: Record<string, string> = {
    default: t('loading.ai'),
    affirmation: t('loading.affirmation'),
    response: t('loading.response'),
    voice: t('loading.voice'),
  };
  
  const icons = {
    default: Brain,
    affirmation: Sparkles,
    response: Heart,
    voice: Brain,
  };
  
  const Icon = icons[variant];
  const displayMessage = message || defaultMessages[variant];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-8 px-4"
      role="status"
      aria-live="polite"
      aria-label={displayMessage}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
        <div className="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
        </div>
        
        {/* Orbiting dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.3,
            }}
            style={{
              top: '50%',
              left: '50%',
              marginTop: -4,
              marginLeft: -4,
              transformOrigin: '4px 40px',
            }}
          />
        ))}
      </motion.div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-muted-foreground font-medium"
      >
        {displayMessage}
      </motion.p>
      
      {/* Animated dots */}
      <div className="flex gap-1 mt-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-muted rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <CardSkeleton />
    </div>
  );
}
