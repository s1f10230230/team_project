"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient, Session } from '@supabase/supabase-js';

const SUPABASE_URL = "https://uawjbioilmhuuybnlhcv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhd2piaW9pbG1odXV5Ym5saGN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExMDA5NjUsImV4cCI6MjA3NjY3Njk2NX0.aX9wqc7j1AYW3-Oz311GiH5eckAbR47Cuwy68pWbSqs";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">

      {/* --- ここを追加：ログイン中ユーザーを表示 --- */}
      {session && (
        <div className="text-right text-sm text-gray-500 mb-4">
          ログイン中: <span className="font-bold">{session.user.email}</span>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          空き家で始める新しい暮らし
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AIマッチングで、あなたにぴったりの移住先を見つけます
        </p>
        {!session && (
          <Link href="/login">
            <Button className="mx-auto">ログイン / サインアップ</Button>
          </Link>
        )}
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
            {session ? (
              <Link href="/diagnosis">
                <Button className="w-full">診断を始める</Button>
              </Link>
            ) : (
              <Button className="w-full" disabled>
                ログインが必要
              </Button>
            )}
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
            {session ? (
              <Link href="/favorites">
                <Button className="w-full">お気に入りを見る</Button>
              </Link>
            ) : (
              <Button className="w-full" disabled>
                ログインが必要
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
