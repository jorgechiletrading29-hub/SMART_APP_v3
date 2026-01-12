"use client";

import { useEffect, useState } from 'react';

// Tipos para Capacitor
interface CapacitorInfo {
  isNative: boolean;
  platform: 'web' | 'ios' | 'android';
  isAndroid: boolean;
  isIOS: boolean;
  isWeb: boolean;
}

/**
 * Hook para detectar si la app está corriendo en Capacitor (nativo)
 * y proporcionar información de la plataforma
 */
export function useCapacitor(): CapacitorInfo {
  const [info, setInfo] = useState<CapacitorInfo>({
    isNative: false,
    platform: 'web',
    isAndroid: false,
    isIOS: false,
    isWeb: true,
  });

  useEffect(() => {
    // Verificar si Capacitor está disponible
    const checkCapacitor = async () => {
      try {
        // @ts-ignore - Capacitor se carga dinámicamente
        const { Capacitor } = await import('@capacitor/core');
        
        if (Capacitor && Capacitor.isNativePlatform()) {
          const platform = Capacitor.getPlatform();
          setInfo({
            isNative: true,
            platform: platform as 'web' | 'ios' | 'android',
            isAndroid: platform === 'android',
            isIOS: platform === 'ios',
            isWeb: platform === 'web',
          });
        }
      } catch (error) {
        // Capacitor no está disponible (estamos en web pura)
        console.log('Running in web mode (Capacitor not available)');
      }
    };

    checkCapacitor();
  }, []);

  return info;
}

/**
 * Hook para manejar el botón de retroceso en Android
 */
export function useAndroidBackButton(callback?: () => boolean | void) {
  const { isAndroid } = useCapacitor();

  useEffect(() => {
    if (!isAndroid) return;

    const handleBackButton = async () => {
      try {
        const { App } = await import('@capacitor/app');
        
        App.addListener('backButton', ({ canGoBack }) => {
          if (callback) {
            const handled = callback();
            if (handled) return;
          }
          
          if (canGoBack) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });
      } catch (error) {
        console.log('App plugin not available');
      }
    };

    handleBackButton();

    return () => {
      // Cleanup listeners if needed
    };
  }, [isAndroid, callback]);
}

/**
 * Hook para inicializar plugins de Capacitor al inicio
 */
export function useCapacitorInit() {
  const { isNative, isAndroid } = useCapacitor();

  useEffect(() => {
    if (!isNative) return;

    const initPlugins = async () => {
      try {
        // Inicializar Splash Screen
        const { SplashScreen } = await import('@capacitor/splash-screen');
        
        // Ocultar splash screen después de 2 segundos
        setTimeout(() => {
          SplashScreen.hide({
            fadeOutDuration: 300,
          });
        }, 2000);

        // Configurar Status Bar en Android
        if (isAndroid) {
          const { StatusBar, Style } = await import('@capacitor/status-bar');
          
          StatusBar.setBackgroundColor({ color: '#1a1a2e' });
          StatusBar.setStyle({ style: Style.Dark });
        }
      } catch (error) {
        console.log('Error initializing Capacitor plugins:', error);
      }
    };

    initPlugins();
  }, [isNative, isAndroid]);
}

/**
 * Función para verificar si estamos en modo nativo
 */
export async function isNativePlatform(): Promise<boolean> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * Función para obtener la plataforma actual
 */
export async function getPlatform(): Promise<'web' | 'ios' | 'android'> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    return Capacitor.getPlatform() as 'web' | 'ios' | 'android';
  } catch {
    return 'web';
  }
}
