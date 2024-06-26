// src/app/layout.tsx
import { Metadata } from 'next';
import './globals.css'; // Adjust the import based on your project structure
import { Inter } from 'next/font/google';
import RootLayoutClient from './RootLayoutClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "FE Test",
  description: "FE Test",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
