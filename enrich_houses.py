import json
import os
import time
from openai import OpenAI

# .env.local 読み込み (簡易)
def load_env():
    env = {}
    if os.path.exists(".env.local"):
        with open(".env.local", "r") as f:
            for line in f:
                if "=" in line:
                    k, v = line.strip().split("=", 1)
                    v = v.strip('"').strip("'")
                    env[k] = v
    return env

env_file = load_env()
API_KEY = os.getenv("INIAD_API_KEY") or env_file.get("INIAD_API_KEY")
API_BASE = os.getenv("INIAD_API_BASE") or env_file.get("INIAD_API_BASE")

if not API_KEY or not API_BASE:
    print("Error: INIAD_API_KEY or INIAD_API_BASE not found in .env.local")
    exit(1)

client = OpenAI(
    api_key=API_KEY,
    base_url=API_BASE,
)

def enrich_house(house_data):
    # すでにAI生成済みでも、スコアがない場合は再実行したいのでチェックを緩和、あるいは強制実行
    # ここでは強制的に更新するためにスキップロジックをコメントアウト
    # if "ai_tags" in house_data and house_data["ai_tags"]:
    #     return house_data

    # プロンプト作成
    prompt = f"""
    以下の物件情報から、魅力的な「キャッチコピー(30文字以内)」「紹介文(100文字程度)」「タグ(3-5個)」を生成してください。
    さらに、以下の5つの観点で「適合度スコア(1-5)」を判定してください。
    
    1. farming: 農業や家庭菜園に向いているか (庭の広さ、田舎度)
    2. ocean: 海遊びや釣りを楽しめるか (海に近いか)
    3. nature: 山遊びや森林浴など自然を満喫できるか
    4. convenience: 都市的な利便性 (買い物、交通)
    5. parenting: 子育て・教育環境 (広さ、治安、周辺環境)
    6. diy: DIYやリノベーションのやりがいがあるか (古民家、補修必要か)

    JSON形式で出力してください。
    キー:
    - "catchphrase" (string)
    - "description" (string)
    - "tags" (list of strings)
    - "ai_scores" (object with keys: farming, ocean, nature, convenience, parenting, diy. Values are int 1-5)
    
    物件情報:
    住所: {house_data.get('address')}
    価格: {house_data.get('price')}円
    構造: {house_data.get('structure')}
    面積: {house_data.get('area')}m2
    築年数: {house_data.get('age')}年
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini", # または gpt-4-turbo など
            messages=[
                {"role": "system", "content": "You are a helpful real estate assistant. Output strict JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
        )
        content = response.choices[0].message.content
        ai_data = json.loads(content)
        
        house_data["ai_catchphrase"] = ai_data.get("catchphrase", "")
        house_data["ai_description"] = ai_data.get("description", "")
        house_data["ai_tags"] = ai_data.get("tags", [])
        house_data["ai_scores"] = ai_data.get("ai_scores", {})
        
        print(f"Enriched: {house_data.get('address')} -> Scores: {house_data['ai_scores']}")
    except Exception as e:
        print(f"Error processing {house_data.get('address')}: {e}")
    
    return house_data

def main():
    with open("houses.json", "r", encoding="utf-8") as f:
        houses = json.load(f)
    
    # 時間がかかるので、まずは先頭30件だけ処理などを検討してもよいが、
    # ここではループで回す。必要なら limit をかける。
    # 全件処理
    print(f"Total houses: {len(houses)}. Processing all items...")
    
    enriched_houses = []
    for i, house in enumerate(houses):
        # 既存データの構造 house = { "house_id": 1, "data": { ... } }
        # house["data"] を更新する
        # エラーハンドリングを追加して途中で止まらないようにする
        try:
            house["data"] = enrich_house(house["data"])
        except Exception as e:
            print(f"Failed to enrich house {i}: {e}")
        
        time.sleep(0.5) # Rate limit考慮
        enriched_houses.append(house)

    # 保存
    with open("houses.json", "w", encoding="utf-8") as f:
        json.dump(enriched_houses, f, ensure_ascii=False, indent=2)
    
    print("Done! Saved to houses.json")

if __name__ == "__main__":
    main()
