'use client';

import { useState, useEffect } from 'react';
import { Property, Region } from '@/lib/types';
import { ListingInquiryForm } from '@/components/listing-inquiry-form';
import { useFavorites } from '@/hooks/use-favorites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ListingDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const [property, setProperty] = useState<Property | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [showAfterImage, setShowAfterImage] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // 物件データを取得
    fetch('/data/properties.json')
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: Property) => p.id === propertyId);
        setProperty(found);

        // 地域データを取得
        if (found) {
          fetch('/data/regions.json')
            .then((res) => res.json())
            .then((regions) => {
              const foundRegion = regions.find(
                (r: Region) => r.id === found.regionId
              );
              setRegion(foundRegion);
            });
        }
      });
  }, [propertyId]);

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>物件情報を読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/listings">
        <Button variant="outline" className="mb-4">
          ← 物件一覧に戻る
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* メイン画像 */}
          <Card>
            <CardContent className="p-0">
              <div className="h-96 bg-gray-300 flex items-center justify-center text-gray-600">
                {showAfterImage ? 'リフォーム後イメージ' : '物件画像'}
              </div>
            </CardContent>
          </Card>

          {/* 物件基本情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{property.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge>{property.condition}</Badge>
                {region && <span className="text-gray-600">{region.name}</span>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">
                ¥{property.price.toLocaleString()}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-gray-600">間取り</span>
                  <p className="font-semibold">{property.rooms}</p>
                </div>
                <div>
                  <span className="text-gray-600">建物面積</span>
                  <p className="font-semibold">{property.buildingArea}㎡</p>
                </div>
                <div>
                  <span className="text-gray-600">土地面積</span>
                  <p className="font-semibold">{property.landArea}㎡</p>
                </div>
                <div>
                  <span className="text-gray-600">築年数</span>
                  <p className="font-semibold">築{property.age}年</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">物件の特徴</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">物件説明</h3>
                <p className="text-gray-700">{property.description}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => toggleFavorite(property.id)}
                  variant={isFavorite(property.id) ? 'default' : 'outline'}
                >
                  {isFavorite(property.id) ? '♥ お気に入り済み' : '♡ お気に入りに追加'}
                </Button>
                <Button
                  onClick={() => setShowAfterImage(!showAfterImage)}
                  variant="outline"
                >
                  {showAfterImage ? 'Before画像' : 'After画像'} を見る
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 費用概算 */}
          <Card>
            <CardHeader>
              <CardTitle>費用概算</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>物件価格</span>
                  <span className="font-semibold">
                    ¥{property.price.toLocaleString()}
                  </span>
                </div>
                {property.renovationCost && property.renovationCost > 0 && (
                  <div className="flex justify-between">
                    <span>リフォーム費用（概算）</span>
                    <span className="font-semibold">
                      ¥{property.renovationCost.toLocaleString()}
                    </span>
                  </div>
                )}
                {property.demolitionCost && (
                  <div className="flex justify-between">
                    <span>解体費用（概算）</span>
                    <span className="text-gray-600">
                      ¥{property.demolitionCost.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">合計（リフォーム込み）</span>
                    <span className="font-bold text-lg">
                      ¥
                      {(
                        property.price + (property.renovationCost || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 周辺施設 */}
          <Card>
            <CardHeader>
              <CardTitle>周辺施設</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {property.nearbyFacilities.station && (
                  <div>
                    <span className="text-gray-600">🚉 最寄り駅</span>
                    <p>{property.nearbyFacilities.station}</p>
                  </div>
                )}
                {property.nearbyFacilities.school && (
                  <div>
                    <span className="text-gray-600">🏫 学校</span>
                    <p>{property.nearbyFacilities.school}</p>
                  </div>
                )}
                {property.nearbyFacilities.hospital && (
                  <div>
                    <span className="text-gray-600">🏥 医療施設</span>
                    <p>{property.nearbyFacilities.hospital}</p>
                  </div>
                )}
                {property.nearbyFacilities.supermarket && (
                  <div>
                    <span className="text-gray-600">🛒 買い物</span>
                    <p>{property.nearbyFacilities.supermarket}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 地域情報 */}
          {region && (
            <Card>
              <CardHeader>
                <CardTitle>地域情報: {region.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">地域の特徴</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.features.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">インフラ</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>学校: {region.infrastructure.schools}校</div>
                      <div>病院: {region.infrastructure.hospitals}施設</div>
                      <div>スーパー: {region.infrastructure.supermarkets}店</div>
                      <div>駅: {region.infrastructure.stations}駅</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">支援制度</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {region.subsidies.map((subsidy, index) => (
                        <li key={index}>{subsidy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* サイドバー（問い合わせフォーム） */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ListingInquiryForm
              propertyId={property.id}
              propertyTitle={property.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
}