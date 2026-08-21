import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import {Toaster} from 'sonner';
import {StoreProvider} from '@repo/store';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UpBeat Entertainment Africa',
  description: 'Manage your brand and events with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col">
        <Toaster position="top-center" />
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
