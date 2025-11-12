"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uawjbioilmhuuybnlhcv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2piaW9pbG1odXV5Ym5saGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDA5NjUsImV4cCI6MjA3NjY3Njk2NX0.aX9wqc7j1AYW3-Oz311GiH5eckAbR47Cuwy68pWbSqs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="ja">
      <head>
        <title>空き家マッチングプラットフォーム</title>
        <meta
          name="description"
          content="AIマッチングで理想の移住先を見つける"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                空き家マッチング
              </Link>
              <div className="flex gap-6 items-center">
                <Link href="/diagnosis" className="hover:text-blue-600">
                  診断
                </Link>
                <Link href="/listings" className="hover:text-blue-600">
                  物件一覧
                </Link>
                <Link href="/recommendations" className="hover:text-blue-600">
                  おすすめ
                </Link>
                <Link href="/favorites" className="hover:text-blue-600">
                  お気に入り
                </Link>

                {/* ログイン状態で表示切替 */}
                {session ? (
                  <button
                    onClick={handleLogout}
                    className="hover:text-red-600 font-semibold"
                  >
                    ログアウト
                  </button>
                ) : (
                  <Link href="/login" className="hover:text-blue-600">
                    ログイン
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-8 text-center text-gray-600">
            <p>© 2024 空き家マッチングプラットフォーム - MVP Demo</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
