import type {NextConfig} from 'next';

/**
 * Configuración de Next.js para desarrollo web normal
 * Para mobile, usar: npm run mobile:build
 */
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuración de Turbopack
  turbopack: {
    resolveAlias: {
      canvas: require.resolve('./shims/canvas.js'),
    },
  },
  
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000', 
        'localhost:9002',
        '*.github.dev',
        '*.gitpod.io',
        '*.repl.co',
        '*.app.github.dev'
      ],
      bodySizeLimit: '2mb',
    },
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  transpilePackages: ['genkit', 'dotprompt'],
};

export default nextConfig;
