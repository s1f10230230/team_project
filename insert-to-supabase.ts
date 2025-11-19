import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 型定義
interface HouseData {
  address: string;
  area: number | null;
  age: number | null;
  structure: string;
  price: number | null;
  image_url: string | null;
  _title: string;
  _pref_government: string;
  _type: string;
  _detail_url: string;
  _description: string;
}

interface House {
  house_id: number;
  data: HouseData;
}

// Supabaseの設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertHouses(): Promise<void> {
  try {
    // houses.jsonファイルを読み込む
    const housesData: House[] = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'houses.json'), 'utf8')
    );

    console.log(`読み込んだデータ数: ${housesData.length}件`);

    // バッチサイズを設定（一度に挿入するレコード数）
    const batchSize = 50;
    let successCount = 0;
    let errorCount = 0;

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
      } else {
        successCount += batch.length;
        console.log(`バッチ ${Math.floor(i / batchSize) + 1} 完了 (${i + batch.length}/${housesData.length})`);
      }

      // レート制限を避けるため、バッチ間で少し待機
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n=== 挿入完了 ===');
    console.log(`成功: ${successCount}件`);
    console.log(`エラー: ${errorCount}件`);

  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 実行
insertHouses();