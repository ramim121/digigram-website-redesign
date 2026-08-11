# Profile, verification, and the booking gate

Companion to `web-auth.md`, which covers sign-in. This covers what an account
must have before it can invest, and how the profile screen collects it.

## The rule

Two things, and only two, stand between an account and a booking:

1. **A verified phone _or_ a verified email.** Either is enough; both is optional.
2. **A verified NID.** Submitted is not sufficient — an admin approves it.

A profile photo and a bank account are **not** blockers. The photo is cosmetic,
and the bank account is where returns are paid: it matters before a payout, not
before a booking. Requiring it up front would stop people investing for a reason
that does not yet apply to them.

This lives in one function — `bookingBlockers()` in `lib/auth/session.ts` — so
the account page, the gate in front of the invest flow, and (in Phase E) the
booking submission cannot drift apart.

## Verification is earned, not typed

```
sign in with an SMS code  →  phoneVerified = 'yes'
sign in with Google       →  emailVerified = 'yes'
```

Saving an email in the profile form does **not** verify it: `PUT /api/user`
updates the address and deliberately leaves `emailVerified` alone. The field
hint says so, because a screen showing a saved address with no qualifier reads
as verified, and someone will believe they have met the requirement when they
have not.

`nid_verification_status` moves `none → pending → approved`, and `nid_verified`
is the flag the gate reads. Nothing on the website can set either — verification
is a human decision made in the admin panel.

## What changed versus the app's current profile screen

The app shows one long form, every field always editable, with no indication of
which parts actually block an investment. Here:

- each section is labelled **Required to invest**, **Needed before payout**, or
  **Optional**, so nobody fills in a bank account believing it is the blocker;
- a verified phone or email shows as done **with the reason** ("confirmed by the
  SMS code you signed in with"), instead of sitting there looking unfinished;
- NID has three distinct states — not submitted, under review, verified — rather
  than a file input that looks identical before and after upload;
- a **verified NID cannot be re-uploaded** from the web. It is locked with a note
  to contact support, so nobody resets their own verified status and re-enters
  the review queue by accident;
- when the only outstanding item is our own review, the gate shows **no action
  button**. Sending someone back to a form they have already completed reads as
  though their submission was lost.

## Routes added

| Route | Backend | Notes |
|---|---|---|
| `PUT /api/account/profile` | `user` | name, date of birth, optional email |
| `POST /api/account/nid` | `profile/nid` | multipart; backend fields are `nidfront` / `nidback` |
| `POST /api/account/photo` | `profile/picture` | multipart; backend field is `profile-picture` |
| `POST /api/account/bank` | `banks/user-bank` | translates a boolean to the backend's `"yes"`/`"no"` |
| `GET /api/account/banks[?bank=id]` | `banks/get_all_banks`, `banks/{id}` | public reference data, cached an hour |

Two backend quirks are absorbed in the proxy rather than left to bite later:

- **`profile/picture` returns `success: false` on the happy path** — its success
  message is attached to a false flag. `apiUpload` therefore decides on the HTTP
  status, or every successful upload would be reported as a failure.
- **`Content-Type` is never set by hand on uploads.** Passing a `FormData` to
  `fetch` makes it generate the header including the multipart boundary; setting
  it manually produces a boundary-less header, and formidable then sees every
  field as missing — which looks like "the file did not arrive".

Both uploads are authenticated and take the user from the token, so there is no
id in the body and no way to write to someone else's profile.

## Verified

Production build against a local backend, with two real accounts:

```
signed out            invest page shows "Sign in to invest"; no booking UI
unverified user       invest page lists both blockers (contact + NID)
  (135, all 'no')     account page lists both gaps, NID shows "Not submitted"
                      profile page renders all five sections with their labels
                      booking UI present in the markup: none
fully verified user   invest page renders the booking flow
bank list / branches  200, real rows (AB BANK LIMITED, AGRABAD BRANCH, …)
```

## Bank details corrected

`digigram_banks` held a stale placeholder (United Commercial Bank / SAATHI LTD).
Migration 003 wrote the Mutual Trust account the app actually displays —
confirmed against screenshot 6 of the booking flow, which shows the same bank,
branch, account name, number and routing number.

004 had to follow it. `branch_name` was `VARCHAR(25)`, and the server's
`sql_mode` is `IGNORE_SPACE,NO_ENGINE_SUBSTITUTION` with no
`STRICT_TRANS_TABLES` — so the 31-character branch name was **silently
truncated** to "Dhanmondi Branch (Dhanmon". The columns are now `VARCHAR(120)`
and the row reads correctly.

That silent-truncation behaviour is database-wide and is deliberately left
alone: enabling `STRICT_TRANS_TABLES` turns every existing silent truncation
elsewhere in the app into a hard failure, which needs its own testing pass
rather than riding along with a bank-details fix.

## Still open

- **Google sign-in button.** The exchange route (`/api/auth/google`) is built and
  tested; the client side needs Google Identity Services posting its ID token to
  it. Until then, email verification is unreachable from the web and phone/OTP
  is the only path — which satisfies the rule, but only by one route.
- `components/auth/session.tsx` is still the old localStorage shell. It now only
  drives header display; the cookie is the authority. It should be reduced to
  that role explicitly.
