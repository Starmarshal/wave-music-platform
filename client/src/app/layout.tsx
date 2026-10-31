import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {ReduxProvider} from '@/src/store/ReduxProvider';
import FooterPlayer from '@/src/components/FooterPlayer';
import ThemeSync from '@/src/components/ThemeSync';
import Background from '@/src/components/Background';
import {AuthProvider} from '@/src/shared/auth/AuthProvider';
import AntdThemeProvider from '@/src/components/AntdThemeProvider';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Wave music',
  description: 'Музыкальная платформа',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  }
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
    >
    <head>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              (function() {
                function getThemePreference() {
                  if (typeof window !== 'undefined' && window.matchMedia) {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  return 'light';
                }
                const theme = getThemePreference();
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
        }}
      />
    </head>
    <body
      className={`${inter.className} !min-h-screen !pb-20 sm:!pb-24 md:!pb-32 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100 relative`}
    >
    {/* Фоновый компонент */}
    <Background />

    {/* Основное содержимое */}
    <div className="relative z-10">
      <ReduxProvider>
        <AntdThemeProvider>
        <AuthProvider>
          <ThemeSync />
          {children}
          <FooterPlayer />
        </AuthProvider>
        </AntdThemeProvider>
      </ReduxProvider>
    </div>
    </body>
    </html>
  );
}