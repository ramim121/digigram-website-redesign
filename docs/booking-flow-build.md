# Booking flow — what was built (Phase E + F)

Implements `booking-flow-spec.md`. Offline payment only: placing a booking
reserves units, money moves outside the system, and the investor uploads a
receipt that an admin confirms.

## Backend routes added (nothing existing changed)

| Route | Why it exists |
|---|---|
| `POST /api/v2/web/bookings/create` | The original `bookings/create` has its **NID check commented out** — see the block above the transaction in that file. It enforces contact verification only. The website's rule needs both, so this route adds the missing guard and then **delegates** to the original. |
| `GET /api/v2/web/bookings/{id}` | `bookings/details/{id}` is unauthenticated and takes the id from the URL, so any booking is readable by guessing a sequential integer. This one proves ownership first, then delegates. |

Both **delegate rather than copy**. The booking transaction — id allocation,
`project_investors`, `project_partner_investors`, unit accounting,
notifications — is intricate and must not exist in two versions that can drift.
The guard is duplicated; the valuable part is shared.

The originals are untouched because the shipped app calls them and treats a 401
as a forced logout: tightening them would eject users mid-session rather than
merely breaking a screen.

### A product decision you now own

`bookings/create` will still accept a booking from an investor with **no
verified NID** — that check is commented out, presumably because existing
investors would be blocked. So:

- **website** → NID enforced (via the v2 route)
- **app** → NID not enforced (unchanged)

Uncommenting those four lines makes the app match. That is a product call with a
real migration cost, not a refactor, so it was left alone.

## Website

```
/projects/{slug}/invest          → eligibility gate, then checkout
/api/bookings/create             → v2/web/bookings/create
/account                         → bookings list
/account/bookings/{id}           → status + proof-of-payment form
/api/bookings/proof              → bookings/proof-of-payment-upload/{id}
```

`lib/booking.ts` holds the five payment methods, what each one requires, and the
verbatim "How to Pay" steps. Both the form and the server route read that one
table, so the form cannot ask for one set of fields while the backend requires
another.

| Method | Extra fields |
|---|---|
| BEFTN / NPSB / RTGS | which of *your* accounts you transferred from |
| Cash / Cheque | when and where to collect |

DigiGram's receiving account is read from `digigram_bank_info`, never
hardcoded. Hardcoding it in `SubmitProofOfPayment.tsx` is exactly how the
displayed account and the stored one drifted apart. If it cannot be loaded, the
transfer methods are **hidden** rather than shown with a blank account number.

### Details that were got wrong once and are now pinned

- **`collectionDate` is not ISO.** The backend's Joi rule is a plain string
  pattern, so `YYYY-MM-DDTHH:mm` fails. `toApiDateTime` converts the
  `datetime-local` value to `YYYY-MM-DD HH:mm:ss`.
- **`idUserBanks` is sent as a string.** The schema types it as one; a number
  fails with a "required" message that reads like a missing field.
- **Proof is JPEG/PNG only, 10 MB.** PDFs are rejected by the backend.
- **The partner split is computed server-side.** Units are spread across the
  project's assigned partners, remainder to the earliest, every partner getting
  at least one unit (the backend requires `investedUnit >= 1`). It decides how
  much money is recorded against each Shathi partner, so it is not a number the
  browser gets to send.

### Status mapping, corrected against live data

The site's five states are mapped from `paymentConfirmationStatus`, and two
things were wrong until checked against the real table:

- the backend writes **`uploaded`** when a receipt is submitted — not
  `proof_submitted`, which was the guess;
- **`cancelled` is a separate column**, not a status value. A cancelled booking
  keeps whatever payment status it had, so it must be read independently or a
  cancelled booking renders as "awaiting payment" and invites a second payment.

Live distribution at the time of writing: `confirmed: 51`, `denied: 51`,
`pending: 22`, `uploaded: 3`.

## Verified

Backend guards, against real accounts:

```
unverified user       → 400 CONTACT_UNVERIFIED
contact ok, no NID    → 400 NID_UNVERIFIED
v2 details, no token  → 401
v2 details, not yours → 404   (not 403 — a 403 confirms the booking exists)
```

Website, production build against a local backend:

```
checkout, verified user      renders: units, total, "No money is taken now"
checkout, NID-less user      gate only; "Place booking" absent from the markup
create via proxy, blocked    400 NID_UNVERIFIED
bookings list                renders for an investor with bookings
booking detail, pending      all five methods + upload + the 3-day notice
booking detail, denied       "Payment not accepted", no upload form
booking detail, not yours    404
proof: no method             400 "Choose a payment method."
proof: cash, no collection   400 "Tell us when and where…"
proof: beftn, no bank        400 "Choose the bank account you transferred from."
proof: not signed in         401
```

**Not tested end to end:** a *successful* proof submission. Doing so would
attach a fake receipt to a real investor's live booking. The validation path is
covered above; the upload itself needs a disposable booking on a staging
database.

One test did create a booking row (an empty `projects` array is accepted by the
original route's Joi schema — worth tightening separately). It had no linked
investors and was deleted.

## Still open

- `bookings/cancel` is not wired into the website. The copy says a booking can
  be cancelled before payment, so either wire it or change the copy.
- Nothing shows the *assigned Shathi partners* on the booking page yet; the
  payload carries them and the app displays them as "tentative".
- Retire `bookings/details/{id}` and `investors/invested-projects/{id}` once the
  app ships a build pointing at the v2 routes.
