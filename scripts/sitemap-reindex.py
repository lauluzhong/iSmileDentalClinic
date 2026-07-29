#!/usr/bin/env python3
"""
sitemap-reindex.py — Submit re-index requests to Google Indexing API

Usage:
    python3 sitemap-reindex.py [--dry-run]

Requires:
    - Google service account with Indexing API enabled
    - Service account must be Search Console property owner (not just user)
    - Indexing API enabled in Google Cloud project

Sites list:
    https://ismile.com.my/ — siteFullUser level

Prerequisites:
    gcloud services enable indexing.googleapis.com
    Then add service account as owner in Search Console settings.
"""

import json
import sys
import time
import urllib.request
import urllib.error
import urllib.parse
import re
import base64
from datetime import datetime, timezone
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding

SERVICE_ACCOUNT_FILE = "/home/ismile/.openclaw/skills/ga4-analytics/edith-gsc-v2.json"
SITEMAP_URL = "https://ismile.com.my/sitemap.xml"


def load_urls():
    """Every URL in the live sitemap — no hardcoded list to drift out of date.

    Pass URLs on the command line to override (e.g. only the non-indexed ones).
    """
    args = [a for a in sys.argv[1:] if a.startswith("http")]
    if args:
        return args
    with urllib.request.urlopen(SITEMAP_URL, timeout=20) as resp:
        xml = resp.read().decode()
    return re.findall(r"<loc>([^<]+)</loc>", xml)


def submit_sitemap(sa):
    """Resubmit the sitemap. Works at siteFullUser — unlike the Indexing API,
    which needs owner. This is the recrawl trigger we actually have."""
    print("\n=== Sitemap resubmit ===")
    token = get_token(sa, ["https://www.googleapis.com/auth/webmasters"])
    endpoint = (
        "https://searchconsole.googleapis.com/webmasters/v3/sites/"
        + urllib.parse.quote("https://ismile.com.my/", safe="")
        + "/sitemaps/"
        + urllib.parse.quote(SITEMAP_URL, safe="")
    )
    req = urllib.request.Request(endpoint, method="PUT", headers={"Authorization": f"Bearer {token}"})
    try:
        urllib.request.urlopen(req)
        print(f"  ✅ {SITEMAP_URL} resubmitted")
        return {"status": "ok"}
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:300]
        print(f"  ❌ HTTP {e.code}: {body}")
        return {"status": f"error_{e.code}", "error": body}

def make_jwt(sa, scopes):
    """Create a signed JWT assertion for Google OAuth2."""
    iat = int(time.time())
    exp = iat + 3600

    header = {"alg": "RS256", "typ": "JWT"}
    payload = {
        "iss": sa["client_email"],
        "scope": " ".join(scopes),
        "aud": "https://oauth2.googleapis.com/token",
        "iat": iat,
        "exp": exp,
    }

    def b64url(data):
        return base64.urlsafe_b64encode(data).rstrip(b"=").decode()

    h = b64url(json.dumps(header, separators=(",", ":")).encode())
    p = b64url(json.dumps(payload, separators=(",", ":")).encode())
    signing_input = f"{h}.{p}".encode()

    key = serialization.load_pem_private_key(sa["private_key"].encode(), password=None)
    sig = b64url(key.sign(signing_input, padding.PKCS1v15(), hashes.SHA256()))
    return f"{signing_input.decode()}.{sig}"

def get_token(sa, scopes):
    """Exchange JWT assertion for OAuth2 access token."""
    assertion = make_jwt(sa, scopes)
    data = f"grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion={assertion}".encode()
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())["access_token"]

