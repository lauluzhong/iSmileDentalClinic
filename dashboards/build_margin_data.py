"""⚠️ DEPRECATED (2026-08-12) — superseded by the Contabo builder.

The margin dashboard is now fed by margin.json on the repo's `status` branch,
rebuilt daily by /home/ismile/.openclaw/loop/build_margin.py on the Contabo VPS
from the daily OpenDental TSV extracts (e1–e4). This script is kept only for
reference; known defects fixed in the replacement:
  a. wrote to public/dashboards/ (plural) while the page loads from
     public/dashboard/ (singular) — output never landed (path fixed below)
  b. keyword-guessed categories from description text (now ProcCatDefNum)
  c. used booked Pattern length for all chair time (now RealChairMinutes-first)
  d. production-proxy locum (now collection-based from e3 Bucket=earned)
  e. keyed providers on name strings — "Mah (Bro)" collided into "Mah",
     AmyG/Tee dropped (now ProvNum integer)
  f. no IsNonPatientRecord exclusion
  g. no discount handling (e4 NegativeAmt is the single discount truth)

Build REAL margin-dashboard data from OpenDent query exports.

Now driven by the three OpenDent extracts (set-based, safe) the owner ran:
  QUERY 1 — production lines (Date, Patient, Procedure, Prov, Production, AptNum, ApptMinutes)
  QUERY 2 — chair-time per appointment, de-duplicated (AptNum, PatNum, Date, Prov, Minutes)
  QUERY 3 — collection per patient-day (Date, PatNum, Collection)   [optional]

Granularity: a VISIT = one appointment (AptNum). Production lines are grouped by
AptNum (one appointment → several procedure lines). Chair-time / BURN is taken
ONCE per appointment from Query 2 (so it is never multi-counted across the lines
of a visit). This is why the ledger is visit-level: burn lives at the visit.

Output: margin-data.js  →  window.MARGIN_DATA used by margin-dashboard.html
"""
import csv, os, sys, json, re, datetime
from collections import defaultdict
import warnings; warnings.filterwarnings("ignore")

SRC = "/Users/lauluzhong/Documents/iSmile/Financials/01_Source Data"
Q1 = f"{SRC}/QUERY 1 — production lines with their appointment duration.xls"
Q2 = f"{SRC}/QUERY 2 — chair-time per appointment (de-duplicated) for BURN allocation.xls"
Q3 = f"{SRC}/QUERY 3 (optional) — collection per patient-day, for true collection-based.xls"
sys.path.append("/Users/lauluzhong/Documents/iSmile/Financials/03_Locum Calculation")
from locum_calculator import tier_for, VOLUME_THRESHOLD, VOLUME_PCT, TEN_PCT_RATE, TEN_PCT_EXEMPT

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "dashboard", "margin-data.js")  # was "dashboards" (plural) — never landed
BURN_LOADED, BURN_EXDEP = 160.0, 119.0      # RM per chair-hour (incl/excl dep)

PROV = {"Jean":"Ong","Azeli":"Azelia","Pris":"Priscilla","Ling":"Ling",
        "Mah":"Mah","Amy":"Amy","Yeoh":"Yeoh","Joan":"Joan"}

def categorise(desc):
    d = desc.lower()
    has = lambda *ks: any(k in d for k in ks)
    if has("clean","prophylax","scaling","periodont","gingiv"): return "Cleaning"
    if has("whiten","bleach"): return "Cosmetic"
    if has("ortho","invisalign","aligner","damon","bracket","retainer","appliance","myo"): return "Ortho"
    if has("implant","abutment"): return "Implant"
    if has("veneer"): return "Cosmetic"
    if has("crown","bridge","ceramic","emax","inlay","onlay","prosthodontic, by report","post "): return "Crown"
    if has("endo","root canal","pulp","rct","retreat"): return "Endo"
    if has("extract","surg","impacted","alveol","frenect","biopsy"): return "Surgery"
    if has("denture","prosth"): return "Prosth"
    if has("fill","restor","composite","amalgam","sealant"): return "Filling"
    if has("evaluation","exam","consult","assessment"): return "Exam"
    if has("radiograph","x-ray","xray","pano","ceph","cbct","image","bitewing"): return "Xray"
    return "Other"

# Lab/material as % OF PRODUCTION by category (real per-case lab not digitised).
LAB_PCT = {"Crown":0.21,"Implant":0.13,"Ortho":0.15,"Prosth":0.14,"Cosmetic":0.10,
           "Endo":0.0,"Filling":0.05,"Surgery":0.0,"Cleaning":0.0,"Exam":0.0,
           "Xray":0.0,"Other":0.0}
DUR_DEF = {"Cleaning":30,"Exam":30,"Xray":30,"Filling":40,"Crown":60,"Endo":70,
           "Implant":90,"Ortho":30,"Surgery":45,"Prosth":60,"Cosmetic":60,"Other":40}

def rows(path):
    return csv.DictReader([l for l in open(path, encoding="utf-8", errors="replace")
                           if l.strip()], delimiter="\t")

