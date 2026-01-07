'use client';

import { useEffect, useState } from 'react';

type Property = {
  house_id: number | string;
  _title: string;          // JSONのキーに合わせる
  price: number;
  address?: string;
  image_url?: string;
  _detail_url?: string;    // 外部リンク
};

type Region = {
  id: string;   // ← 地域は id
  name: string;
};

const PAGE_SIZE = 12;
const PAGE_RANGE = 2;

export function ListingsExplorer() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [region, setRegion] = useState<string>(''); // 地域ID
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);

  /* ---------------- 地域一覧を取得 ---------------- */
  useEffect(() => {
    fetch('/scraped/index.json')
      .then(res => res.json())
      .then((data: Region[]) => {
        setRegions(data);
        if (data.length > 0) {
          setRegion(data[0].id);
        }
      })
      .catch(err => console.error('地域一覧の取得に失敗:', err));
  }, []);

  /* ---------------- 地域変更時に物件取得 ---------------- */
  useEffect(() => {
    if (!region) return;

    fetch(`/scraped/${region}.json`)
      .then(res => res.json())
      .then((data: Property[]) => {
        setProperties(data);
        setPage(1);
      })
      .catch(err => console.error('物件一覧の取得に失敗:', err));
  }, [region]);

  /* ---------------- ページング計算 ---------------- */
  const totalPages = Math.ceil(properties.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const paged = properties.slice(start, start + PAGE_SIZE);

  const startPage = Math.max(1, page - PAGE_RANGE);
  const endPage = Math.min(totalPages, page + PAGE_RANGE);

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* 地域選択 */}
      <div className="flex items-center gap-4">
        <label className="font-semibold">地域</label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border rounded px-3 py-1"
        >
          {regions.map(r => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* 物件一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paged.map(p => (
          <div key={String(p.house_id)} className="border rounded overflow-hidden">
            <div className="h-48 w-full overflow-hidden">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p._title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-300 text-gray-600">
                  物件画像なし
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{p._title}</h3>
              <p className="text-gray-600 text-sm">{p.address || '住所不明'}</p>
              <p className="font-bold">
                ¥{p.price?.toLocaleString() || '価格不明'}
              </p>

              {/* ★ 外部サイトへ遷移 */}
              {p._detail_url ? (
                <a
                  href={p._detail_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm underline"
                >
                  詳細を見る（公式）
                </a>
              ) : (
                <span className="text-gray-400 text-sm">詳細URLなし</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ページャ */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            ←
          </button>

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(pn => (
            <button
              key={pn}
              onClick={() => setPage(pn)}
              className={`px-3 py-1 border rounded ${pn === page ? 'bg-black text-white' : ''}`}
            >
              {pn}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
