package com.smartstudent.app;

import android.os.Bundle;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.util.Log;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private static final String TAG = "SmartStudent";
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "MainActivity onCreate iniciado");
        
        // Configurar pantalla completa y ajustes de teclado
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        
        super.onCreate(savedInstanceState);
        
        Log.d(TAG, "MainActivity onCreate completado");
        
        // Habilitar debugging del WebView para Chrome DevTools
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Configurar el WebView después de que Capacitor lo inicialice
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setAllowFileAccess(true);
                settings.setAllowContentAccess(true);
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
                settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                Log.d(TAG, "WebView configurado correctamente");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error configurando WebView: " + e.getMessage());
        }
    }
}
