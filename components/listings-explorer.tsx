'use client';

import { useState, useEffect } from 'react';
import { Property, Region } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ListingsExplorer() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [filter, setFilter] = useState({
    prefecture: '',
    maxPrice: 50000000,
    minRooms: 0,
  });
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // データを読み込む
    fetch('/data/properties.json')
      .then((res) => res.json())
      .then((data) => setProperties(data));

    fetch('/data/regions.json')
      .then((res) => res.json())
      .then((data) => setRegions(data));
  }, []);

  const filteredProperties = properties.filter((property) => {
    if (filter.prefecture && property.prefecture !== filter.prefecture) {
      return false;
    }
    if (property.price > filter.maxPrice) {
      return false;
    }
    return true;
  });

  const getRegionName = (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    return region ? region.name : '';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">物件を探す</h2>
        <div className="flex gap-4 mb-4">
          <select
            className="px-3 py-2 border rounded-lg"
            value={filter.prefecture}
            onChange={(e) => setFilter({ ...filter, prefecture: e.target.value })}
          >
            <option value="">すべての地域</option>
            <option value="長野県">長野県</option>
            <option value="千葉県">千葉県</option>
            <option value="岡山県">岡山県</option>
          </select>
          <select
            className="px-3 py-2 border rounded-lg"
            value={filter.maxPrice}
            onChange={(e) => setFilter({ ...filter, maxPrice: Number(e.target.value) })}
          >
            <option value={5000000}>500万円以下</option>
            <option value={10000000}>1000万円以下</option>
            <option value={20000000}>2000万円以下</option>
            <option value={50000000}>すべての価格</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="h-48 bg-gray-300">
              {/* 画像プレースホルダー */}
              <div className="h-full flex items-center justify-center text-gray-600">
                物件画像
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{property.title}</CardTitle>
              <p className="text-sm text-gray-600">{getRegionName(property.regionId)}</p>
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
                  <p>{property.rooms} / {property.buildingArea}㎡</p>
                  <p>築{property.age}年 / {property.structure}</p>
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
    </div>
  );
}