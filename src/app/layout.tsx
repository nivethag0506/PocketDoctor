
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { SharedStateProvider, AppLayout, useSharedState } from '@/components/AppLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import LoginPage from './login/page';
import { LoaderCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const metadata: Metadata = {
  title: 'Pocket Doctor',
  description: 'Your personal medication assistant.',
};

function AppInitializer({ children }: { children: React.ReactNode }) {
  const { user, allUsers, switchUser } = useSharedState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect ensures we show a brief loading spinner on initial load
    // before deciding which view to show.
    setIsLoading(false);
  }, []);

  const handleLogin = (userId: string) => {
    switchUser(userId);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return <LoginPage allUsers={allUsers} onLogin={handleLogin} />;
  }

  return <AppLayout>{children}</AppLayout>;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SharedStateProvider>
            <AppInitializer>{children}</AppInitializer>
          </SharedStateProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
