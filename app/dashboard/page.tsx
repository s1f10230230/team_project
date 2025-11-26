"use client";
import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { createClient, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Heart, Settings } from "lucide-react";

const SUPABASE_URL = "https://uawjbioilmhuuybnlhcv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2piaW9pbG1odXV5Ym5saGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDA5NjUsImV4cCI6MjA3NjY3Njk2NX0.aX9wqc7j1AYW3-Oz311GiH5eckAbR47Cuwy68pWbSqs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      }
      setSession(data.session);
    };
    fetchSession();
  }, [router]);

  if (!session) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Dashboard</h1>
        <p className="text-muted-foreground mb-12">Welcome back, {session.user.email}</p>
        
        <BentoGrid>
          <BentoGridItem
            title="Profile Settings"
            description="Manage your account settings and preferences."
            header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-secondary" />}
            icon={<Settings className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-1"
          />
          <BentoGridItem
            title="Saved Listings"
            description="View your favorite properties."
            header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-secondary" />}
            icon={<Heart className="h-4 w-4 text-muted-foreground" />}
            className="md:col-span-2"
          />
        </BentoGrid>
      </div>
    </div>
  );
}
