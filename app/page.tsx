import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          空き家で始める新しい暮らし
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AIマッチングで、あなたにぴったりの移住先を見つけます
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>AIマッチング診断</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              ライフスタイルや希望条件から、最適な地域と物件をご提案
            </p>
            <Link href="/diagnosis">
              <Button className="w-full">診断を始める</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>物件を探す</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              全国の空き家物件から、条件に合う物件を検索
            </p>
            <Link href="/listings">
              <Button className="w-full">物件一覧へ</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>お気に入り</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              気になる物件を保存して、じっくり比較検討
            </p>
            <Link href="/favorites">
              <Button className="w-full">お気に入りを見る</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>このサービスの特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">🏠 リフォーム可視化</h3>
              <p className="text-gray-600">
                現況写真から生成AIで&quot;After&quot;イメージを提示、概算見積も自動計算
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📍 地域のリアル情報</h3>
              <p className="text-gray-600">
                教育・医療・交通・ネット環境・コミュニティ情報を統合
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🤖 AIマッチング</h3>
              <p className="text-gray-600">
                ライフスタイル・就労条件と地域/空き家の合致度をスコア化
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">📞 ワンストップサポート</h3>
              <p className="text-gray-600">
                問い合わせ・見学予約・助成金案内まで一貫してサポート
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
