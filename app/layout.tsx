"use client";

import { Outfit, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import { FavoritesProvider } from '@/components/favorites-context';
import { FloatingNavbar } from "@/components/ui/floating-navbar"; // Import FloatingNavbar

const SUPABASE_URL = "https://uawjbioilmhuuybnlhcv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2piaW9pbG1odXV5Ym5saGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDA5NjUsImV4cCI6MjA3NjY3Njk2NX0.aX9wqc7j1AYW3-Oz311GiH5eckAbR47Cuwy68pWbSqs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <title>空き家マッチングプラットフォーム</title>
        <meta
          name="description"
          content="AIマッチングで理想の移住先を見つける"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${notoSansJP.variable} font-sans antialiased`}
      >
        <FavoritesProvider>
          <FloatingNavbar session={session} onLogout={handleLogout} />
          <main className="min-h-screen pt-20">{children}</main> {/* pt-20 added for floating nav space */}
          <footer className="border-t mt-12 bg-white/50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8 text-center text-gray-600">
              <p>© 2024 空き家マッチングプラットフォーム</p>
            </div>
          </footer>
        </FavoritesProvider>
      </body>
    </html>
  );
}