def parse_dmy(s):
    try:
        d, m, y = [int(x) for x in s.strip().split("/")]; return datetime.date(y, m, d)
    except Exception:
        return None

def fnum(s):
    try: return float((s or "0").replace(",", ""))
    except ValueError: return 0.0

# ---- Query 2: authoritative chair-time per appointment ----
apt_min, apt_prov = {}, {}
for r in rows(Q2):
    apt = (r.get("AptNum") or "").strip()
    if apt:
        apt_min[apt] = fnum(r.get("Minutes"))
        apt_prov[apt] = (r.get("Prov") or "").strip()

# ---- Query 1: production lines grouped into visits (by AptNum) ----
visits = {}
no_apt = 0
for r in rows(Q1):
    prov = (r.get("Prov") or "").strip()
    if prov not in PROV:
        continue
    d = parse_dmy(r.get("Date"))
    if not d:
        continue
    apt = (r.get("AptNum") or "").strip()
    prod = fnum(r.get("Production"))
    # key: real appointment if present, else a per-patient-day pseudo-visit
    if apt and apt != "0":
        key = ("apt", apt)
    else:
        key = ("pd", (r.get("Patient") or "").strip(), d, prov); no_apt += 1
    v = visits.setdefault(key, dict(date=d, patient=(r.get("Patient") or "").strip(),
                                    prov=prov, production=0.0, nlines=0,
                                    desc="", topprod=-1, apt=apt))
    v["production"] += prod
    v["nlines"] += 1
    if prod > v["topprod"]:
        v["topprod"] = prod; v["desc"] = (r.get("Procedure") or "").strip()
    # for 0-production visits keep first description as primary
    if v["desc"] == "":
        v["desc"] = (r.get("Procedure") or "").strip()

# monthly production per doctor (for the volume rule)
mprod = defaultdict(float)
for v in visits.values():
    mprod[(v["prov"], v["date"].month)] += v["production"]
def eff_tier(prov, month):
    base = tier_for(PROV[prov])
    return VOLUME_PCT if (mprod[(prov, month)] >= VOLUME_THRESHOLD and base < VOLUME_PCT) else base

# ---- assemble visit records ----
out, matched = [], 0
for k, v in visits.items():
    cat = categorise(v["desc"])
    if k[0] == "apt" and v["apt"] in apt_min:
        dur = apt_min[v["apt"]]; is_match = True; matched += 1
    else:
        dur = DUR_DEF.get(cat, 40); is_match = False
    dur = max(10, dur)
    lab = round(v["production"] * LAB_PCT.get(cat, 0.0))
    et = eff_tier(v["prov"], v["date"].month)
    ten = 0 if PROV[v["prov"]] in TEN_PCT_EXEMPT or cat == "Ortho" else v["production"] * TEN_PCT_RATE
    locum = max(0.0, (v["production"] - ten - lab)) * et
    out.append(dict(date=v["date"].isoformat(), patient=v["patient"],
                    doctor="Dr " + PROV[v["prov"]], cat=cat, proc=v["desc"][:48],
                    nlines=v["nlines"], production=round(v["production"]),
                    lab=lab, dur=round(dur), locum=round(locum), matched=is_match))

out.sort(key=lambda x: x["date"])
# Query 3 total collection (validation only)
total_coll = sum(fnum(r.get("Collection")) for r in rows(Q3))
period = (out[0]["date"], out[-1]["date"])
meta = dict(
    period=[period[0], period[1]],
    source="OpenDent QUERY 1+2 (production + real appointment duration); QUERY 3 collection",
    burnLoaded=BURN_LOADED, burnExDep=BURN_EXDEP,
    durCoverage=round(matched / len(out) * 100, 1),
    visits=len(out),
    totalProduction=round(sum(v["production"] for v in out)),
    totalCollection=round(total_coll),
    labBasis="Lab/material = %-of-production estimate per category; real per-case lab pending digitisation (EIV/AutoCount).",
    locumBasis="Per-visit locum is a production-based proxy; authoritative locum is the monthly collection-based calculator.")

with open(OUT, "w") as f:
    f.write("/* AUTO-GENERATED by build_margin_data.py from OpenDent query exports. */\n")
    f.write("window.MARGIN_DATA = " + json.dumps(dict(meta=meta, visits=out)) + ";\n")

print(f"Wrote {OUT}")
print(f"Visits: {len(out)} | REAL-duration coverage: {meta['durCoverage']}% | "
      f"lines w/o AptNum: {no_apt} | {period[0]}..{period[1]}")
print(f"Total production RM{meta['totalProduction']:,} | total collection RM{meta['totalCollection']:,}")
by = defaultdict(float); ch = defaultdict(float)
for v in out:
    by[v["doctor"]] += v["production"]; ch[v["doctor"]] += v["dur"]
for d in sorted(by, key=lambda k: -by[k]):
    print(f"  {d:14} RM{by[d]:>11,.0f}   {ch[d]/60:>6.0f} chair-h")
print(f"  TOTAL chair-hours: {sum(ch.values())/60:,.0f} over the period "
      f"(~{sum(ch.values())/60/6:,.0f}/mo)")
