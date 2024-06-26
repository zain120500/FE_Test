// src/app/RootLayoutClient.tsx
"use client";

import { usePathname } from 'next/navigation';
import Header from './component/header'; // Adjust the import based on your project structure

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="pt-5 px-3 text-black">
        {children}
      </main>
    </>
  );
}
