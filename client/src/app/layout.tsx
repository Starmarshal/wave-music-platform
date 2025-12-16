import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {ReduxProvider} from '@/src/store/ReduxProvider';
import FooterPlayer from '@/src/components/FooterPlayer';

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
    <html lang="ru">
    <body className={`${inter.className} !min-h-screen !pb-30`}>
    <ReduxProvider>
      {children}
      <FooterPlayer />
    </ReduxProvider>
    </body>
    </html>
  );
}