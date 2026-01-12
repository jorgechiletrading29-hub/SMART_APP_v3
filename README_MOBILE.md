# 📱 Smart Student - Guía de Desarrollo Móvil

## Descripción

Esta guía explica cómo compilar Smart Student como aplicación móvil nativa usando **Capacitor**.

## 📐 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  (React + Firebase + UI Components + Lógica de Negocio)     │
└──────────────────────────┬──────────────────────────────────┘
                           │ npm run build
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Static Export (carpeta /out)                   │
│         HTML + CSS + JS estáticos (sin SSR)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ npx cap sync
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Capacitor                                 │
│   Copia archivos estáticos a android/app/src/main/assets    │
└──────────────────────────┬──────────────────────────────────┘
                           │ ./gradlew assembleDebug
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       APK Final                              │
│    WebView nativo + Tu app web empaquetada                  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Requisitos

### Sistema
- Node.js 18+
- Java 21+ (JDK)
- Android SDK (vía Android Studio)

### Verificar Java
```bash
java -version
# Debe mostrar Java 21 o superior
```

### Instalar Java 21 (si es necesario)
```bash
sudo apt update
sudo apt install openjdk-21-jdk -y
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
```

## 🚀 Comandos Rápidos

| Comando | Descripción |
|---------|-------------|
| `npm run mobile:build` | Compila APK completa (automatizado) |
| `npm run mobile:sync` | Sincroniza web con Android |
| `npm run mobile:open` | Abre proyecto en Android Studio |
| `npm run mobile:run` | Ejecuta en dispositivo/emulador |
| `npm run mobile:init` | Inicializa proyecto Android |

## 📦 Compilar APK

### Método 1: Script Automatizado (Recomendado)
```bash
./build-mobile.sh
```

Este script:
1. ✅ Respalda las APIs (no funcionan en static export)
2. ✅ Configura Next.js para export estático
3. ✅ Compila la aplicación web
4. ✅ Restaura las APIs
5. ✅ Sincroniza con Capacitor
6. ✅ Genera el APK

### Método 2: Manual
```bash
# 1. Compilar Next.js en modo estático
npm run build

# 2. Sincronizar con Android
npx cap sync android

# 3. Compilar APK
cd android
./gradlew assembleDebug
```

## 📱 Instalar APK

### En dispositivo físico
```bash
# Habilitar depuración USB en el dispositivo
adb install smart-student-*.apk
```

### En emulador
```bash
# Iniciar emulador
emulator -avd Pixel_6_API_33

# Instalar
adb install smart-student-*.apk
```

## 🎨 Personalización

### Íconos de la App
Los íconos están en:
```
android/app/src/main/res/mipmap-*/
```

Tamaños necesarios:
- `mipmap-mdpi`: 48x48
- `mipmap-hdpi`: 72x72
- `mipmap-xhdpi`: 96x96
- `mipmap-xxhdpi`: 144x144
- `mipmap-xxxhdpi`: 192x192

### Splash Screen
Archivo: `android/app/src/main/res/drawable/splash.png`

### Colores
Archivo: `android/app/src/main/res/values/colors.xml`

## 🔧 Configuración

### capacitor.config.ts
```typescript
const config: CapacitorConfig = {
  appId: 'com.smartstudent.app',
  appName: 'Smart Student',
  webDir: 'out',
  plugins: {
    SplashScreen: { ... },
    StatusBar: { ... },
  },
};
```

### Plugins Instalados
- `@capacitor/core` - Núcleo de Capacitor
- `@capacitor/android` - Plataforma Android
- `@capacitor/splash-screen` - Pantalla de carga
- `@capacitor/status-bar` - Barra de estado

## 📋 Versiones

| Componente | Versión |
|------------|---------|
| Java Target | 21 |
| Gradle | 8.x |
| Compile SDK | 36 (Android 16) |
| Target SDK | 36 |
| Min SDK | 24 (Android 7.0) |
| Capacitor | 8.x |

## 🐛 Solución de Problemas

### Error: "JAVA_HOME not set"
```bash
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
```

### Error: "SDK location not found"
Crear `android/local.properties`:
```properties
sdk.dir=/path/to/Android/Sdk
```

### Error: "Gradle build failed"
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Error: "Missing out directory"
```bash
npm run build  # Compilar primero
npx cap sync
```

## 🔒 Producción

### Generar APK de Release
```bash
cd android
./gradlew assembleRelease
```

### Firmar APK
1. Crear keystore:
```bash
keytool -genkey -v -keystore smart-student.keystore \
  -alias smart-student -keyalg RSA -keysize 2048 -validity 10000
```

2. Configurar en `android/app/build.gradle`:
```groovy
signingConfigs {
    release {
        storeFile file('smart-student.keystore')
        storePassword 'password'
        keyAlias 'smart-student'
        keyPassword 'password'
    }
}
```

### Generar Bundle (AAB) para Play Store
```bash
./gradlew bundleRelease
```

## 📚 Recursos

- [Documentación Capacitor](https://capacitorjs.com/docs)
- [Android Developer](https://developer.android.com/)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

<p align="center">
  <strong>🎓 Smart Student Mobile</strong>
</p>
