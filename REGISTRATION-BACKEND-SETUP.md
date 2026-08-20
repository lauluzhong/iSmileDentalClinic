# Registration form backend — setup runbook

What was built: the digital registration form
(`https://ismile-registration-form.vercel.app`, source
`Operations/Patient Registration Form/ismile-registration-form.html`) now POSTs
each submission to `https://ismile.com.my/api/register`
(`Website/api/register.js`, deployed with the main website's Vercel project).
The function appends one row per patient to a **private** Google Sheet and
sends a PII-minimal heads-up ("New patient registration received — [name]")
to the existing booking Telegram chat.

This is patient PII + medical history. The Sheet must never be shared beyond
the clinic, and nothing routes through the Contabo marketing box.

## One-time setup (owner clicks)

### 1. Create the private Google Sheet

1. In the clinic's Google account, create a new Sheet, e.g. **"iSmile Patient Registrations"**.
2. Rename the first tab to `Registrations` (or set `REGISTRATION_SHEET_TAB` to whatever you name it).
3. Paste this as row 1 (optional but recommended — the columns arrive in this order):

   ```
   Submitted (MYT)	Full name	Preferred name	Gender	DOB	Age	IC / Passport	Nationality	Address 1	Address 2	City	State	Postcode	Mobile	Email	Occupation	Source	Referred by	Last dental visit	Last clean	Emergency name	Emergency relationship	Emergency phone	Payer	Payer name	Payer mobile	Payer email	Guardian name	Guardian relationship	Guardian mobile	Guardian email	Under doctor	Condition	Doctor name	Doctor phone	Medicines	Medicines list	Allergies	Allergy detail	Premed	Premed detail	Bleeding	Pregnant	Breastfeeding	Contraceptives	ALERTS	Consent: treatment	Consent: recall	Consent: retention	Declaration	Consent version	Filled for	Signer role	Signer name	Signer relationship	Minor	Full JSON	Signature PNG
   ```

4. Sharing: keep it restricted. Share only with the clinic accounts that need
   it (front desk / Emily) as Viewer or Editor — never "anyone with the link".

### 2. Service account

Use a **new, dedicated** service account — do NOT reuse `edith-gsc-v2`
(that key lives on the Contabo marketing box; reusing it would give that box
access to patient data).

1. Go to [console.cloud.google.com](https://console.cloud.google.com) →
   project `openclaw-search-console-488205` (or a fresh project if you prefer
   a clean separation).
2. **APIs & Services → Enable APIs** → search **Google Sheets API** → Enable.
3. **IAM & Admin → Service Accounts → Create service account** — name it e.g.
   `ismile-registrations`. No project roles needed.
4. Open the new service account → **Keys → Add key → Create new key → JSON**.
   A `.json` key file downloads. Treat it like a password.
5. Back in the Sheet: **Share** it with the service account's email
   (`ismile-registrations@<project>.iam.gserviceaccount.com`) as **Editor**.
   (This share is the entire permission model — the SA can touch only sheets
   explicitly shared with it.)

### 3. Vercel environment variables

In Vercel → the **ismile-website** project (the one serving ismile.com.my) →
Settings → Environment Variables, add (Production):

| Variable | Value |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | the entire contents of the downloaded key file, pasted as one value |
| `REGISTRATION_SHEET_ID` | the long ID from the Sheet's URL (`https://docs.google.com/spreadsheets/d/<THIS>/edit`) |
| `REGISTRATION_SHEET_TAB` | optional — only if the tab is not named `Registrations` |
| `TELEGRAM_REGISTRATION_CHAT_ID` | optional — a different chat for registration pings; otherwise the existing `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` (booking bot) are reused |

Then delete the local copy of the key file (it lives in Vercel now).

### 4. Deploy

1. Deploy the website (`Website/`) as usual — this ships `/api/register`.
2. Redeploy the registration form: the updated
   `Operations/Patient Registration Form/ismile-registration-form.html` must go
   live on `ismile-registration-form.vercel.app` (see that folder's README —
   `npx vercel`, stage `index.html` + `vercel.json`, deploy `--prod`).

## Test procedure

1. Open `https://ismile-registration-form.vercel.app` in a private window.
2. Fill the form with an obviously fake patient (e.g. full name `TEST — DELETE ME`).
3. Submit. The thank-you screen should show **"Sent to the clinic."**
   (If it shows "Could not send just now", check Vercel function logs for
   `/api/register` — env vars and the Sheet share are the usual suspects.)
4. Check the Sheet: one new row, and the ALERTS column populated if you
   declared an allergy.
5. Check the booking Telegram chat: one message, name only, no medical data.
6. Delete the test row.

## Behaviour notes

- If the Sheet append fails, the patient sees "Could not send just now. Your
  answers are saved on this device." with a **Try again** button; the data
  also stays in that browser's localStorage, and the `?staff=1` entry list on
  the same device still works — nothing is lost.
- A Telegram failure never fails a recorded registration (best-effort only).
- The function never logs submission bodies — only error statuses.
- The full payload (minus the signature image) is also stored as JSON in the
  "Full JSON" column, so future form fields are captured even before a new
  column exists.

## Open decisions (owner)

- **Sheet ownership / who sees IC numbers and medical history** — currently
  whoever the Sheet is shared with. Decide the reader list.
- **Retention** — old rows accumulate; decide if/when rows are cleared after
  they're typed into OpenDental.
- **Which Telegram chat** — booking chat by default; set
  `TELEGRAM_REGISTRATION_CHAT_ID` for a separate one.
