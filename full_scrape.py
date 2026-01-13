import json
import os
import time
import argparse
import scraping
import enrich_houses

# Load prefecture list
def load_prefs():
    path = os.path.join("public", "scraped", "index.json")
    if not os.path.exists(path):
        print(f"Error: {path} not found.")
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def run_pipeline(target_pref_id=None, limit_pages=None, delay=1.0):
    prefs = load_prefs()
    
    # Create output dir if not exists
    out_dir = os.path.join("public", "scraped")
    os.makedirs(out_dir, exist_ok=True)

    for i, pref in enumerate(prefs, start=1):
        pref_code = f"{i:02d}"
        pref_id = pref["id"]
        pref_name = pref["name"]

        # If specific target is requested, skip others
        if target_pref_id and pref_id != target_pref_id:
            continue

        # Check if already done
        save_path = os.path.join(out_dir, f"{pref_id}.json")
        if os.path.exists(save_path) and os.path.getsize(save_path) > 100:
            print(f"[{pref_code} {pref_name} ({pref_id})] Skipping - already exists.")
            continue

        print(f"\n[{pref_code} {pref_name} ({pref_id})] Starting scrape...")
        
        # 1. Scrape
        try:
            # scraping.crawl_pref returns a list of dicts
            # We can pass max_pages if we modify scraping.py or just use default
            # To support limit_pages, we might need to update scraping.py or just break early here if scraping.py allowed control
            # scraping.crawl_pref has max_pages argument? Let's check scraping.py...
            # Yes: def crawl_pref(pref_code: str, delay: float = 1.0, max_pages: int = 999) -> List[dict]:
            
            scraped_data = scraping.crawl_pref(pref_code, delay=delay, max_pages=limit_pages if limit_pages else 999)
            print(f"  -> Scraped {len(scraped_data)} items.")
        except Exception as e:
            print(f"  -> Scraping failed: {e}")
            continue

        if not scraped_data:
            print("  -> No data found, skipping enrichment.")
            # Save empty or skip? Better to save empty list to show we tried.
            # But let's skip saving empty files to keep clean?
            # User might want to know it's empty. Let's save.
            save_path = os.path.join(out_dir, f"{pref_id}.json")
            with open(save_path, "w", encoding="utf-8") as f:
                json.dump([], f, ensure_ascii=False, indent=2)
            continue

        # 2. Enrich with AI
        print(f"  -> Enriching {len(scraped_data)} items with AI...")
        enriched_data = []
        for j, house in enumerate(scraped_data):
            try:
                # house is a flat dict here
                enriched_item = enrich_houses.enrich_house(house)
                enriched_data.append(enriched_item)
                
                # Progress log
                if (j + 1) % 5 == 0:
                    print(f"     Processed {j + 1}/{len(scraped_data)}")
                    # Incremental save
                    with open(save_path, "w", encoding="utf-8") as f:
                        json.dump(enriched_data, f, ensure_ascii=False, indent=2)
                
                time.sleep(1.0) # Increased delay from 0.5 to 1.0

            except Exception as e:
                # Basic error handling, specifically for 429
                error_str = str(e)
                if "429" in error_str:
                    print(f"     [!] Rate limit reached. Sleeping 60s...")
                    time.sleep(60)
                else:
                    print(f"     Failed to enrich item index {j}: {e}")
                enriched_data.append(house) # Append original if failed coverage

        # 3. Save
        save_path = os.path.join(out_dir, f"{pref_id}.json")
        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(enriched_data, f, ensure_ascii=False, indent=2)
        
        print(f"  -> Saved to {save_path}")
        
        time.sleep(2.0) # Delay between prefectures

def main():
    parser = argparse.ArgumentParser(description="Full Scraping & AI Enrichment Pipeline")
    parser.add_argument("--pref", type=str, help="Target prefecture ID (e.g. 'hokkaido'). If not set, runs all.")
    parser.add_argument("--limit", type=int, default=None, help="Limit pages per prefecture for testing.")
    parser.add_argument("--delay", type=float, default=1.0, help="Delay between requests.")
    
    args = parser.parse_args()
    
    run_pipeline(target_pref_id=args.pref, limit_pages=args.limit, delay=args.delay)

if __name__ == "__main__":
    main()
