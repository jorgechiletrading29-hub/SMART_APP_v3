"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CapacitorContextType {
  isNative: boolean;
  platform: 'web' | 'ios' | 'android';
  isReady: boolean;
  isAndroid: boolean;
  isIOS: boolean;
}

const CapacitorContext = createContext<CapacitorContextType>({
  isNative: false,
  platform: 'web',
  isReady: false,
  isAndroid: false,
  isIOS: false,
});

export const useCapacitorContext = () => useContext(CapacitorContext);

interface CapacitorProviderProps {
  children: ReactNode;
}

/**
 * Provider que inicializa Capacitor y sus plugins
 * Debe envolver la aplicación para usar funcionalidades nativas
 */
export function CapacitorProvider({ children }: CapacitorProviderProps) {
  const [state, setState] = useState<CapacitorContextType>({
    isNative: false,
    platform: 'web',
    isReady: false,
    isAndroid: false,
    isIOS: false,
  });

  useEffect(() => {
    const initCapacitor = async () => {
      try {
        // Importar Capacitor dinámicamente
        const { Capacitor } = await import('@capacitor/core');
        
        const isNative = Capacitor.isNativePlatform();
        const platform = Capacitor.getPlatform() as 'web' | 'ios' | 'android';
        
        setState({
          isNative,
          platform,
          isReady: true,
          isAndroid: platform === 'android',
          isIOS: platform === 'ios',
        });

        // Si es nativo, inicializar plugins
        if (isNative) {
          await initNativePlugins(platform);
        }
      } catch (error) {
        // Capacitor no disponible - modo web
        console.log('📱 Running in web mode');
        setState(prev => ({ ...prev, isReady: true }));
      }
    };

    initCapacitor();
  }, []);

  return (
    <CapacitorContext.Provider value={state}>
      {children}
    </CapacitorContext.Provider>
  );
}

/**
 * Inicializa los plugins nativos de Capacitor
 */
async function initNativePlugins(platform: string) {
  try {
    console.log(`📱 Initializing native plugins for ${platform}`);

    // Splash Screen
    try {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      
      // Mostrar splash mientras carga
      await SplashScreen.show({
        showDuration: 2000,
        autoHide: true,
        fadeInDuration: 200,
        fadeOutDuration: 300,
      });
    } catch (e) {
      console.log('SplashScreen plugin not available');
    }

    // Status Bar (solo Android/iOS)
    if (platform === 'android' || platform === 'ios') {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        
        // Configurar barra de estado oscura con fondo del tema
        await StatusBar.setBackgroundColor({ color: '#1a1a2e' });
        await StatusBar.setStyle({ style: Style.Dark });
        
        // En Android, hacer la barra translúcida
        if (platform === 'android') {
          await StatusBar.setOverlaysWebView({ overlay: false });
        }
      } catch (e) {
        console.log('StatusBar plugin not available');
      }
    }

    console.log('✅ Native plugins initialized successfully');
  } catch (error) {
    console.error('Error initializing native plugins:', error);
  }
}

/**
 * Hook para ocultar el splash screen manualmente
 */
export function useHideSplash() {
  const { isNative } = useCapacitorContext();

  const hideSplash = async () => {
    if (!isNative) return;

    try {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.hide({ fadeOutDuration: 300 });
    } catch (e) {
      console.log('Could not hide splash screen');
    }
  };

  return hideSplash;
}

export default CapacitorProvider;
