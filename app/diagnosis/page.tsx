"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DiagnosisForm } from "@/components/diagnosis-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/* =====================
   型定義
===================== */
type AiScores = {
  farming?: number;
  ocean?: number;
  nature?: number;
  convenience?: number;
  parenting?: number;
  diy?: number;
};

type House = {
  house_id: number;
  address: string;
  area: number | null;   // ほぼ全件あり
  age: number | null;    // 欠損多め
  structure: string;
  price: number | null;  // 欠損あり
  image_url?: string;
  _title?: string;
  _pref_government?: string;
  _type?: string;
  _detail_url?: string;
  _description?: string;
  ai_scores?: AiScores;
};

type DiagnosisResult = {
  lifestyle: string[];
  priorities: string[];
  budget: {
    min: number;
    max: number;
  };
  preferredRegions: string[];
};

/* =====================
   回答 → ai_scores マッピング
===================== */
const priorityMap: Record<string, keyof AiScores> = {
  "農業": "farming",
  "海の近く": "ocean",
  "自然": "nature",
  "利便性": "convenience",
  "子育て": "parenting",
  "DIY": "diy",
};

/* =====================
   (A) 価値観スコア：ai_scores
===================== */
function calcAiScore(house: House, priorities: string[]): number {
  if (!house.ai_scores) return 0;
  let score = 0;
  for (const p of priorities) {
    const key = priorityMap[p];
    if (!key) continue;
    score += house.ai_scores[key] ?? 0;
  }
  return score; // 例：0〜24程度
}

/* =====================
   (B) 価格スコア：予算適合
   - 予算内：10
   - 10%超過：5
   - 大幅超過 or 不明：0
===================== */
function calcPriceScore(
  house: House,
  budget: { min: number; max: number }
): number {
  if (house.price == null) return 0;

  const { min, max } = budget;
  const price = house.price;

  if (price >= min && price <= max) return 10;

  // 10% までの超過は部分加点
  const upper10 = max * 1.1;
  if (price > max && price <= upper10) return 5;

  return 0;
}

/* =====================
   (C) 面積スコア：暮らし適合
   - 回答内容に応じて評価基準を変更
===================== */
function calcAreaScore(house: House, priorities: string[]): number {
  if (house.area == null) return 0;

  const area = house.area;

  const wantsParenting = priorities.includes("子育て");
  const wantsDIY = priorities.includes("DIY");
  const wantsConvenience = priorities.includes("利便性");

  // 子育て or DIY → 広さ重視
  if (wantsParenting || wantsDIY) {
    if (area >= 100) return 10;
    if (area >= 80) return 8;
    if (area >= 60) return 5;
    return 2;
  }

  // 利便性重視（単身・コンパクト想定）
  if (wantsConvenience) {
    if (area >= 30 && area <= 60) return 10;
    if (area > 60 && area <= 90) return 6;
    return 3;
  }

  // それ以外（バランス型）
  if (area >= 80) return 8;
  if (area >= 60) return 6;
  if (area >= 40) return 4;
  return 2;
}

/* =====================
   (D) 築年数スコア：参考程度
   - 欠損が多いので影響は小さめ
===================== */
function calcAgeScore(house: House): number {
  if (house.age == null) return 0;
  if (house.age <= 20) return 3;
  if (house.age <= 40) return 2;
  return 1;
}

/* =====================
   総合スコア
   重み：
   ai 50% / 価格 30% / 面積 15% / 築年 5%
===================== */
function calcTotalScore(house: House, result: DiagnosisResult): number {
  const ai = calcAiScore(house, result.priorities);
  const price = calcPriceScore(house, result.budget);
  const area = calcAreaScore(house, result.priorities);
  const age = calcAgeScore(house);

  const total =
    ai * 0.5 +
    price * 0.3 +
    area * 0.15 +
    age * 0.05;

  return Math.round(total * 100) / 100; // 小数第2位まで
}

