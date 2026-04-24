# GA4 CTA Event Parameters — Custom Dimensions Audit

**Date:** 2026-04-24  
**PR #103 merged:** ✅ (page-level CTA attribution instrumentation)  
**GTM container:** `GTM-NR9PQ2H7`  
**GA4 Measurement ID:** configured via GTM

## Status

The instrumentation code (PR #103) correctly pushes all event parameters to `dataLayer`.  
However, **custom dimensions are NOT yet registered in GA4**, which means:

- Data flows into GA4 via GTM but only appears in **DebugView** (2-day retention) and **BigQuery export** (if enabled)
- Standard GA4 reports (Explorations, pre-built reports) **cannot filter or group** by these dimensions
- The parameters exist in the raw event data but are invisible to report builders

---

## Event Inventory

### Attribution Enrichment (applied to EVERY event)

These 7 parameters are added by `enrichEvent()` in `src/lib/attribution.js` to every `dataLayer.push()` call:

| Parameter | Type | Example value | Description |
|---|---|---|---|
| `current_path` | string | `/contact` | Page where the event fired |
| `landing_page` | string | `/` | Session landing page (first page visited) |
| `source_medium` | string | `direct` / `cpc` / `organic` / `referral` | UTM medium or fallback |
| `utm_source` | string | `google` or `null` | UTM source (only on first session hit) |
| `utm_campaign` | string | `spring_promo` or `null` | UTM campaign |
| `utm_term` | string | `dental+clinic` or `null` | UTM keyword term |
| `utm_content` | string | `hero_banner` or `null` | UTM content variant |

### CTA Location Overlay

| Parameter | Type | Example value | Description |
|---|---|---|---|
| `cta_location` | string | `contact_page_cta` / `faq_page_cta` / `services_landing_cta` / `global_wa_link` / `header-booking` / `footer-whatsapp` | Identifies which CTA element was clicked |

### Event: `whatsapp_click` (global tracker — catches ALL `wa.me` links)

| Parameter | Type | Example value | Description |
|---|---|---|---|
| `whatsapp_page` | string | `/contact` | URL path where click happened |
| `whatsapp_url` | string | `https://wa.me/60163222135?text=...` | Full WhatsApp link URL |
| `whatsapp_cta_text` | string | `Get In Touch With Us` | Visible CTA text (truncated 100 chars) |
| `whatsapp_type` | string | `global_wa_link` / `contact_page_cta` / `faq_page_cta` / `services_landing_cta` | Origin page identifier |

### Event: `booking_modal_open`

| Parameter | Type | Example value | Description |
|---|---|---|---|
| `booking_page` | string | `/` | Page where modal opened |
| `booking_source_button` | string | `hero-cta` / `service-card` / `direct` | Which button triggered the modal |
| `booking_cta_text` | string | `Book Consultation` | Button text |

### Event: `form_start`

| Parameter | Type | Example value | Description |
|---|---|---|---|
| `form_page` | string | `/` | Page where form is displayed |
| `form_field` | string | `name` / `email` / `contact` | First field the user interacted with |

### Event: `whatsapp_submit_click`

| Parameter | Type | Example value | Description |
|---|---|---|---|
| `whatsapp_page` | string | `/` | Page where form submitted |
| `whatsapp_cta_text` | string | `Consultation` | Source button text |
| `form_name` | string | `John Doe` | User-entered name |
| `form_has_experience` | boolean | `true` | Whether user filled experience field |
| `for_self` | boolean | `true` | Booking for self |
| `for_child` | boolean | `false` | Booking for child |
| `child_age` | string or null | `5` | Child's age (null if not for child) |
| `for_other` | boolean | `false` | Booking for other adult |

---

## GTM Configuration Required

The GA4 Event tag in GTM (`GTM-NR9PQ2H7`) needs to explicitly pass these custom parameters to GA4.

### Step 1 — Create dataLayer Variables

In GTM, create a Variable for each parameter above.  
Type: **Data Layer Variable**

| Variable Name | Data Layer Variable Name |
|---|---|
| `DLV - current_path` | `current_path` |
| `DLV - landing_page` | `landing_page` |
| `DLV - source_medium` | `source_medium` |
| `DLV - utm_source` | `utm_source` |
| `DLV - utm_campaign` | `utm_campaign` |
| `DLV - utm_term` | `utm_term` |
| `DLV - utm_content` | `utm_content` |
| `DLV - cta_location` | `cta_location` |
| `DLV - whatsapp_page` | `whatsapp_page` |
| `DLV - whatsapp_url` | `whatsapp_url` |
| `DLV - whatsapp_cta_text` | `whatsapp_cta_text` |
| `DLV - whatsapp_type` | `whatsapp_type` |
| `DLV - booking_page` | `booking_page` |
| `DLV - booking_source_button` | `booking_source_button` |
| `DLV - booking_cta_text` | `booking_cta_text` |
| `DLV - form_page` | `form_page` |
| `DLV - form_field` | `form_field` |
| `DLV - form_name` | `form_name` |
| `DLV - form_has_experience` | `form_has_experience` |
| `DLV - for_self` | `for_self` |
| `DLV - for_child` | `for_child` |
| `DLV - child_age` | `child_age` |
| `DLV - for_other` | `for_other` |

### Step 2 — Update GA4 Event Tags

For each GA4 Event tag in GTM:

1. Open the tag
2. Under **Event Parameters**, add each parameter as a row
   - Key = parameter name (e.g. `current_path`)
   - Value = corresponding variable (e.g. `{{DLV - current_path}}`)

**Shortcut:** Use a single GA4 tag with **All Pages** trigger and **Send a custom event** set to `{{DLV - event}}`, with all parameters mapped. This catches every CTA event in one tag.

### Step 3 — Verify in GTM Preview

1. Preview the container
2. Navigate to the site and trigger a CTA event
3. Check that the GA4 event tag fires with all parameters populated
4. Verify in GA4 DebugView that the parameters appear

---

## GA4 Custom Dimensions Registration

Each event parameter must be registered as an event-scoped custom dimension in GA4.

### Navigation

GA4 Admin → **Custom Definitions** → **Custom Dimensions** → **Create custom dimension**

### Required Custom Dimensions

| Dimension Name | Scope | Event Parameter | Description |
|---|---|---|---|
| CTA Event | Event | `event` | Event name (may already exist) |
| Current Path | Event | `current_path` | Page path where event fired |
| Landing Page | Event | `landing_page` | Session landing page |
| Source / Medium | Event | `source_medium` | Traffic source (UTM medium or direct) |
| UTM Source | Event | `utm_source` | Campaign source |
| UTM Campaign | Event | `utm_campaign` | Campaign name |
| UTM Term | Event | `utm_term` | Campaign keyword |
| UTM Content | Event | `utm_content` | Campaign content variant |
| CTA Location | Event | `cta_location` | Which site element was clicked |
| WhatsApp Page | Event | `whatsapp_page` | Page where WhatsApp click happened |
| WhatsApp URL | Event | `whatsapp_url` | Target WhatsApp URL |
| WhatsApp CTA Text | Event | `whatsapp_cta_text` | Button text |
| WhatsApp Type | Event | `whatsapp_type` | CTA origin page identifier |
| Booking Page | Event | `booking_page` | Page where booking modal opened |
| Booking Source Button | Event | `booking_source_button` | Trigger button for booking modal |
| Booking CTA Text | Event | `booking_cta_text` | Booking CTA button text |
| Form Page | Event | `form_page` | Page where booking form is |
| Form Field | Event | `form_field` | First interacted form field |

### Optional Custom Metrics (for aggregation)

| Metric Name | Scope | Event Parameter | Type |
|---|---|---|---|
| Form Has Experience | Event | `form_has_experience` | Boolean (integer 0/1) |
| For Self | Event | `for_self` | Boolean (integer 0/1) |
| For Child | Event | `for_child` | Boolean (integer 0/1) |
| For Other | Event | `for_other` | Boolean (integer 0/1) |

---

## Verification Checklist

- [ ] GTM Data Layer Variables created for all parameters
- [ ] GA4 Event tag passes all parameters to GA4
- [ ] GTM Preview shows parameters populated correctly
- [ ] GA4 DebugView shows parameters in real-time
- [ ] Custom dimensions registered in GA4 Admin
- [ ] Reports and Explorations can filter/group by dimensions
- [ ] Boolean metrics registered as custom metrics (if needed for aggregation)

---

## Expected Report Capabilities (after config)

Once configured, GA4 Explorations can answer:

- **WhatsApp click volume by CTA location** — `cta_location` dimension + `whatsapp_click` event
- **Booking modal opens by landing page** — `landing_page` + `booking_modal_open` event
- **Conversion rate by UTM campaign** — `utm_campaign` + `whatsapp_submit_click`
- **Form start rate by CTA source** — `booking_source_button` + `form_start` event
- **Child booking ratio** — `for_child` dimension on `whatsapp_submit_click`
