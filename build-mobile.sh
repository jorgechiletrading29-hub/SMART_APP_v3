#!/bin/bash

# ============================================================
# 🚀 SMART STUDENT - Build Script para Android APK
# ============================================================
# Este script automatiza la compilación de la app Next.js
# para generar un APK de Android usando Capacitor
# ============================================================

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_BACKUP_DIR="$PROJECT_DIR/.api-backup"
API_DIR="$PROJECT_DIR/src/app/api"

echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         🎓 SMART STUDENT - Mobile Build System             ║"
echo "║              Compilando APK para Android                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================================
# Paso 1: Verificar requisitos
# ============================================================
echo -e "\n${CYAN}📋 Paso 1: Verificando requisitos...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node -v)${NC}"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm: $(npm -v)${NC}"

# Verificar Java
JAVA_OK=false
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ Java: $JAVA_VERSION${NC}"
    JAVA_OK=true
else
    echo -e "${YELLOW}⚠ Java no instalado${NC}"
fi

# Verificar Android SDK
ANDROID_SDK_OK=false
if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✓ Android SDK: $ANDROID_HOME${NC}"
    ANDROID_SDK_OK=true
elif [ -n "$ANDROID_SDK_ROOT" ] && [ -d "$ANDROID_SDK_ROOT" ]; then
    export ANDROID_HOME="$ANDROID_SDK_ROOT"
    echo -e "${GREEN}✓ Android SDK: $ANDROID_HOME${NC}"
    ANDROID_SDK_OK=true
else
    echo -e "${YELLOW}⚠ Android SDK no encontrado${NC}"
fi

# ============================================================
# Paso 2: Respaldar carpeta API
# ============================================================
echo -e "\n${CYAN}📦 Paso 2: Respaldando APIs...${NC}"

if [ -d "$API_DIR" ]; then
    mkdir -p "$API_BACKUP_DIR"
    cp -r "$API_DIR" "$API_BACKUP_DIR/"
    echo -e "${GREEN}✓ APIs respaldadas en .api-backup${NC}"
    
    # Limpiar carpeta API
    rm -rf "$API_DIR"
    mkdir -p "$API_DIR"
    echo "// Placeholder for static export" > "$API_DIR/.gitkeep"
    echo -e "${GREEN}✓ Rutas API removidas temporalmente${NC}"
else
    echo -e "${YELLOW}⚠ No se encontró carpeta API${NC}"
fi

# ============================================================
# Paso 3: Build de Next.js
# ============================================================
echo -e "\n${CYAN}🔨 Paso 3: Compilando Next.js...${NC}"

cd "$PROJECT_DIR"

# Limpiar builds anteriores
rm -rf .next out

# Ejecutar build
npm run build

echo -e "${GREEN}✓ Build de Next.js completado${NC}"

# ============================================================
# Paso 4: Crear carpeta out
# ============================================================
echo -e "\n${CYAN}📂 Paso 4: Creando carpeta out...${NC}"

# Crear estructura
mkdir -p out/_next

# Copiar assets estáticos
cp -r .next/static out/_next/

# Copiar archivos HTML
find .next/server/app -name "*.html" -exec bash -c 'dest="out/${0#.next/server/app/}"; mkdir -p "$(dirname "$dest")"; cp "$0" "$dest"' {} \;

# Copiar archivos públicos
cp -r public/* out/ 2>/dev/null || true

OUT_SIZE=$(du -sh out | cut -f1)
echo -e "${GREEN}✓ Carpeta out creada: $OUT_SIZE${NC}"

# ============================================================
# Paso 5: Restaurar APIs
# ============================================================
echo -e "\n${CYAN}🔄 Paso 5: Restaurando APIs...${NC}"

if [ -d "$API_BACKUP_DIR/api" ]; then
    rm -rf "$API_DIR"
    mv "$API_BACKUP_DIR/api" "$API_DIR"
    rm -rf "$API_BACKUP_DIR"
    echo -e "${GREEN}✓ APIs restauradas${NC}"
fi

# ============================================================
# Paso 6: Sincronizar con Capacitor
# ============================================================
echo -e "\n${CYAN}📱 Paso 6: Sincronizando con Capacitor...${NC}"

# Verificar si existe el proyecto Android
if [ ! -d "$PROJECT_DIR/android" ]; then
    echo -e "${YELLOW}⚠ Proyecto Android no existe, inicializando...${NC}"
    npx cap add android
fi

# Sincronizar archivos web con Android
npx cap sync android

echo -e "${GREEN}✓ Sincronización completada${NC}"

# ============================================================
# Paso 7: Compilar APK (si es posible)
# ============================================================
if [ "$ANDROID_SDK_OK" = true ] && [ "$JAVA_OK" = true ]; then
    echo -e "\n${CYAN}🏗️ Paso 7: Compilando APK...${NC}"

    cd "$PROJECT_DIR/android"
    chmod +x gradlew

    # Configurar JAVA_HOME si hay Java 21
    if [ -d "/usr/lib/jvm/java-21-openjdk-amd64" ]; then
        export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
    fi

    # Compilar APK debug
    ./gradlew assembleDebug

    # Buscar el APK generado
    APK_PATH=$(find "$PROJECT_DIR/android/app/build/outputs/apk" -name "*.apk" -type f | head -n 1)

    if [ -n "$APK_PATH" ]; then
        APK_NAME="smart-student-$(date +%Y%m%d-%H%M%S).apk"
        cp "$APK_PATH" "$PROJECT_DIR/$APK_NAME"
        
        echo -e "\n${GREEN}"
        echo "╔════════════════════════════════════════════════════════════╗"
        echo "║               ✅ APK GENERADO EXITOSAMENTE                 ║"
        echo "╚════════════════════════════════════════════════════════════╝"
        echo -e "${NC}"
        
        echo -e "${PURPLE}📱 Archivo APK:${NC} $PROJECT_DIR/$APK_NAME"
        echo -e "${PURPLE}📦 Tamaño:${NC} $(du -h "$PROJECT_DIR/$APK_NAME" | cut -f1)"
    fi
else
    echo -e "\n${YELLOW}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     ⚠️  NO SE PUEDE COMPILAR APK LOCALMENTE               ║"
    echo "╠════════════════════════════════════════════════════════════╣"
    echo "║  El Android SDK no está instalado en este sistema.        ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    echo -e "${CYAN}Los archivos web están preparados en:${NC}"
    echo -e "  📁 ${GREEN}out/${NC} - Archivos web estáticos"
    echo -e "  📁 ${GREEN}android/${NC} - Proyecto Android (sincronizado)"
    echo ""
    echo -e "${CYAN}Opciones para generar la APK:${NC}"
    echo ""
    echo -e "  ${PURPLE}1. GitHub Actions (recomendado):${NC}"
    echo -e "     git push origin main"
    echo -e "     # La APK se generará automáticamente"
    echo ""
    echo -e "  ${PURPLE}2. Android Studio:${NC}"
    echo -e "     npx cap open android"
    echo -e "     # Build > Build Bundle(s) / APK(s) > Build APK(s)"
    echo ""
    echo -e "  ${PURPLE}3. Instalar Android SDK:${NC}"
    echo -e "     # Linux:"
    echo -e "     wget https://dl.google.com/android/repository/commandlinetools-linux-latest.zip"
    echo -e "     # Seguir instrucciones de instalación"
fi

cd "$PROJECT_DIR"

echo -e "\n${GREEN}🎉 Proceso de preparación completado!${NC}\n"
