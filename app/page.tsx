"use client";

import { useEffect, useState } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import { HeroSection } from '@/components/ui/hero-section';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { FloatingNav } from '@/components/ui/floating-navbar';
import { Home as HomeIcon, Search, Heart, User } from 'lucide-react';

const SUPABASE_URL = "https://uawjbioilmhuuybnlhcv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2piaW9pbG1odXV5Ym5saGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDA5NjUsImV4cCI6MjA3NjY3Njk2NX0.aX9wqc7j1AYW3-Oz311GiH5eckAbR47Cuwy68pWbSqs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const navItems = [
    { name: "Home", link: "/", icon: <HomeIcon className="h-4 w-4 text-muted-foreground" /> },
    { name: "Listings", link: "/listings", icon: <Search className="h-4 w-4 text-muted-foreground" /> },
    { name: "Favorites", link: "/favorites", icon: <Heart className="h-4 w-4 text-muted-foreground" /> },
  ];

  if (session) {
    navItems.push({ name: "Dashboard", link: "/dashboard", icon: <User className="h-4 w-4 text-muted-foreground" /> });
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <FloatingNav navItems={navItems} />
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Features</h2>
        <BentoGrid>
          <BentoGridItem
            title="AIマッチング診断"
            description="ライフスタイルや希望条件から、最適な地域と物件をご提案します。"
            header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-secondary" />}
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="物件を探す"
            description="全国の空き家物件から、条件に合う物件を検索できます。"
            header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-secondary" />}
            icon={<HomeIcon className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="お気に入り"
            description="気になる物件を保存して、じっくり比較検討できます。"
            header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-secondary" />}
            icon={<Heart className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-1"
          />
        </BentoGrid>
      </div>
    </main>
  );
}