def try_indexing_api(sa, urls):
    """Attempt Indexing API URL_UPDATED notifications."""
    print("\n=== Indexing API ===")
    token = get_token(sa, ["https://www.googleapis.com/auth/indexing"])
    results = []
    for url in urls:
        body = json.dumps({"url": url, "type": "URL_UPDATED"}).encode()
        req = urllib.request.Request(
            "https://indexing.googleapis.com/v3/urlNotifications:publish",
            data=body,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
        )
        try:
            with urllib.request.urlopen(req) as resp:
                r = json.loads(resp.read())
                print(f"  ✅ {url[:60]}... → {r.get('urlNotificationMetadata', {}).get('latestUpdate', {}).get('notifyTime', 'OK')}")
                results.append({"url": url, "status": "success", "result": r})
        except urllib.error.HTTPError as e:
            err_text = e.read().decode()
            print(f"  ❌ {url[:60]}... → HTTP {e.code}: {err_text[:100]}")
            results.append({"url": url, "status": f"error_{e.code}", "error": err_text[:500]})
        time.sleep(0.5)
    return results

def try_search_console_inspect(sa, urls):
    """Attempt Search Console URL inspection (alternative)."""
    print("\n=== Search Console URL Inspection ===")
    token = get_token(sa, ["https://www.googleapis.com/auth/webmasters"])
    results = []
    for url in urls:
        body = json.dumps({"inspectionUrl": url, "siteUrl": "https://ismile.com.my/"}).encode()
        req = urllib.request.Request(
            "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
            data=body,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {token}"},
        )
        try:
            with urllib.request.urlopen(req) as resp:
                r = json.loads(resp.read())
                s = r.get("inspectionResult", {}).get("indexStatusResult", {})
                print(f"  📋 {url[:60]}... → coverage={s.get('coverageState')}, verdict={s.get('verdict')}")
                results.append({"url": url, "status": "ok", "coverageState": s.get("coverageState"), "verdict": s.get("verdict")})
        except urllib.error.HTTPError as e:
            err_text = e.read().decode()
            print(f"  ❌ {url[:60]}... → HTTP {e.code}: {err_text[:100]}")
            results.append({"url": url, "status": f"error_{e.code}", "error": err_text[:500]})
        time.sleep(0.5)
    return results

def main():
    dry_run = "--dry-run" in sys.argv
    URLS = load_urls()
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    if dry_run:
        print("🔍 DRY RUN — no API calls will be made\n")

    print(f"📅 Re-index request — {ts}")
    print(f"🔧 Service account: edith-gsc-v2@openclaw-search-console-488205.iam.gserviceaccount.com")
    print(f"🌐 Site: https://ismile.com.my/")
    print(f"📄 URLs ({len(URLS)}):")
    for u in URLS:
        print(f"   {u}")
    print()

    # Verify URLs are live first
    print("=== URL Health Check ===")
    healthy = []
    for url in URLS:
        try:
            req = urllib.request.Request(url, method="HEAD")
            with urllib.request.urlopen(req, timeout=10) as resp:
                print(f"  ✅ {url[:60]}... → HTTP {resp.status}")
                healthy.append(url)
        except Exception as e:
            print(f"  ⚠️  {url[:60]}... → {e}")
    print(f"\n✅ {len(healthy)}/{len(URLS)} URLs reachable")

    if dry_run:
        print("\n🔍 DRY RUN complete — no API calls made")
        report = {"timestamp": ts, "urls": URLS, "dry_run": True, "skip_reason": "Indexing API requires service account to be Search Console property owner (current: siteFullUser)"}
    else:
        # Attempt Indexing API
        sitemap_result = submit_sitemap(sa)
        # Attempt Indexing API
        indexing_results = try_indexing_api(sa, URLS) if not dry_run else []
        # Attempt Search Console inspection
        sc_results = try_search_console_inspect(sa, URLS) if not dry_run else []

        report = {
            "timestamp": ts,
            "urls": URLS,
            "sitemap_submit": sitemap_result,
            "indexing_api": indexing_results,
            "search_console_inspect": sc_results,
            "note": "Indexing API requires service account to be Search Console property owner level. "
                    "Current permission: siteFullUser. Owner-level access needed in Search Console settings."
        }

    # Save report
    output = json.dumps(report, indent=2)
    filename = f"reindex-report-{datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')}.json"
    with open(filename, "w") as f:
        f.write(output)
    print(f"\n📝 Report saved to {filename}")

    return report

if __name__ == "__main__":
    with open(SERVICE_ACCOUNT_FILE) as f:
        sa = json.load(f)
    main()
