import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smartstudent.app',
  appName: 'Smart Student',
  webDir: 'out',
  bundledWebRuntime: false,
  
  // Configuración del servidor
  server: {
    // Permitir navegación en el WebView
    allowNavigation: ['*'],
    // Limpiar texto copiado
    cleartext: true,
    // Error path personalizado
    errorPath: '/error.html',
  },
  
  // Plugins nativos
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1a1a2e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#3b82f6',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
  
  // Configuración específica de Android
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true, // Desactivar en producción
    backgroundColor: '#1a1a2e',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  
  // Configuración específica de iOS (para futuro)
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#1a1a2e',
    preferredContentMode: 'mobile',
  },
};

export default config;
