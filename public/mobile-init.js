// Smart Student Mobile Initialization Script
// Este script se ejecuta primero para asegurar que la app se inicialice correctamente

(function() {
  'use strict';
  
  console.log('[SmartStudent] Inicializando app móvil...');
  
  // Función para detectar si estamos en Capacitor
  function isCapacitor() {
    return typeof window.Capacitor !== 'undefined' && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  }
  
  // Manejar errores globales de JavaScript
  window.onerror = function(message, source, lineno, colno, error) {
    console.error('[SmartStudent] Error JS:', message, 'en', source, 'línea', lineno);
    return false;
  };
  
  // Manejar promesas rechazadas
  window.addEventListener('unhandledrejection', function(event) {
    console.error('[SmartStudent] Promise rechazada:', event.reason);
  });
  
  // Cuando el DOM esté listo
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[SmartStudent] DOM cargado');
    
    if (isCapacitor()) {
      console.log('[SmartStudent] Ejecutando en Capacitor nativo');
      document.body.classList.add('capacitor-native');
    }
  });
  
  // Fallback de redirección para la página principal
  // Si estamos en index.html y después de 5 segundos no ha habido navegación, ir a login
  window.addEventListener('load', function() {
    console.log('[SmartStudent] Página completamente cargada');
    
    var currentPath = window.location.pathname;
    console.log('[SmartStudent] Path actual:', currentPath);
    
    // Solo aplicar fallback en la página principal
    if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
      console.log('[SmartStudent] En página principal, configurando fallback...');
      
      setTimeout(function() {
        // Verificar si todavía estamos en la página principal (no hubo navegación)
        var stillOnMain = window.location.pathname === '/' || 
                          window.location.pathname === '/index.html' || 
                          window.location.pathname === '';
        
        if (stillOnMain) {
          console.log('[SmartStudent] Fallback: redirigiendo a login.html');
          window.location.href = '/login.html';
        }
      }, 4000);
    }
    
    // Ocultar splash screen en Capacitor
    if (isCapacitor() && window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
      setTimeout(function() {
        window.Capacitor.Plugins.SplashScreen.hide().catch(function(e) {
          console.log('[SmartStudent] SplashScreen ya oculto');
        });
      }, 500);
    }
  });
  
  console.log('[SmartStudent] Script de inicialización configurado');
})();
