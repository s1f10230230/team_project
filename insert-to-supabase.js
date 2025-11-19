const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabaseの設定（環境変数から読み込むか、直接設定）
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertHouses() {
  try {
    // houses.jsonファイルを読み込む
    const housesData = JSON.parse(
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
            onConflict: 'house_id',
            ignoreDuplicates: false
          }
        );

      if (error) {
        console.error(`バッチ ${Math.floor(i / batchSize) + 1} でエラー:`, error);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`バッチ ${Math.floor(i / batchSize) + 1} 完了 (${i + batch.length}/${housesData.length})`);
      }
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