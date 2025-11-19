import json

# 既存のJSONファイルを読み込む
with open('houses.json', 'r', encoding='utf-8') as f:
    houses = json.load(f)

# 新しい形式に変換
transformed_houses = []
for house in houses:
    # house_idを取得
    house_id = house.get('house_id', house.get('id', None))

    # dataオブジェクトの中に他のプロパティを格納
    transformed_house = {
        "house_id": house_id,
        "data": {
            "address": house.get('address'),
            "area": house.get('area'),
            "age": house.get('age'),
            "structure": house.get('structure'),
            "price": house.get('price'),
            "image_url": house.get('image_url'),
            "_title": house.get('_title'),
            "_pref_government": house.get('_pref_government'),
            "_type": house.get('_type'),
            "_detail_url": house.get('_detail_url'),
            "_description": house.get('_description', "")
        }
    }
    transformed_houses.append(transformed_house)

# 変換したデータを新しいファイルに保存
with open('houses_transformed.json', 'w', encoding='utf-8') as f:
    json.dump(transformed_houses, f, ensure_ascii=False, indent=2)

print(f"変換完了: {len(transformed_houses)}件のデータを処理しました")
print("新しいファイル: houses_transformed.json")