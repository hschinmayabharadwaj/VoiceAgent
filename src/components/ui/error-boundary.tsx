'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset?: () => void;
  title?: string;
  description?: string;
}

export function ErrorFallback({
  error,
  onReset,
  title = 'Something went wrong',
  description = "We're sorry, but something unexpected happened. Please try again.",
}: ErrorFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-[400px] flex items-center justify-center p-4"
      role="alert"
      aria-live="assertive"
    >
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center"
          >
            <AlertTriangle className="w-8 h-8 text-destructive" aria-hidden="true" />
          </motion.div>
          
          <h2 className="text-xl font-bold mb-2 font-headline">{title}</h2>
          <p className="text-muted-foreground mb-6">{description}</p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Error details (dev only)
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-32">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
          
          <div className="flex gap-3 justify-center">
            {onReset && (
              <Button onClick={onReset} className="gap-2">
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </Button>
            )}
            <Button variant="outline" asChild className="gap-2">
              <Link href="/">
                <Home className="w-4 h-4" aria-hidden="true" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
}

export function InlineError({ message, onRetry }: InlineErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-lg bg-destructive/10 border border-destructive/20 p-4"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm text-destructive">{message}</p>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="mt-2 h-8 px-3 text-destructive hover:text-destructive"
            >
              <RefreshCw className="w-3 h-3 mr-1" aria-hidden="true" />
              Retry
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
