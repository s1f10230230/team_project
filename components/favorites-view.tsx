'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FavoritesView() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    fetch('/data/properties.json')
      .then((res) => res.json())
      .then((data) => setProperties(data));
  }, []);

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  const toggleCompare = (propertyId: string) => {
    setCompareList((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      }
      if (prev.length >= 3) {
        alert('比較は3件まで選択できます');
        return prev;
      }
      return [...prev, propertyId];
    });
  };

  const compareProperties = () => {
    if (compareList.length < 2) {
      alert('比較するには2件以上選択してください');
      return;
    }
    // 比較ページへ遷移
    const params = new URLSearchParams();
    compareList.forEach((id) => params.append('id', id));
    window.location.href = `/compare?${params.toString()}`;
  };

  if (favoriteProperties.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">お気に入り物件がありません</h3>
            <p className="text-gray-600 mb-4">
              気になる物件を見つけたら、ハートマークをクリックして保存しましょう
            </p>
            <Link href="/listings">
              <Button>物件を探す</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">お気に入り物件</h2>
        {compareList.length > 0 && (
          <Button onClick={compareProperties}>
            比較する ({compareList.length}件選択中)
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favoriteProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="h-48 bg-gray-300">
              <div className="h-full flex items-center justify-center text-gray-600">
                物件画像
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex-1">{property.title}</CardTitle>
                <input
                  type="checkbox"
                  checked={compareList.includes(property.id)}
                  onChange={() => toggleCompare(property.id)}
                  className="ml-2"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-bold text-xl">
                  ¥{property.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    {property.prefecture} {property.city}
                  </p>
                  <p>
                    {property.rooms} / {property.buildingArea}㎡
                  </p>
                  <p>
                    築{property.age}年 / {property.structure}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/listings/${property.id}`} className="flex-1">
                    <Button className="w-full" variant="outline">
                      詳細を見る
                    </Button>
                  </Link>
                  <Button
                    onClick={() => toggleFavorite(property.id)}
                    variant="default"
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
    </div>
  );
}