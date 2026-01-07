#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AtHome 空き家バンク（都道府県一覧）スクレイパ
- 指定の都道府県コードページ（例: /buy/08/）を最後のページまで巡回
- 一覧の各物件カード(.propety)から項目を抽出
- houses.json 形式で保存

使い方:
python scrape_akiya.py --pref 08 --out houses.json

依存:
pip install requests beautifulsoup4 lxml
"""

import argparse
import json
import re
import time
from datetime import datetime
from typing import Optional, Tuple, List

import requests
from bs4 import BeautifulSoup

BASE = "https://www.akiya-athome.jp"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/118.0.0.0 Safari/537.36"
    )
}

# ---------------------------------------------------------------------
# ユーティリティ
# ---------------------------------------------------------------------

def text(el) -> str:
    if not el:
        return ""
    return re.sub(r"\s+", " ", el.get_text(strip=True))


def normalize_image_url(src: Optional[str]) -> Optional[str]:
    if not src:
        return None
    if src.startswith("//"):
        return "https:" + src
    if src.startswith("/img/noimage.gif"):
        return None
    if src.startswith("/"):
        return BASE + src
    return src


def parse_int_from_price(text_price: str) -> Optional[int]:
    """
    '415万円', '1,260万円' → 円(int)
    '相談' 等 → None
    """
    t = text_price.replace(",", "")
    m = re.search(r"(\d+)\s*万\s*円", t)
    if not m:
        m = re.search(r"(\d+)\s*万円", t)
    if m:
        return int(m.group(1)) * 10000
    return None


def parse_area_m2(text_area: str) -> Optional[float]:
    """
    '102.26㎡' → 102.26
    """
    m = re.search(r"([\d\.]+)\s*㎡", text_area.replace(",", ""))
    return float(m.group(1)) if m else None


def parse_built_years(text_built: str) -> Optional[int]:
    """
    '1972年6月' → 築年数
    '不詳' → None
    """
    t = text_built.strip()
    if not t or "不詳" in t or t == "-":
        return None
    m = re.search(r"(\d{4})年", t)
    if not m:
        return None
    year = int(m.group(1))
    age = datetime.now().year - year
    return age if age >= 0 else None


def extract_dtdd_map(detail_ul) -> dict:
    """
    <dt>ラベル</dt> → <dd>値</dd> を辞書化
    """
    info = {}
    for dl in detail_ul.select("dl"):
        k = text(dl.find("dt"))
        v = text(dl.find("dd"))
        if k and k not in info:
            info[k] = v
    return info

# ---------------------------------------------------------------------
# 1ページ分の解析
# ---------------------------------------------------------------------

def parse_list_page(html: str) -> Tuple[List[dict], Optional[int]]:
    soup = BeautifulSoup(html, "lxml")
    items: List[dict] = []

    # ※ サイト側の typo に依存（propety）
    for sec in soup.select("section.propety"):
        obj_type = text(sec.select_one(".objectTitle .objectCategory"))
        government = text(sec.select_one(".objectTitle .governmentName"))

        # タイトル & 詳細URL
        title_a = sec.select_one(".propetyTitle a[href]")
        title = text(title_a)
        detail_url = None
        if title_a and title_a.has_attr("href"):
            detail_url = title_a["href"].strip()
            if detail_url.startswith("//"):
                detail_url = "https:" + detail_url

        # 説明
        desc = text(sec.select_one(".containerRight .description"))

        # 画像
        img_src = None
        img = sec.select_one(".imageOuter .imageCenter img")
        if img and img.get("src"):
            img_src = normalize_image_url(img["src"].strip())

        # 詳細情報
        info = {}
        for ul in sec.select(".detailOuter ul"):
            info.update(extract_dtdd_map(ul))

        price_yen = parse_int_from_price(info.get("価格", ""))

        area_m2 = None
        if "建物面積" in info:
            area_m2 = parse_area_m2(info["建物面積"])
        if area_m2 is None and "土地面積" in info:
            area_m2 = parse_area_m2(info["土地面積"])

        age_years = parse_built_years(info.get("築年月", ""))
        address = info.get("所在地")
        structure = info.get("物件種目") or obj_type

        items.append({
            "house_id": None,
            "address": address,
            "area": area_m2,
            "age": age_years,
            "structure": structure,
            "price": price_yen,
            "image_url": img_src,

            # 参考情報
            "_title": title,
            "_pref_government": government,
            "_type": obj_type,
            "_detail_url": detail_url,
            "_description": desc,
        })

    next_link = soup.select_one(
        ".pager a.link_next[data-page], .pagerCount a.link_next[data-page]"
    )
    next_page = (
        int(next_link["data-page"])
        if next_link and next_link.has_attr("data-page")
        else None
    )

    return items, next_page

# ---------------------------------------------------------------------
# クローラ本体
# ---------------------------------------------------------------------

def crawl_pref(pref_code: str, delay: float = 1.0, max_pages: int = 999) -> List[dict]:
    page = 1
    results: List[dict] = []

    for _ in range(max_pages):
        url = f"{BASE}/buy/{pref_code}/"
        params = {
            "br_kbn": "buy",
            "pref_cd": pref_code,
            "page": page,
        }

        r = requests.get(url, params=params, headers=HEADERS, timeout=30)
        r.raise_for_status()

        items, next_page = parse_list_page(r.text)
        if not items:
            break

        results.extend(items)

        if not next_page:
            break

        page = next_page
        time.sleep(delay)

    # house_id を連番で付与
    for i, it in enumerate(results, start=1):
        it["house_id"] = i

    return results

# ---------------------------------------------------------------------
# エントリポイント
# ---------------------------------------------------------------------

def main():
    ap = argparse.ArgumentParser(description="AtHome 空き家バンク スクレイパ")
    ap.add_argument("--pref", required=True, help="都道府県コード（例: 茨城=08）")
    ap.add_argument("--out", default="houses.json", help="出力 JSON パス")
    ap.add_argument("--delay", type=float, default=1.0, help="ページ間スリープ秒")
    args = ap.parse_args()

    data = crawl_pref(args.pref, delay=args.delay)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(data)} records to {args.out}")


if __name__ == "__main__":
    main()
