"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Search } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background z-10" />
        {/* Placeholder for High-Quality Hero Image - using a gradient fallback for now, but imagine a beautiful architectural shot */}
        <div 
          className="w-full h-full bg-cover bg-center animate-scale-slow"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop')",
            animation: "scaleIn 20s infinite alternate ease-in-out"
          }} 
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4 hover:bg-white/20 transition-colors cursor-default">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>AIマッチングで理想の暮らしを</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
            空き家で始める、
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-pink-200">
              新しい物語
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">
            古民家からリノベーション物件まで。
            <br className="hidden md:block" />
            あなたのライフスタイルに寄り添う「運命の一軒」をご提案します。
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link href="/diagnosis" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto min-w-[200px] h-14 text-base bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white rounded-full shadow-xl hover:shadow-orange-500/25 border-0"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                AI診断で探す
              </Button>
            </Link>
            
            <Link href="/listings" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto min-w-[200px] h-14 text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 rounded-full"
              >
                <Search className="mr-2 w-5 h-5" />
                すべての物件を見る
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </div>
  );
}
