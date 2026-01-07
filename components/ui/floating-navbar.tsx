"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Home, Search, Heart, Sparkles } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface FloatingNavbarProps {
  session: Session | null;
  onLogout: () => void;
}

export function FloatingNavbar({ session, onLogout }: FloatingNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: { name: string; href: string; icon: React.ElementType }[] = [
    { name: "診断", href: "/diagnosis", icon: Sparkles },
    { name: "物件一覧", href: "/listings", icon: Search },
    { name: "おすすめ", href: "/recommendations", icon: Home },
    { name: "お気に入り", href: "/favorites", icon: Heart },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out px-4 py-4 md:px-8",
        scrolled
          ? "bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto max-w-7xl flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-orange-400/50 transition-shadow">
            H
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight group-hover:text-primary transition-colors">
            Hitotoki
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={link.href as any}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}

          <div className="h-6 w-px bg-gray-200 mx-2" />

          {session ? (
            <Button
              onClick={onLogout}
              variant="ghost"
              className="font-medium text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              ログアウト
            </Button>
          ) : (
            <Link href="/login">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all">
                ログイン
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 shadow-xl animate-in slide-in-from-top-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={link.href as any}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                <link.icon className="w-5 h-5 text-gray-400" />
                {link.name}
              </Link>
            ))}
            <hr className="border-gray-100" />
            {session ? (
              <Button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                variant="destructive"
                className="w-full"
              >
                ログアウト
              </Button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gray-900 text-white">ログイン</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
