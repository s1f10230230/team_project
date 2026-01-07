'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Sparkles, Tag } from 'lucide-react';
import housesData from '../../houses.json';
import { DiagnosisResult } from '@/lib/types';
import { useFavorites } from '@/components/favorites-context';

// JSONデータの型定義
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
    ai_scores?: {
        farming?: number;
        ocean?: number;
        nature?: number;
        convenience?: number;
        parenting?: number;
        diy?: number;
    };
  };
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<HouseData[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { addFavorite, isFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    // LocalStorageから診断結果を取得
    const storedResult = localStorage.getItem('diagnosisResult');
    if (storedResult) {
      try {
        const result: DiagnosisResult = JSON.parse(storedResult);
        setDiagnosisResult(result);

        // スコアリングロジック
        const scoredHouses = (housesData as HouseData[]).map((house) => {
           let score = 0;
           const { ai_scores } = house.data;

           // 1. 予算チェック (必須条件: 範囲外は大幅減点)
           if (house.data.price < result.budget.min || house.data.price > result.budget.max) {
               score -= 100;
           }

           // 2. 地域チェック (エリア内なら加点)
           if (result.preferredRegions.length > 0 && 
               result.preferredRegions.some(r => house.data._pref_government.includes(r))) {
               score += 20;
           }

           // 3. AIスコアに基づく加点
           if (ai_scores) {
               // ライフスタイルマッチング
               if (result.lifestyle.includes('farming')) score += (ai_scores.farming || 0) * 5;
               if (result.lifestyle.includes('ocean')) score += (ai_scores.ocean || 0) * 5;
               if (result.lifestyle.includes('mountain') || result.lifestyle.includes('nature')) score += (ai_scores.nature || 0) * 5;
               if (result.lifestyle.includes('convenience')) score += (ai_scores.convenience || 0) * 5;
               
               // 教育・子育て (優先度に含まれていれば)
               if (result.priorities.includes('child_rearing') || result.lifestyle.includes('parenting')) { // 仮の条件
                   score += (ai_scores.parenting || 0) * 6;
               }
               
               // 基礎点
               if (ai_scores.parenting && ai_scores.parenting >= 4) score += 5; // 教育スコアが高い物件は全体的にプラス
           }

           return { ...house, matchScore: score };
        });

        // ソートして上位を表示
        const sorted = scoredHouses
            .filter(h => h.matchScore > 0) // マイナススコアは除外
            .sort((a, b) => b.matchScore - a.matchScore);

        if (sorted.length < 3) {
            // フォールバック: 予算に合うものを単純に表示
             const budgetOnly = (housesData as HouseData[]).filter((house) => {
               return house.data.price >= result.budget.min && house.data.price <= result.budget.max;
             });
             setRecommendations(budgetOnly.slice(0, 10));
        } else {
             setRecommendations(sorted.slice(0, 10));
        }

      } catch (e) {
        console.error('Failed to parse diagnosis result', e);
      }
    } else {
      // 診断結果がない場合はランダムにいくつか表示
      setRecommendations((housesData as HouseData[]).slice(0, 6));
    }
    setLoading(false);
  }, []);

  const toggleFavorite = (e: React.MouseEvent, house: HouseData) => {
    e.preventDefault();
    if (isFavorite(house.house_id)) {
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


  if (loading) {
    return <div className="container mx-auto p-8 text-center animate-pulse">読み込み中...</div>;
  }

  if (!diagnosisResult && recommendations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">あなたにおすすめの物件を見つけましょう</h1>
        <p className="mb-8 text-gray-600">診断を受けると、ライフスタイルや予算に合った物件がここに表示されます。</p>
        <Link href="/diagnosis">
          <Button size="lg" className="rounded-full bg-gradient-to-r from-orange-500 to-pink-600 border-0 shadow-lg">診断を始める</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="text-yellow-500" />
            あなたへのレコメンデーション
        </h1>
        {diagnosisResult && (
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 items-center mt-2">
             <span className="bg-orange-50 px-3 py-1 rounded-full text-orange-600 font-medium">予算: ¥{diagnosisResult.budget.min.toLocaleString()} - ¥{diagnosisResult.budget.max.toLocaleString()}</span>
             <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium">エリア: {diagnosisResult.preferredRegions[0]}他</span>
          </div>
        )}
      </div>

      {recommendations.length === 0 ? (
         <div className="text-center py-20 bg-gray-50 rounded-2xl">
           <p className="text-xl mb-4 font-bold text-gray-700">条件に完全一致する物件が見つかりませんでした。</p>
           <p className="text-gray-500 mb-6">条件を変更して再度診断してみてください。</p>
           <Link href="/diagnosis">
             <Button variant="outline" className="rounded-full">診断をやり直す</Button>
           </Link>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((house) => (
            <Card key={house.house_id} className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl h-full">
              <div className="relative h-56 w-full overflow-hidden">
                {house.data.image_url ? (
                  <Image
                    src={house.data.image_url}
                    alt={house.data._title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                 
                 {/* AI Recommendation Badge if tags exist */}
                 <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    {house.data.ai_tags && house.data.ai_tags.length > 0 && (
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> AI Pick
                        </div>
                    )}
                    {/* @ts-expect-error dynamic property */}
                    {house.matchScore > 0 && (
                         <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                            <Tag className="w-3 h-3" /> {(house as HouseData & { matchScore: number }).matchScore}pt Match
                        </div>
                    )}
                 </div>

                 <button
                    onClick={(e) => toggleFavorite(e, house)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors shadow-sm ${
                      isFavorite(house.house_id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
                    }`}
                  >
                    <HeartIcon filled={isFavorite(house.house_id)} />
                  </button>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                      <p className="text-white font-bold text-lg drop-shadow-md">
                        ¥{house.data.price.toLocaleString()}
                      </p>
                  </div>
              </div>

              <CardHeader className="p-5 pb-2">
                {/* AI Catchphrase or original title */}
                <CardTitle className="text-xl font-bold leading-tight mb-2 text-gray-800">
                    {house.data.ai_catchphrase || house.data._title}
                </CardTitle>
                
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  {house.data.address}
                </div>
              </CardHeader>
              
              <CardContent className="p-5 py-2 flex-grow">
                 {/* Tags */}
                 {house.data.ai_tags && house.data.ai_tags.length > 0 && (
                     <div className="flex flex-wrap gap-2 mb-3">
                         {house.data.ai_tags.slice(0, 3).map((tag, i) => (
                             <span key={i} className="inline-flex items-center text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-medium">
                                 <Tag className="w-3 h-3 mr-1" /> {tag}
                             </span>
                         ))}
                     </div>
                 )}
                 
                 <div className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {house.data.ai_description || house.data._description || '詳細情報をご覧ください。'}
                 </div>

                 <div className="flex gap-4 text-xs font-semibold text-gray-500 border-t pt-3 border-gray-100">
                    <span>{house.data.structure}</span>
                    <span>{house.data.age ? `築${house.data.age}年` : '-'}</span>
                    <span>{house.data.area ? `${house.data.area}㎡` : '-'}</span>
                 </div>
              </CardContent>
              
              <CardFooter className="p-5 pt-0">
                <Link href={`/listings/${house.house_id}`} className="w-full">
                  <Button className="w-full rounded-xl h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-lg hover:shadow-xl transition-all">
                      詳細を見る
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
    if (filled) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.691 2.25 5.353 4.681 3.26 7.34 3.26c1.53 0 2.984.576 4.088 1.48L12 5.3l.572-.561a5.976 5.976 0 0 1 3.258-1.48c2.66 0 5.09 2.093 5.09 5.431 0 3.483-2.438 6.669-4.755 8.783a25.143 25.143 0 0 1-4.303 3.228 14.658 14.658 0 0 1-.403.237c-.015.008-.025.013-.025.013l-.007.003ZM12 21.357c.074 0 .148-.028.204-.084l.006-.006c.036-.027.078-.052.122-.078.69-.404 9.696-5.839 9.696-12.498 0-4.48-3.08-8.23-7.538-8.23-2.43 0-4.637 1.259-6.02 3.16-1.383-1.9-3.59-3.16-6.022-3.16C2.58 0.5 0.5 3.25 0.5 8.69c0 6.659 9.006 12.094 9.696 12.498.044.026.086.051.122.078l.006.006c.056.056.13.084.204.084Z" />
            </svg>
        )
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
    )
}