#!/bin/bash

# ============================================================
# 🚀 SMART STUDENT - Preparar Build para Android
# ============================================================
# Este script prepara los archivos estáticos para Capacitor
# sin necesitar el Android SDK instalado
# ============================================================

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_BACKUP_DIR="$PROJECT_DIR/.api-backup"
API_DIR="$PROJECT_DIR/src/app/api"

echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║       🎓 SMART STUDENT - Preparar Build Mobile             ║"
echo "║          Genera archivos para Android/Capacitor            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Paso 1: Verificar requisitos básicos
echo -e "\n${CYAN}📋 Paso 1: Verificando requisitos...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js: $(node -v)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm: $(npm -v)${NC}"

# Paso 2: Respaldar APIs
echo -e "\n${CYAN}📦 Paso 2: Respaldando APIs...${NC}"

if [ -d "$API_DIR" ]; then
    mkdir -p "$API_BACKUP_DIR"
    cp -r "$API_DIR" "$API_BACKUP_DIR/"
    echo -e "${GREEN}✓ APIs respaldadas${NC}"
    
    mkdir -p "$API_DIR"
    echo "// APIs temporalmente removidas para build estático" > "$API_DIR/.placeholder"
    find "$API_DIR" -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} \;
    echo -e "${GREEN}✓ Rutas API removidas temporalmente${NC}"
fi

# Paso 3: Configurar Next.js para export estático
echo -e "\n${CYAN}⚙️ Paso 3: Configurando Next.js...${NC}"

cp "$PROJECT_DIR/next.config.ts" "$PROJECT_DIR/next.config.ts.backup"

if [ -f "$PROJECT_DIR/next.config.mobile.ts" ]; then
    cp "$PROJECT_DIR/next.config.mobile.ts" "$PROJECT_DIR/next.config.ts"
    echo -e "${GREEN}✓ Usando next.config.mobile.ts${NC}"
else
    if ! grep -q "output: 'export'" "$PROJECT_DIR/next.config.ts"; then
        sed -i "/const nextConfig: NextConfig = {/a\  output: 'export'," "$PROJECT_DIR/next.config.ts"
    fi
    echo -e "${GREEN}✓ Configurado output: 'export'${NC}"
fi

# Paso 4: Build de Next.js
echo -e "\n${CYAN}🔨 Paso 4: Compilando Next.js...${NC}"

cd "$PROJECT_DIR"
npm run build

if [ ! -d "$PROJECT_DIR/out" ]; then
    echo -e "${RED}❌ Error: No se generó la carpeta 'out'${NC}"
    # Restaurar
    if [ -d "$API_BACKUP_DIR/api" ]; then
        rm -rf "$API_DIR"
        mv "$API_BACKUP_DIR/api" "$API_DIR"
    fi
    mv "$PROJECT_DIR/next.config.ts.backup" "$PROJECT_DIR/next.config.ts"
    exit 1
fi

OUT_SIZE=$(du -sh "$PROJECT_DIR/out" | cut -f1)
echo -e "${GREEN}✓ Build completado: $OUT_SIZE${NC}"

# Paso 5: Restaurar archivos originales
echo -e "\n${CYAN}🔄 Paso 5: Restaurando archivos...${NC}"

if [ -d "$API_BACKUP_DIR/api" ]; then
    rm -rf "$API_DIR"
    mv "$API_BACKUP_DIR/api" "$API_DIR"
    rm -rf "$API_BACKUP_DIR"
    echo -e "${GREEN}✓ APIs restauradas${NC}"
fi

mv "$PROJECT_DIR/next.config.ts.backup" "$PROJECT_DIR/next.config.ts"
echo -e "${GREEN}✓ next.config.ts restaurado${NC}"

# Paso 6: Sincronizar con Capacitor
echo -e "\n${CYAN}📱 Paso 6: Sincronizando con Capacitor...${NC}"

if [ ! -d "$PROJECT_DIR/android" ]; then
    echo -e "${YELLOW}⚠ Proyecto Android no existe, inicializando...${NC}"
    npx cap add android 2>/dev/null || echo -e "${YELLOW}⚠ cap add android falló, continuando...${NC}"
fi

npx cap sync android 2>/dev/null || echo -e "${YELLOW}⚠ cap sync falló (Android SDK no instalado)${NC}"

echo -e "\n${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║            ✅ PREPARACIÓN COMPLETADA                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}📁 Archivos generados:${NC}"
echo -e "   • ${PURPLE}out/${NC} - Archivos web estáticos ($OUT_SIZE)"
echo -e "   • ${PURPLE}android/${NC} - Proyecto Android"

echo -e "\n${CYAN}📋 Próximos pasos para generar APK:${NC}"
echo -e ""
echo -e "   ${YELLOW}Opción 1: En un entorno con Android SDK${NC}"
echo -e "   1. Copiar la carpeta 'android' a un PC con Android Studio"
echo -e "   2. Abrir con Android Studio"
echo -e "   3. Build → Build Bundle(s) / APK(s) → Build APK"
echo -e ""
echo -e "   ${YELLOW}Opción 2: Instalar Android SDK aquí${NC}"
echo -e "   1. Instalar Android SDK:"
echo -e "      curl -o sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-latest.zip"
echo -e "      unzip sdk.zip -d \$HOME/android-sdk"
echo -e "      export ANDROID_HOME=\$HOME/android-sdk"
echo -e "   2. Ejecutar: ./build-mobile.sh"
echo -e ""
echo -e "   ${YELLOW}Opción 3: Usar GitHub Actions${NC}"
echo -e "   1. Hacer push a GitHub"
echo -e "   2. Configurar workflow para build Android"
echo -e ""

echo -e "${GREEN}🎉 ¡Listo para compilar APK!${NC}\n"
