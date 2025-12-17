import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {ReduxProvider} from '@/src/store/ReduxProvider';
import FooterPlayer from '@/src/components/FooterPlayer';
import ThemeSync from '@/src/components/ThemeSync';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Musical Platform',
  description: 'Музыкальная платформа',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
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
    <body className={`${inter.className} !min-h-screen !pb-20 sm:!pb-24 md:!pb-32 !bg-white dark:!bg-gray-900 !text-gray-900 dark:!text-gray-100`}>
    <ReduxProvider>
      <ThemeSync />
      {children}
      <FooterPlayer />
    </ReduxProvider>
    </body>
    </html>
  );
}