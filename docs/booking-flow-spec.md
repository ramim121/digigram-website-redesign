# Booking flow — specification

Source of truth for Phase E (the website booking flow). Everything here is taken
from two places, not from the design brief:

1. The ten app screenshots in
   `Website Resources/Shathi App Content/Shathi App images/Booking-Process/`
2. The live API's own Joi schemas and the mobile app's calling code

Where the app hardcodes something, that is called out — those values need a home
on the web side and a decision about whether they should move to the API.

---

## The flow, screen by screen

| # | Screen | What it does |
|---|---|---|
| 1 | Project Details | Unit stepper, Total Payable, Expected Return range. CTA **Invest In This Project** |
| 2 | Checkout | Line items, units stepper, Affiliated Shathis, T&C consent, **Proceed To Payment** |
| 3 | Booking Placed (dialog) | "Kindly complete your payment & submit proof within next 3 days." → **Go To Order Details** |
| 4 | Order Details | Order ID, date, totals. **Submit proof of payment** / Pay Later / Cancel Booking |
| 5 | Proof Of Payment | Payment method, DigiGram bank details, How to Pay, your bank account, file upload |
| 6 | Success (dialog) | "Your proof of payment uploaded successfully" → Go Home |
| 7 | My Investment | Pending Proof Submission count, Completed, Running Project |
| 8 | Pending Invoice | Booking ID/date, totals, **Upload Proof of Payment** |

**No payment is ever taken online.** The site places a booking, then instructs
the investor to pay offline and upload evidence. Money moves entirely outside
the product.

### Screen 2 — Checkout

Shows per project: thumbnail, name, `X BDT / Unit`, unit stepper with
`(N left)`, Payable, and `Expected` as a range.

**Affiliated Shathis** — partner cards with a `x1` unit badge, name over the
photo, location, livelihood, and a truncated bio. A wheelchair glyph marks
`disability === 'yes'`. Below them, verbatim:

> Tentative Shathi(s) have been assigned to your project. Your Shathi will be
> assigned after your payment is complete based on availability.

That disclaimer is load-bearing — partner assignment is provisional until
payment clears — and must appear on the web checkout too.

Then **Add More Projects**, a totals block (Total Investment, Expected Return),
a **required** terms-and-conditions consent control, and **Proceed To Payment**.

### Screen 4 — Order Details

Order ID is zero-padded to six digits (`000158`). Totals block shows Investment
Amount, Total Return, and **Total Earning** (return minus investment, as a
range). Three actions: Submit proof of payment, Pay Later, Cancel Booking.

---

## Payment methods

Exactly five, from `saathi-mobile-app/src/screens/Order/SubmitProofOfPayment.tsx`:

| Label shown to the user | API value |
|---|---|
| Payment Via Fund Transfer - BEFTN | `beftn` |
| Payment Via Fund Transfer - NPSB | `npsb` |
| Payment Via Fund Transfer - RTGS | `rtgs` |
| Payment Via Cash Deposit | `cash` |
| Payment Via Cheque Collection | `cheque` |

### Conditional fields

Enforced server-side by the Joi schema in
`bookings/proof-of-payment-upload/[id].ts` — the web form must match it exactly
or submissions will be rejected:

| Method | Requires |
|---|---|
| `beftn`, `npsb`, `rtgs` | `idUserBanks` — the investor's own bank account, selected from their saved list |
| `cash`, `cheque` | `collectionDate` **formatted `YYYY-MM-DD HH:mm:ss`** and `collectionLocation` |

`proofOfPayment` (the file) is always required. Server accepts **only**
`image/jpeg` and `image/png`, max **10 MB**. A PDF receipt is rejected — worth
saying so in the web upload control, since desktop users are far more likely to
have a PDF bank statement than app users are.

### "How to Pay" copy

Rendered in a collapsible panel, numbered. Reproduce verbatim.

**BEFTN / NPSB / RTGS** — identical apart from the protocol name in step 1:

1. Choose the {BEFTN|NPSB|RTGS} transfer option in your banking platform.
2. Add the Digigram Ventures Limited. as a beneficiary using the bank details above.
3. Complete the transfer and save the confirmation receipt.
4. Upload the confirmation/screenshot in the app under the Submit Proof of Payment.
5. Digigram Ventures Limited will confirm the payment upon receipt of funds.

**Cash Deposit:**

1. Visit the designated bank branch or cash deposit point provided in the app.
2. Deposit the amount directly into the Digigram Ventures Limited account. Mention your contact number on the deposit slip.
3. Take a clear photo or scan of the deposit slip as proof of payment.
4. Upload the proof of payment (photo or scanned copy) in the app under the Submit Proof of Payment, including the bank name, date, and time of transfer.
5. A confirmation receipt will be issued after the payment is verified.

**Cheque Collection:**

1. Choose your preferred date, time, and location for cheque collection via the app.
2. Issue an account payee cheque in favor of 'Digigram Ventures Limited'.
3. Mention your contact number on the back of the cheque.
4. The cheque will be collected and deposited into the Digigram Ventures Limited bank account within the next working day.
5. A payment confirmation receipt will be sent once the fund is cleared.
6. Note: Ensure the cheque is correctly filled out with accurate details (Name, Amount, Signature, Seal) to avoid processing delays.

> **Copy fix needed for web.** Every one of these says "in the app". On the
> website that is wrong. Reword to "on this page" / "here" — but keep the
> Bangla and English wording in step with each other, and do not change the
> substance of the instruction.

### DigiGram's bank details — ⚠️ two sources, and they disagree

There **is** an endpoint: `GET /api/digigram_bank_info` (table `digigram_banks`,
returns an array). The mobile app does not use it — it hardcodes the values in
`SubmitProofOfPayment.tsx` (~lines 670 and 709). The two do not match:

| Field | `/api/digigram_bank_info` (test DB, probed) | Hardcoded in the app (screenshot 6) |
|---|---|---|
| Bank Name | United Commercial Bank Ltd. | Mutual Trust Bank Plc. |
| Branch Name | Corporate Branch | Dhanmondi Branch (Dhanmondi 15) |
| Account Name | **SAATHI LTD** | **DIGIGRAM VENTURES LTD.** |
| Account Number | 0124563214789 | 1301000365084 |
| Routing Number | 2456398 | 145261188 |

The API row was last updated 2024-07-10 and looks like abandoned seed data; the
hardcoded pair is what investors actually see and pay into today. **This must be
resolved before the web booking flow ships** — publishing the wrong account
number sends investors' money to the wrong place.

- **Ask the client which is correct**, then make the API the single source and
  fix the app to read from it.
- Until that is confirmed, the web build reads
  `/api/digigram_bank_info` but the values are treated as unverified.
- I have only probed the **test** API. Production may already hold the correct
  row — that needs checking before drawing any conclusion.

Each row has a copy-to-clipboard control; the web equivalent needs the same,
since retyping an account number is exactly where investors make mistakes.

---

## Bank accounts (the investor's own)

| Action | Endpoint |
|---|---|
| List banks | `GET /api/banks/get_all_banks` |
| List branches for a bank | `GET /api/banks/{idBanks}` |
| List my accounts | `GET /api/banks/user-bank` (token-scoped) |
| Add an account | `POST /api/banks/user-bank` |
| Update an account | `PUT /api/banks/user-bank` |

Create/update payload — all fields required:

```
idBanks           number
idBankBranches    number
accountNumber     string
accountHolderName string
default           'yes' | 'no'     // string, not boolean
```

`default: 'yes'` clears the flag on the user's other accounts server-side.
Duplicate account numbers for the same user are rejected with
"Account number already exist".

The add-account form is a modal (screenshot 5.2): Name of the Bank (select,
placeholder `Ex. DBL`), branch, account holder name, account number
(placeholder `Ex. 0298545884`), an **Add this account as default** checkbox, and
Save. Success confirmation reads "Banking Info Updated Successfully".

On the Proof Of Payment screen the saved accounts render as selectable cards
showing bank name, branch, holder name and `Account No: …`, with the default
pre-selected. When the list is empty: "No account added yet." plus **Add an
account**.

---

## Endpoints used by the flow

| Step | Endpoint | Notes |
|---|---|---|
| Place booking | `POST /api/bookings/create` | Auth required |
| Booking detail | `GET /api/bookings/details/{id}` | **Unauthenticated — see caveat** |
| Cancel | `POST /api/bookings/cancel` | |
| Upload proof | `POST /api/bookings/proof-of-payment-upload/{id}` | multipart |

### `POST /api/bookings/create`

```
investmentDate  date, required
projects[]      required
  idProjects        number, required
  unitPurchased     number, required
  projectPartners[] required
    idProjectPartners number, required
    amountInvested    number, required, min 0
    investedUnit      number, required, min 1
  deliveryLocation, preferredColor, preferredProductPrice, additionalRequest — optional
```

The optional fields are Shathi Mart (product) concerns and stay unset for
project investments.

Note that the **client** computes the partner split. The website must derive
`projectPartners` the same way the app does, or the same booking will look
different depending on where it was placed.

### Caveat — `bookings/details/{id}` is unauthenticated

It takes the booking id from the URL and never checks ownership, so any booking
can be read by id. The live app calls it from `OrderDetails` and
`MyOrderDetails`, and the app's fetch helper treats a 401 as a forced logout, so
it cannot be locked without ejecting users mid-session.

**The website must not call it.** Phase F adds an ownership-checked v2 route,
matching the approach already taken for `/api/v2/investments/mine`. See
`saathi-web-application/SECURITY-REMEDIATION.md`.

---

## Statuses

`paymentConfirmationStatus`: `pending` → `uploaded` → `confirmed` | `denied`

Uploading proof sets `uploaded`. For `cash` and `cheque` the upload also sets
`collectionRequired: 'yes'` and `collectionStatus: 'pending'`. Backend
confirmation is manual, via the admin panel.

**My Investment** (screenshot 8) buckets these as:

- **Pending — Proof Submission**: booking placed, proof not yet uploaded
- **Running Project**: confirmed, in tenure — Total Investment, Expected Return
- **Completed Project**: Invested, Matured Amount, Withdrawn Amount
- A **Projects Status** counter, `N / M completed`

**Pending Invoice** (screenshot 9) is the compact per-booking view: Invested,
partner count, Total Return (Max), project count, Booking ID, Booking Date, and
**Upload Proof of Payment**.

---

## Things to carry into the web build

- **Three-day deadline.** The placed-booking dialog promises proof within three
  days. Surface it as a countdown on the pending booking, not just once in a
  dialog the user dismisses.
- **No guaranteed returns.** Returns are ranges everywhere (`13.00%–15.00%`,
  `56,500 – 57,500 BDT`) and the brief forbids promising guaranteed returns.
  Keep the range form and the `~` prefix.
- **Bangla.** Every string here needs a `bn` counterpart, including the How to
  Pay steps and the bank field labels. Amounts follow the established rule:
  Bangla digits in prose, Western in tables.
- **JPEG/PNG only, 10 MB.** Validate client-side before upload so a desktop user
  with a PDF gets a useful message rather than a server rejection.
- **Proof files are uploaded to S3 with `ACL: 'public-read'`.** A payment
  receipt is a bank document. Flagged in SECURITY-REMEDIATION.md; the web
  upload path should not widen the exposure.
