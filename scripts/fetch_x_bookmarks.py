#!/usr/bin/env python3
"""Fetch X (Twitter) bookmarks not yet processed and print them as JSON.

Needs env X_USER_ACCESS_TOKEN: an OAuth 2.0 user-context token with the
scopes tweet.read users.read bookmark.read (offline.access for refresh).
State lives in x-tips/processed.json (list of tweet ids already judged).
Stdlib only.
"""
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.x.com/2"
STATE = os.path.join(os.path.dirname(__file__), "..", "x-tips", "processed.json")
MAX_ITEMS = int(os.environ.get("X_MAX_ITEMS", "30"))


def call(path, token, params=None):
    url = f"{API}{path}"
    if params:
        url += "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"X API error {e.code} on {path}: {e.read().decode()[:300]}")


def load_state():
    try:
        with open(STATE) as f:
            return set(json.load(f))
    except FileNotFoundError:
        return set()


def main():
    token = os.environ.get("X_USER_ACCESS_TOKEN")
    if not token:
        sys.exit("X_USER_ACCESS_TOKEN is not set (see README.md)")
    done = load_state()
    uid = call("/users/me", token)["data"]["id"]
    items, page = [], None
    while len(items) < MAX_ITEMS:
        params = {
            "max_results": 100,
            "tweet.fields": "created_at,entities,note_tweet,author_id",
            "expansions": "author_id",
            "user.fields": "username",
        }
        if page:
            params["pagination_token"] = page
        res = call(f"/users/{uid}/bookmarks", token, params)
        users = {u["id"]: u["username"] for u in res.get("includes", {}).get("users", [])}
        for t in res.get("data", []):
            if t["id"] in done:
                continue
            text = t.get("note_tweet", {}).get("text") or t["text"]
            urls = [u.get("expanded_url") for u in t.get("entities", {}).get("urls", [])]
            author = users.get(t.get("author_id"), "i")
            items.append({
                "id": t["id"],
                "url": f"https://x.com/{author}/status/{t['id']}",
                "text": text,
                "links": [u for u in urls if u and "x.com/" not in u and "twitter.com/" not in u],
            })
        page = res.get("meta", {}).get("next_token")
        if not page:
            break
    print(json.dumps(items[:MAX_ITEMS], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
