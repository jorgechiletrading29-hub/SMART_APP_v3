import type {NextConfig} from 'next';

/**
 * Configuración de Next.js para EXPORT ESTÁTICO (Mobile/Capacitor)
 * 
 * Este archivo se usa durante el build para móvil.
 * Las APIs no funcionan en modo estático, por eso se respaldan.
 */
const nextConfig: NextConfig = {
  // ⚠️ IMPORTANTE: Modo export estático para Capacitor
  output: 'export',
  
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Desactivar optimización de imágenes (no funciona en static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  // Turbopack config
  turbopack: {
    resolveAlias: {
      canvas: require.resolve('./shims/canvas.js'),
    },
  },
  
  // Trailing slash para mejor compatibilidad con rutas estáticas
  trailingSlash: true,
  
  transpilePackages: ['genkit', 'dotprompt'],
};

export default nextConfig;
