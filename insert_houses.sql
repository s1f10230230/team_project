-- Supabaseのhousesテーブルにデータを挿入するクエリ
-- houses_transformed.jsonのデータを挿入

INSERT INTO houses (house_id, data) VALUES
(1, '{"address": "三重県四日市市稲葉町", "area": 145.61, "age": null, "structure": "売土地", "price": 1500000, "image_url": "https://img.akiya-athome.jp/?v=YzeWPz6Lo1rxME78m6n7IuAKgWAZNwJ3srM9oWlNCgjGbJAskQ24eXfXRP-wV_sT3etmvQly55TsHp2CRxMMEEhzPg36fFUC70SIeCWsF-AenDJ34SPf_A..", "_title": "第134号", "_pref_government": "四日市市", "_type": "売土地", "_detail_url": "https://yokkaichi-c24202.akiya-athome.jp/bukken/detail/buy/42651", "_description": ""}'),
(2, '{"address": "三重県北牟婁郡紀北町東長島", "area": 68.85, "age": 59, "structure": "売戸建", "price": 3500000, "image_url": "https://img.akiya-athome.jp/?v=ATvszLJWEZhKQTZ424i5_KPJOBrnrN-otUq3d746Y_VNuaSdgs1rFAHb7UrQA0HjvPFeaBIH1JLAg2fkLZiW35QUwlcxW_71edK5syUKNX2KhIkFZUmIEtCtWPepg9J1", "_title": "【No.283】東長島の家", "_pref_government": "北牟婁郡紀北町", "_type": "売戸建", "_detail_url": "https://kihoku-t24543.akiya-athome.jp/bukken/detail/buy/42482", "_description": ""}'),
(3, '{"address": "三重県北牟婁郡紀北町船津", "area": 118.41, "age": 46, "structure": "売戸建", "price": 3500000, "image_url": "https://img.akiya-athome.jp/?v=xtbi0lYjFD2wRxxmFj8nljpv5XWq0B7ZjFmOilMe-zuhuyMQuNARrpKH612dBCjIcC2phTEyhdWrrhLXZ2W9UWsr4y2CJ5fDkmWqj2bbxdb7XrvDjOZ1JVDj0BmeewiU", "_title": "【No.274】船津の家", "_pref_government": "北牟婁郡紀北町", "_type": "売戸建", "_detail_url": "https://kihoku-t24543.akiya-athome.jp/bukken/detail/buy/42460", "_description": ""}')
-- 以下、残りの238件のデータも同様の形式で追加
ON CONFLICT (house_id) DO UPDATE
SET data = EXCLUDED.data;

-- 注意:
-- 1. すべてのデータを含む完全なクエリはサイズが大きいため、別途用意が必要です
-- 2. ON CONFLICT句を使用して、既存のhouse_idがある場合は更新するようにしています
-- 3. JSONデータはjsonb型として保存されることを想定しています