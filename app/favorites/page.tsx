'use client';

import { useFavorites } from '@/components/favorites-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">お気に入り物件</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-500 mb-4">まだお気に入り物件がありません</p>
          <Link href="/listings">
            <Button>物件を探す</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((house) => (
            <Card key={house.house_id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full">
                {house.image_url ? (
                  <Image
                    src={house.image_url}
                    alt={house._title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFavorite(house.house_id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg line-clamp-1">{house._title}</CardTitle>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {house.address}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-primary">
                    ¥{house.price.toLocaleString()}
                  </span>
                  <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                    {house.structure}
                  </span>
                </div>
                
                <Link href={`/listings/${house.house_id}`}>
                  <Button className="w-full" variant="outline">
                    詳細を見る
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}