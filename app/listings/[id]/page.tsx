'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ListingInquiryForm } from '@/components/listing-inquiry-form';
import { useFavorites } from '@/hooks/use-favorites';

type Property = {
  id: string;
  title: string;
  price: number;
  address?: string;
  image_url?: string;
  after_image_url?: string;
  rooms?: string;
  buildingArea?: number;
  landArea?: number;
  age?: number;
  features: string[];
  description?: string;
  renovationCost?: number;
  demolitionCost?: number;
  nearbyFacilities: {
    station?: string;
    school?: string;
    hospital?: string;
    supermarket?: string;
  };
  regionId: string;
};

type Region = {
  id: string;
  name: string;
  features: string[];
  infrastructure: {
    schools: number;
    hospitals: number;
    supermarkets: number;
    stations: number;
  };
  subsidies: string[];
};

export default function ListingDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [showAfterImage, setShowAfterImage] = useState(false);

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    // 物件データ
    fetch('/scraped/index.json') // 必要に応じて全地域リストを使うか、地域ごとにfetch
      .then(res => res.json())
      .then((regions: Region[]) => {
        let foundProp: Property | undefined;
        regions.forEach(r => {
          try {
            const data = require(`/scraped/${r.id}.json`) as Property[];
            const f = data.find(p => p.id === propertyId);
            if (f) foundProp = f;
          } catch {}
        });
        if (foundProp) {
          setProperty(foundProp);
          fetch(`/scraped/${foundProp.regionId}.json`)
            .then(res => res.json())
            .then((props: Property[]) => {
              const propRegion = props.find(p => p.id === propertyId);
              if (propRegion) setProperty(propRegion);
            });

          fetch(`/scraped/${foundProp.regionId}.json`)
            .then(res => res.json())
            .then((props: Property[]) => {
              const regionData = props.find(p => p.id === propertyId);
              if (regionData) setRegion({
                id: foundProp!.regionId,
                name: foundProp!.regionId,
                features: [],
                infrastructure: { schools: 0, hospitals: 0, supermarkets: 0, stations: 0 },
                subsidies: []
              });
            });
        }
      });
  }, [propertyId]);

  if (!property) return <p>物件情報を読み込んでいます...</p>;

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
              {showAfterImage && property.after_image_url ? (
                <img src={property.after_image_url} alt={`${property.title}（リフォーム後）`} className="w-full h-96 object-cover" />
              ) : property.image_url ? (
                <img src={property.image_url} alt={property.title} className="w-full h-96 object-cover" />
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-300 text-gray-600">
                  物件画像
                </div>
              )}
            </CardContent>
          </Card>

          {/* 以下、物件情報 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{property.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{property.address || '住所不明'}</p>
              <p className="font-bold text-xl">¥{property.price?.toLocaleString() || '価格不明'}</p>
            </CardContent>
          </Card>
        </div>

        {/* 問い合わせフォーム */}
        <div className="lg:col-span-1">
          <ListingInquiryForm propertyId={property.id} propertyTitle={property.title} />
        </div>
      </div>
    </div>
  );
}
