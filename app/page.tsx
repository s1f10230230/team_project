import { HeroSection } from "@/components/ui/hero-section";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Search, Home as HomeIcon, Heart, Sparkles } from "lucide-react";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-orange-100 dark:selection:bg-orange-900/30">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-medium mb-4">
             <Sparkles className="w-4 h-4" /> Feature Highlights
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">
            見つかる、<span className="text-gradient">理想の暮らし</span>
          </h2>
          <p className="text-gray-500 text-lg">
            最先端のAI技術と直感的なデザインで、空き家探しをサポートします。
          </p>
        </div>

        <BentoGrid className="max-w-5xl mx-auto">
          <Link href="/diagnosis" className="md:col-span-2 group">
             <BentoGridItem
               title={<span className="text-2xl font-bold group-hover:text-primary transition-colors">AIマッチング診断</span>}
               description="いくつかの質問に答えるだけで、あなたのライフスタイルに最適な地域と物件をAIが提案します。"
               header={
                 <div className="flex w-full h-full min-h-[12rem] rounded-xl bg-orange-50 border border-orange-100 group-hover:bg-orange-100/50 transition-colors items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 to-pink-200/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-16 h-16 text-orange-400 opacity-80" />
                 </div>
               }
               icon={<Sparkles className="h-4 w-4 text-orange-500" />}
               className="md:col-span-2 shadow-sm hover:shadow-xl transition-all duration-300"
             />
          </Link>

          <Link href="/listings" className="md:col-span-1 group">
             <BentoGridItem
               title={<span className="font-bold group-hover:text-primary transition-colors">物件を探す</span>}
               description="エリアや価格から物件を検索。"
               header={
                 <div className="flex w-full h-full min-h-[12rem] rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-gray-100/50 transition-colors items-center justify-center">
                    <Search className="w-12 h-12 text-gray-400" />
                 </div>
               }
               icon={<Search className="h-4 w-4 text-gray-500" />}
               className="md:col-span-1 shadow-sm hover:shadow-xl transition-all duration-300"
             />
          </Link>

          <Link href="/favorites" className="md:col-span-1 group">
             <BentoGridItem
               title={<span className="font-bold group-hover:text-primary transition-colors">お気に入り</span>}
               description="保存した物件を比較検討。"
               header={
                 <div className="flex w-full h-full min-h-[12rem] rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-gray-100/50 transition-colors items-center justify-center">
                    <Heart className="w-12 h-12 text-gray-400" />
                 </div>
               }
               icon={<Heart className="h-4 w-4 text-gray-500" />}
               className="md:col-span-1 md:col-start-1 shadow-sm hover:shadow-xl transition-all duration-300"
             />
          </Link>
           
           <div className="md:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center items-start shadow-xl">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                <HomeIcon className="w-64 h-64" />
             </div>
             <h3 className="text-3xl font-bold mb-4 relative z-10">空き家バンクとは？</h3>
             <p className="text-white/80 max-w-md mb-8 relative z-10">
               自治体が運営する空き家情報のネットワークです。
               市場に出回らない掘り出し物が見つかるかもしれません。
             </p>
             <Link href="/listings" className="relative z-10">
                <button className="px-6 py-3 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors">
                  物件を見てみる
                </button>
             </Link>
           </div>

        </BentoGrid>
      </div>
    </main>
  );
}
