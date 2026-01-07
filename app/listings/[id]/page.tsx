'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListingInquiryForm } from '@/components/listing-inquiry-form';

type Property = {
  house_id: string;
  title: string;
  price: number;
  address?: string;
  image_url?: string;
  after_image_url?: string;
};

type Region = {
  id: string;   // ← 地域ID
  name: string;
};

export default function ListingDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;   // ← [id] から取得

  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (!propertyId) {
      console.error('URLから物件IDを取得できていません');
      return;
    }

    // ① 地域一覧を取得
    fetch('/scraped/index.json')
      .then(res => res.json())
      .then((regions: Region[]) => {
        // ② 各地域のJSONを取得して物件を検索
        Promise.all(
          regions.map(r =>
            fetch(`/scraped/${r.id}.json`)
              .then(res => res.json())
              .catch(() => null)
          )
        ).then(results => {
          let found: Property | undefined;

          results.forEach(props => {
            if (!props) return;
            const f = props.find((p: Property) => String(p.house_id) === String(propertyId));
            if (f) found = f;
          });

          if (found) {
            setProperty(found);
          } else {
            console.error('物件が見つかりません:', propertyId);
          }
        });
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
          <Card>
            <CardContent className="p-0">
              {property.image_url ? (
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-300 text-gray-600">
                  物件画像
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{property.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{property.address || '住所不明'}</p>
              <p className="font-bold text-xl">¥{property.price.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <ListingInquiryForm
            propertyId={property.house_id}
            propertyTitle={property.title}
          />
        </div>
      </div>
    </div>
  );
}
