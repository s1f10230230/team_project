'use client';

import { useState, useEffect } from 'react';
import { Property, DiagnosisResult } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RecommendationsPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // 診断結果を取得
    const stored = localStorage.getItem('diagnosisResult');
    if (stored) {
      setDiagnosisResult(JSON.parse(stored));
    }

    // 物件データを取得
    fetch('/data/properties.json')
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  const getRecommendedProperties = () => {
    if (!diagnosisResult) return properties;

    return properties.filter((property) => {
      // 予算フィルタ
      if (
        property.price < diagnosisResult.budget.min ||
        property.price > diagnosisResult.budget.max
      ) {
        return false;
      }

      // 推奨地域フィルタ
      if (
        diagnosisResult.preferredRegions.length > 0 &&
        !diagnosisResult.preferredRegions.includes(property.regionId)
      ) {
        return false;
      }

      return true;
    });
  };

  const recommendedProperties = getRecommendedProperties();

  if (!diagnosisResult) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-4">
              まずは診断を受けてください
            </h3>
            <p className="text-gray-600 mb-4">
              パーソナル診断を受けると、あなたにぴったりの物件をご提案できます
            </p>
            <Link href="/diagnosis">
              <Button>診断を始める</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">おすすめ物件</h1>
      <p className="text-gray-600 mb-8">
        診断結果に基づいて、あなたにぴったりの物件をピックアップしました
      </p>

      {/* 診断結果サマリー */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>あなたの希望条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-sm text-gray-600">予算</span>
              <p className="font-semibold">
                ¥{diagnosisResult.budget.min.toLocaleString()} 〜 ¥
                {diagnosisResult.budget.max.toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">ライフスタイル</span>
              <div className="flex gap-1 mt-1">
                {diagnosisResult.lifestyle.slice(0, 3).map((style, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">重視ポイント</span>
              <div className="flex gap-1 mt-1">
                {diagnosisResult.priorities.slice(0, 3).map((priority, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {priority}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* おすすめ物件一覧 */}
      {recommendedProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-48 bg-gray-300">
                <div className="h-full flex items-center justify-center text-gray-600">
                  物件画像
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  {property.prefecture} {property.city}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-xl">
                      ¥{property.price.toLocaleString()}
                    </span>
                    <Badge>{property.condition}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>
                      {property.rooms} / {property.buildingArea}㎡
                    </p>
                    <p>
                      築{property.age}年 / {property.structure}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {property.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link href={`/listings/${property.id}`} className="flex-1">
                      <Button className="w-full" variant="outline">
                        詳細を見る
                      </Button>
                    </Link>
                    <Button
                      onClick={() => toggleFavorite(property.id)}
                      variant={isFavorite(property.id) ? 'default' : 'outline'}
                      size="icon"
                    >
                      ♥
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-4">
              条件に合う物件が見つかりませんでした
            </h3>
            <p className="text-gray-600 mb-4">
              条件を変更するか、すべての物件から探してみてください
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/diagnosis">
                <Button variant="outline">診断をやり直す</Button>
              </Link>
              <Link href="/listings">
                <Button>すべての物件を見る</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}