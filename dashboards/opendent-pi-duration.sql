-- ============================================================================
-- iSmile · OpenDent extract for the margin dashboard
-- P&I (production) + ACTUAL appointment duration, by completed procedure.
--
-- Purpose: replace the dashboard's ~40% duration coverage (name-matched from
-- the Appointments export) with a clean PatNum/AptNum join → ~100% coverage,
-- so the chair-time BURN is prorated on real durations for every visit.
--
-- SAFETY (per the 2026-06-16 lock incident — never repeat it):
--   * 100% SET-BASED. No correlated / per-row subqueries. Joins only.
--   * Read-only SELECTs. Run off-peak. Date-bounded (indexes on ProcDate).
--   * In OpenDent, appointment duration = LENGTH(appointment.Pattern) * 5 min
--     (Pattern is a string where each char = a 5-minute slot).
--   * ProcStatus 2 = Complete (matches what the P&I report counts as production).
--   * AptStatus 2 = Complete.
-- ============================================================================


-- QUERY 1 — production lines with their appointment duration --------------------
-- One row per completed procedure. ApptMinutes repeats for procedures that share
-- an appointment, so DO NOT sum ApptMinutes here for burn — use Query 2 for that.
SELECT
    pl.ProcDate                              AS `Date`,
    CONCAT(pt.LName, ', ', pt.FName)         AS Patient,
    pc.Descript                              AS `Procedure`,
    prov.Abbr                                AS Prov,
    pl.ProcFee                               AS Production,
    pl.AptNum,
    LENGTH(ap.Pattern) * 5                   AS ApptMinutes
FROM procedurelog pl
    INNER JOIN patient        pt   ON pt.PatNum   = pl.PatNum
    INNER JOIN procedurecode  pc   ON pc.CodeNum  = pl.CodeNum
    LEFT  JOIN provider       prov ON prov.ProvNum = pl.ProvNum
    LEFT  JOIN appointment    ap   ON ap.AptNum   = pl.AptNum
WHERE pl.ProcStatus = 2                       -- Complete
  AND pl.ProcDate >= '2025-12-01'
  AND pl.ProcDate <  '2026-06-01'
ORDER BY pl.ProcDate, Patient;


-- QUERY 2 — chair-time per appointment (de-duplicated) for BURN allocation ------
-- One row per completed appointment = the chair-time block. Burn = Minutes/60 ×
-- hourly rate (RM160 loaded incl. dep / RM119 cash ex-dep). Join back to Query 1
-- on AptNum and allocate each appointment's burn ONCE (e.g. to its largest line).
SELECT
    ap.AptNum,
    ap.PatNum,
    DATE(ap.AptDateTime)                     AS `Date`,
    prov.Abbr                                AS Prov,
    LENGTH(ap.Pattern) * 5                   AS Minutes
FROM appointment ap
    LEFT JOIN provider prov ON prov.ProvNum = ap.ProvNum
WHERE ap.AptStatus = 2                        -- Complete
  AND ap.AptDateTime >= '2025-12-01'
  AND ap.AptDateTime <  '2026-06-01'
ORDER BY ap.AptDateTime;


-- QUERY 3 (optional) — collection per patient-day, for true collection-based --
-- locum instead of the production proxy. Set-based aggregate; safe.
SELECT
    ps.DatePay                               AS `Date`,
    ps.PatNum,
    SUM(ps.SplitAmt)                         AS Collection
FROM paysplit ps
WHERE ps.DatePay >= '2025-12-01'
  AND ps.DatePay <  '2026-06-01'
GROUP BY ps.DatePay, ps.PatNum;

-- After export: feed Query 1+2 into build_margin_data.py (swap the Appointments
-- name-match for the AptNum join). Lab cost still needs the per-case lab invoices
-- (the EIV/AutoCount digitisation project) — until then it stays a % estimate.