/* =====================
   メインページ
===================== */
export default function DiagnosisPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [houses, setHouses] = useState<House[]>([]);
  const router = useRouter();

  /* =====================
     診断完了（質問→結果）
     ※ 構成は崩さない
  ===================== */
  const handleDiagnosisComplete = (diagnosisResult: DiagnosisResult) => {
    setResult(diagnosisResult);
    localStorage.setItem("diagnosisResult", JSON.stringify(diagnosisResult));
  };

  /* =====================
     物件JSONの読み込み
     public/scraped/{都道府県ローマ字}.json
===================== */
  useEffect(() => {
    if (!result) return;

    const load = async () => {
      try {
        // 必要に応じて、result から都道府県を決定してください
        const res = await fetch("/scraped/nara.json");
        if (!res.ok) throw new Error("物件データの取得に失敗しました");

        const data: House[] = await res.json();
        setHouses(data);
      } catch (err) {
        console.error(err);
        setHouses([]);
      }
    };

    load();
  }, [result]);

  /* =====================
     レコメンド計算
===================== */
  const recommended = useMemo(() => {
    if (!result || !houses.length) return [];

    const scored = houses.map((h) => ({
      ...h,
      _score: calcTotalScore(h, result),
    }));

    // スコア降順
    scored.sort((a, b) => (b._score ?? 0) - (a._score ?? 0));
    return scored;
  }, [houses, result]);

  /* =====================
     まだ質問中ならフォーム
===================== */
  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          パーソナル診断
        </h1>
        <p className="text-center text-gray-600 mb-8">
          簡単な質問に答えるだけで、あなたにぴったりの移住先をご提案します
        </p>
        <DiagnosisForm onComplete={handleDiagnosisComplete} />
      </div>
    );
  }

  /* =====================
     結果表示
===================== */
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">診断結果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ライフスタイル */}
          <div>
            <h3 className="font-semibold mb-2">あなたのライフスタイル</h3>
            <div className="flex flex-wrap gap-2">
              {result.lifestyle.map((style, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* 重視ポイント */}
          <div>
            <h3 className="font-semibold mb-2">重視するポイント</h3>
            <div className="flex flex-wrap gap-2">
              {result.priorities.map((priority, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {priority}
                </span>
              ))}
            </div>
          </div>

          {/* 予算 */}
          <div>
            <h3 className="font-semibold mb-2">予算範囲</h3>
            <p className="text-lg">
              ¥{result.budget.min.toLocaleString()} 〜 ¥
              {result.budget.max.toLocaleString()}
            </p>
          </div>

          {/* レコメンド物件 */}
          <div>
            <h3 className="font-semibold mb-4">おすすめ物件</h3>

            {recommended.length === 0 && (
              <p>条件に合う物件が見つかりませんでした。</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommended.slice(0, 6).map((house) => (
                <div
                  key={house.house_id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  {house.image_url && (
                    <img
                      src={house.image_url}
                      alt={house._title ?? ""}
                      className="w-full h-40 object-cover rounded"
                    />
                  )}

                  <h4 className="font-semibold">
                    {house._title ?? "物件"}
                  </h4>
                  <p>{house.address}</p>

                  {/* 価格（null安全） */}
                  <p>
                    価格:{" "}
                    {house.price != null
                      ? `${house.price.toLocaleString()} 円`
                      : "価格未設定"}
                  </p>

                  {/* 面積（ほぼ全件あり） */}
                  <p>
                    面積:{" "}
                    {house.area != null ? `${house.area} ㎡` : "不明"}
                  </p>

                  {/* 総合スコア */}
                  <p className="font-bold">
                    総合スコア: {(house as any)._score}
                  </p>

                  {house._detail_url && (
                    <a
                      href={house._detail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      詳細を見る
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/dashboard")} className="flex-1">
              おすすめ物件を見る
            </Button>
            <Link href="/listings" className="flex-1">
              <Button variant="outline" className="w-full">
                すべての物件を見る
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
