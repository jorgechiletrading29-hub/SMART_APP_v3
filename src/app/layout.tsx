import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/contexts/app-provider';

export const metadata: Metadata = {
  title: 'SMART STUDENT',
  description: 'SMART STUDENT - Aprende, Crea y Destaca',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  // Configuración para app móvil
  applicationName: 'Smart Student',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Smart Student',
  },
  formatDetection: {
    telephone: false,
  },
};

// Configuración de viewport para móvil
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1a1a2e',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
  {/* Guardia temprana para sanear notificaciones antes de que otros scripts las lean */}
  <script src="/notification-guard.js" />
        <script src="/notification-sync-service.js" defer></script>
        <script src="/auto-repair.js" defer></script>
        <script src="/load-repair-tools.js" defer></script>
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <AppProviders>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
