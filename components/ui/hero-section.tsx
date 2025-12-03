import React, { useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uawjbioilmhuuybnlhcv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2piaW9pbG1odXV5Ym5saGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDA5NjUsImV4cCI6MjA3NjY3Njk2NX0.aX9wqc7j1AYW3-Oz311GiH5eckAbR47Cuwy68pWbSqs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function HeroSection() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();
  }, []);
  return (
    <div className="relative h-[40rem] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image Placeholder or Actual Image */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-background/90 z-10" />
         {/* Fallback pattern if image is missing, or use the image if available */}
         <div className="w-full h-full bg-neutral-900 object-cover opacity-50">
            {/* <Image src="/hero-image.png" alt="Renovated Kominka" fill className="object-cover" priority /> */}
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?q=80&w=2554&auto=format&fit=crop')] bg-cover bg-center" />
         </div>
      </div>

      <div className="relative z-20 p-4 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 pb-4 animate-in fade-in zoom-in duration-1000">
          空き家で始める <br />
          <span className="text-primary">新しい暮らし</span>
        </h1>
        <p className="mt-4 font-normal text-lg md:text-xl text-neutral-300 max-w-lg mx-auto animate-in slide-in-from-bottom-4 duration-1000 delay-300">
          AIマッチングで、あなたにぴったりの移住先を見つけます。
          <br />
          古民家からモダンなリノベーション物件まで。
        </p>
        
        <div className="mt-8 flex justify-center gap-4 animate-in slide-in-from-bottom-8 duration-1000 delay-500">
            <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                物件を探す
            </button>
            <button 
                onClick={() => {
                    if (session) {
                        window.location.href = "/diagnosis";
                    } else {
                        window.location.href = "/login?next=/diagnosis";
                    }
                }}
                className="px-8 py-3 rounded-full bg-secondary/10 backdrop-blur-sm border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
            >
                診断を始める
            </button>
        </div>
      </div>
    </div>
  );
}
