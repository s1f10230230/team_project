'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Calendar, Ruler, ExternalLink, Heart, ChevronLeft } from 'lucide-react';
import housesData from '../../../houses.json'; // Adjusted path
import { useFavorites } from '@/components/favorites-context';
import { useEffect, useState } from 'react';

// JSONデータの型定義 (他と共有すべきだが一旦ここに定義)
type HouseData = {
  house_id: number;
  data: {
    address: string;
    area: number | null;
    age: number | null;
    structure: string;
    price: number;
    image_url: string | null;
    _title: string;
    _pref_government: string;
    _type: string;
    _detail_url: string;
    _description: string;
    // AI Generated Fields
    ai_catchphrase?: string;
    ai_description?: string;
    ai_tags?: string[];
  };
};

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id;
  const { addFavorite, isFavorite, removeFavorite } = useFavorites();
  const [house, setHouse] = useState<HouseData | null>(null);

  // house_id は number なので変換して検索
  useEffect(() => {
    if (id) {
       const found = (housesData as HouseData[]).find((h) => h.house_id === Number(id));
       if (found) {
           setHouse(found);
       }
    }
  }, [id]);

  if (!id) return null;
  if (!house && id) {
      // useEffectが走る前の一瞬のちらつきを防ぐため、houseが見つかるまではnullかloadingを表示
      // 実際に見つからない場合はnotFound()を表示したいが、クライアントコンポーネントでの扱いに注意
      // ここでは簡易的にロード中表示
      return <div className="container mx-auto p-8 text-center animate-pulse"><p>Loading property details...</p></div>;
  }
  
  if (!house) return notFound(); // Should not happen if data exists

  const isFav = isFavorite(house.house_id);

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(house.house_id);
    } else {
      addFavorite({
        house_id: house.house_id,
        image_url: house.data.image_url || '',
        price: house.data.price,
        address: house.data.address,
        structure: house.data.structure,
        _title: house.data._title,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/listings">
          <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white shadow-sm backdrop-blur">
            <ChevronLeft className="mr-1 h-4 w-4" /> 一覧に戻る
          </Button>
        </Link>
      </div>

      {/* Hero Section with Image */}
      <div className="relative h-[50vh] w-full bg-gray-900">
        {house.data.image_url ? (
          <Image
            src={house.data.image_url}
            alt={house.data._title}
            fill
            className="object-cover opacity-90"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-lg">
            画像なし
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-8 text-white pt-20">
          <div className="container mx-auto">
             <div className="flex gap-2 mb-3 flex-wrap">
                <Badge className="bg-blue-600 hover:bg-blue-700 border-none">{house.data.structure}</Badge>
                {house.data.ai_tags?.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-white border-white/50 bg-white/10 backdrop-blur-sm">#{tag}</Badge>
                ))}
             </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2 leading-tight">
                {house.data.ai_catchphrase || house.data._title}
            </h1>
            <div className="flex items-center text-lg opacity-90">
              <MapPin className="mr-2 h-5 w-5" />
              {house.data.address}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-4 md:gap-8 mb-8 p-6 bg-gray-50/80 rounded-2xl justify-around border border-gray-100">
                   <div className="text-center">
                     <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">価格</p>
                     <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                        ¥{house.data.price.toLocaleString()}
                     </p>
                   </div>
                   <div className="text-center">
                     <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">間取り</p>
                     <p className="text-xl font-semibold text-gray-800">{house.data.structure}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">面積</p>
                     <p className="text-xl font-semibold text-gray-800">{house.data.area ? `${house.data.area}㎡` : '-'}</p>
                   </div>
                   <div className="text-center">
                     <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">築年数</p>
                     <p className="text-xl font-semibold text-gray-800">{house.data.age ? `${house.data.age}年` : '-'}</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold flex items-center text-gray-900 border-b pb-2">
                    <Home className="mr-2 w-5 h-5 text-indigo-500" /> 物件詳細
                  </h2>
                  <p className="text-gray-700 leading-8 whitespace-pre-wrap text-lg">
                    {house.data.ai_description || house.data._description || "詳細な説明はありません。下記リンクより外部サイトをご確認ください。"}
                  </p>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 border rounded-lg">
                    <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">築年数</p>
                      <p className="font-medium">{house.data.age ? `${house.data.age}年` : '不明'}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border rounded-lg">
                    <Ruler className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">土地/建物面積</p>
                      <p className="font-medium">{house.data.area ? `${house.data.area}㎡` : '不明'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Action Panel */}
          <div className="lg:col-span-1">
             <Card className="sticky top-24">
               <CardContent className="p-6 space-y-4">
                 <h3 className="font-semibold text-lg mb-2">この物件に興味がありますか？</h3>
                 
                 <Button 
                   className="w-full h-12 text-lg" 
                   size="lg"
                   asChild
                 >
                   <a href={house.data._detail_url} target="_blank" rel="noopener noreferrer">
                     <ExternalLink className="mr-2 h-5 w-5" />
                     詳細を外部サイトで見る
                   </a>
                 </Button>

                 <Button 
                   variant={isFav ? "destructive" : "outline"} 
                   className="w-full"
                   onClick={handleFavoriteClick}
                 >
                   <Heart className={`mr-2 h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                   {isFav ? 'お気に入りから削除' : 'お気に入りに追加'}
                 </Button>

                 <div className="text-xs text-gray-500 mt-4 text-center">
                   ※このボタンをクリックすると、物件を管理している外部サイトへ移動します。
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}