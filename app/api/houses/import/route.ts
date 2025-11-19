import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import housesData from '@/houses.json';

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST() {
  try {
    console.log(`インポート開始: ${housesData.length}件のデータ`);

    // バッチサイズを設定
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    for (let i = 0; i < housesData.length; i += batchSize) {
      const batch = housesData.slice(i, i + batchSize);

      // バッチごとにデータを挿入
      const { data, error } = await supabase
        .from('houses')
        .upsert(
          batch.map(house => ({
            house_id: house.house_id,
            data: house.data
          })),
          {
            onConflict: 'house_id'
          }
        );

      if (error) {
        console.error(`バッチ ${Math.floor(i / batchSize) + 1} でエラー:`, error);
        errorCount += batch.length;
        errors.push({
          batch: Math.floor(i / batchSize) + 1,
          error: error.message
        });
      } else {
        successCount += batch.length;
        console.log(`バッチ ${Math.floor(i / batchSize) + 1} 完了`);
      }

      // レート制限を避けるため待機
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return NextResponse.json({
      success: true,
      message: 'データのインポートが完了しました',
      results: {
        total: housesData.length,
        success: successCount,
        error: errorCount
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('インポートエラー:', error);
    return NextResponse.json({
      success: false,
      message: 'データのインポートに失敗しました',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}