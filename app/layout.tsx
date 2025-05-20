// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SiteLayout from '@/components/Layout'; // Path alias should work if tsconfig is set for root
import './globals.css'; // Relative path to globals.css within the same app directory

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bitcoin Value Catalyst',
  description: 'Ask not what Bitcoin can do for you, but what you can do for Bitcoin.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-black text-gray-100 flex flex-col min-h-full`}>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}