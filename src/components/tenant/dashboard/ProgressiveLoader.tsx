
import React, { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface ProgressiveLoaderProps {
  children: React.ReactNode;
  delay?: number;
  skeleton?: React.ReactNode;
  onError?: (error: Error) => void;
}

export const ProgressiveLoader = ({ 
  children, 
  delay = 100, 
  skeleton,
  onError 
}: ProgressiveLoaderProps) => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setIsReady(true);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Progressive loading failed');
        setError(error);
        onError?.(error);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onError]);

  if (error) {
    return (
      <Card className="p-4 border-orange-200 bg-orange-50">
        <CardContent>
          <p className="text-orange-800 text-sm">
            Chargement différé en cours...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isReady) {
    return skeleton || (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
