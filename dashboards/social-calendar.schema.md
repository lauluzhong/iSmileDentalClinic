# `social-calendar.json` — schema (v1, 11 Nov 2026)

Read by `/dashboard/marketing` from the **status** branch
(`https://raw.githubusercontent.com/lauluzhong/iSmileDentalClinic/status/social-calendar.json`).
If the file is missing the page falls back to `public/dashboard/social-calendar.sample.json`.
The status branch is gated, NOT private: **no patient names, phone numbers or message text in this file.**
Funnel numbers are counts only.

```jsonc
{
  "generated_myt": "2026-11-11T09:00:00+08:00", // ISO, MYT
  "sample": false,                              // true shows "Sample posts for now"
  "timezone": "Asia/Kuala_Lumpur",
  "posts": [{
    "id": "p-2026-11-14-ig1",        // stable, unique
    "date": "2026-11-14",            // YYYY-MM-DD, MYT
    "time": "20:00",                 // HH:MM 24h, MYT
    "title": "Why your gums bleed",  // short label shown on the chip
    "status": "pending",             // planned | pending | scheduled | posted | rejected
    "channels": ["instagram","facebook"], // any of: instagram facebook linkedin x threads google blog
    "copy": {                        // one entry per channel
      "instagram": {"text": "…"},
      "linkedin":  {"title": "…", "text": "…"} // title optional (blog/google/linkedin)
    },
    "image": "https://… or /path",   // https or site-relative only; null if none
    "n": 112,                         // approval number on the WhatsApp board (marketing.json item n); null while planned
    "live": {"instagram": "https://…"}, // per-channel live URL once posted; {} before
    "reason": "…",                   // optional, why rejected
    "note": "…"                      // optional, small print in the panel
  }],
  "funnel": {
    "as_of": "2026-11-11",            // null → page says "zeros for now"
    "first_reply_median_min": 14,     // all channels, minutes; null if unknown
    "channels": {
      "instagram": {"interactions": 0, "comments": 0, "dms": 0, "leads": 0,
                    "handed": 0, "booked": 0, "first_reply_median_min": null}
      // same keys for facebook linkedin x threads google blog
    }
  }
}
```

Status meaning: planned = drafted, not yet sent to Lau · pending = waiting for Lau on the WhatsApp board ·
scheduled = approved and queued · posted = live (fill `live`) · rejected = Lau said no.
`interactions` = comments + DMs. `handed` = passed to the front desk. `booked` = appointment made.
The page also reads `marketing.json` for the "waiting for you" count (`pending.length`).
