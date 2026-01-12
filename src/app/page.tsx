
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from "@/components/ui/skeleton";

export default function RootPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  useEffect(() => {
    // Fallback: si después de 3 segundos no hay redirección, usar navegación nativa
    const fallbackTimer = setTimeout(() => {
      if (!redirectAttempted) {
        console.log('[SmartStudent] Fallback: redirigiendo con window.location');
        window.location.href = '/login.html';
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [redirectAttempted]);

  useEffect(() => {
    if (!isLoading) {
      setRedirectAttempted(true);
      try {
        if (isAuthenticated) {
          router.replace('/dashboard');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error('[SmartStudent] Error en router, usando fallback:', error);
        // Fallback a navegación nativa
        window.location.href = isAuthenticated ? '/dashboard.html' : '/login.html';
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Display a loading state or a blank page while checking auth
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="space-y-4 p-8 rounded-lg shadow-lg bg-card w-full max-w-sm">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <p className="text-xs text-center text-muted-foreground mt-4">Cargando...</p>
      </div>
    </div>
  );
}
