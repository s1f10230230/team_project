'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiagnosisForm } from '@/components/diagnosis-form';
import { DiagnosisResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function DiagnosisPage() {
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const router = useRouter();

  const handleDiagnosisComplete = async (diagnosisResult: DiagnosisResult) => {
    setResult(diagnosisResult);
    
    // Supabaseに保存
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { error } = await supabase
        .from('diagnosis_results')
        .insert([
          { 
            user_id: session.user.id,
            result: diagnosisResult 
          }
        ]);
      
      if (error) {
        console.error('Error saving diagnosis details:', error);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
      }
    }

    // 結果をLocalStorageに保存 (バックアップ)
    localStorage.setItem('diagnosisResult', JSON.stringify(diagnosisResult));
  };

  const handleRedirect = () => {
    router.push('/dashboard');
  };

  // セッションチェック
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login?next=/diagnosis');
      }
    };
    checkSession();
  }, [router]);

  if (result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">診断結果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div>
              <h3 className="font-semibold mb-2">予算範囲</h3>
              <p className="text-lg">
                ¥{result.budget.min.toLocaleString()} 〜 ¥
                {result.budget.max.toLocaleString()}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">おすすめ地域</h3>
              {result.preferredRegions.length > 0 ? (
                <div className="space-y-2">
                  {result.preferredRegions.map((regionId) => (
                    <div
                      key={regionId}
                      className="p-3 bg-gray-50 rounded-lg"
                    >
                      {regionId === 'region-1' && '長野県松本市 - 自然豊かな山間地域'}
                      {regionId === 'region-2' && '千葉県南房総市 - 海沿いの暮らし'}
                      {regionId === 'region-3' && '岡山県真庭市 - 農業に適した地域'}
                    </div>
                  ))}
                </div>
              ) : (
                <p>条件に合う地域を探しています...</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleRedirect} className="flex-1">
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