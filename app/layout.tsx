import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "空き家マッチングプラットフォーム",
  description: "AIマッチングで理想の移住先を見つける",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                空き家マッチング
              </Link>
              <div className="flex gap-6">
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
