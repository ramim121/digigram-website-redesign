# Security findings — saathi-web-application API

Found while reading the API project to plan the website integration. These are
not style opinions; each one is reproducible from the source referenced.

Ordered by severity. Nothing here is exploited or tested against the live
system — all findings are from reading the committed code.

> **Status, August 2026.** The code side of #1–#7 is patched in the
> `saathi-web-application` working tree. Credential rotation (#1) is the part
> only you can do, and until it is done none of the patches protect anything —
> the old JWT secret still mints admin tokens. Step-by-step runbook:
> `saathi-web-application/SECURITY-REMEDIATION.md`.
>
> | # | Code | Rotation |
> |---|---|---|
> | 1 Secrets in git | ✅ fallbacks removed, `.env.example` added | ⏳ **you** |
> | 2 Bank update | ✅ auth + ownership check | — |
> | 3 Open endpoints | ⚠️ partial — see the runbook's "still open" list | — |
> | 4 OTP backdoor | ✅ env-gated review account | ⏳ set env |
> | 5 In-memory OTP | ✅ DB-backed, hashed, attempt-limited | ⏳ run migration |
> | 6 `OTP_EXPIRY` | ✅ 5 min, parsed as a number | — |
> | 7 `API_URL` | ✅ | — |
> | 8 CORS `*` | ✅ allowlist available | ⏳ set `CORS_ALLOWED_ORIGINS` |

---

## 1. CRITICAL — Live production credentials are committed to git

**File:** `src/config/constants.ts`
**Repo:** `https://github.com/ramim121/saathi-web-application` (remote `origin`, branch `main`)
**Status:** tracked by git, modified across multiple commits (`17a2040 Update constants.ts` and earlier)

The file hardcodes fallback values for every secret the platform uses. They are
not placeholders — they are real, and they are the values used when the matching
environment variable is absent:

| Secret | What it opens |
|---|---|
| `JWT_SECRET` | **Forge any session token, for any user, including `userType: 'admin'`** |
| `DB_HOST` + `DB_USER` + `DB_PASSWORD` | Direct connection to the production RDS MySQL instance |
| `S3_BUCKET_ACCESS_KEY` + `S3_BUCKET_SECRET_KEY` | Read/write/delete on the production S3 bucket (NID scans, profile photos, payment proofs) |
| `SES_AWS_ACCESS_KEY_ID` + `SES_AWS_SECRET_ACCESS_KEY` | Send email as the company |
| `BULK_SMS_API_KEY` | Send SMS from the company sender ID, at the company's cost |
| `APPLE_PRIVATE_KEY` | Sign Apple Sign-In assertions for `com.digigram.saathi` |

The JWT secret is the worst of these. With it, anyone can mint a token with
`userType: 'admin'` and reach all 70 admin endpoints — no password needed.

The S3 bucket holds **NID scans and selfies** (`/api/profile/nid`), which is
personal identity data for farmers and investors.

### What needs to happen

1. **Rotate every credential above.** They must be treated as compromised
   regardless of whether the repo is public — they have been on developer
   machines, in CI, and in git history.
2. Move all of them to environment variables with **no fallback value**. The app
   should fail to boot on a missing secret rather than silently use a baked-in
   one:
   ```ts
   function required(name: string): string {
     const v = process.env[name]
     if (!v) throw new Error(`Missing required env var: ${name}`)
     return v
   }
   export const JWT_SECRET = required('JWT_SECRET')
   ```
3. Purge the values from git history (`git filter-repo`, or accept the history
   and rely on rotation — rotation is the part that actually matters).
4. Add `src/config/constants.ts` secrets to a secret scanner in CI.

Rotating the JWT secret invalidates every existing session; users will be logged
out once and will sign in again. That is the correct trade.

---

## 2. CRITICAL — Any user's bank account can be overwritten without authentication

**File:** `src/pages/api/banks/update/[id].ts`

```
POST /api/banks/update/{idUserBanks}
```

The handler has no `Authorization` check, no session lookup, and no ownership
check. It takes the `idUserBanks` from the URL and writes `accountNumber`,
`accountHolderName`, `idBanks` and `idBankBranches` straight into that row.
CORS is `origin: '*'`, so it is callable from any browser on any origin.

`user_banks` is the payout destination for investor returns. An attacker
iterating integer IDs can redirect payouts to an account they control, and the
investor sees nothing until the money does not arrive.

**Fix:** require a valid token, resolve `idUsers` from it, and scope the update:

```ts
const userBank = await UserBank.findOne({
  where: { idUserBanks: req.query.id, idUsers: userInfo.idUsers },
})
if (!userBank) return res.status(404).json({ success: false, message: 'Not found' })
```

An admin override, if needed, should be a separate explicitly admin-gated route.

---

## 3. HIGH — Unauthenticated destructive and data-exposing endpoints

Same pattern — no token check at all. Confirmed by reading each handler:

| Route | Method | Effect |
|---|---|---|
| `/api/blogs/delete/[id]` | DELETE | Deletes any blog post |
| `/api/projects/delete-partner-assign/[id]` | DELETE | Removes a partner from a project |
| `/api/user-bank/[id]` | GET | Returns a user's bank account details |
| `/api/banks/edit-info/[id]` | GET | Returns a user's bank record for editing |
| `/api/investors/invested-projects/[id]` | GET | Returns an investor's portfolio by user ID |
| `/api/user/investors` | GET | Investor list |
| `/api/bookings/details/[id]` | GET | Booking detail including investor identity |
| `/api/partners/get_all_partners` | GET | Full partner list with personal fields |

The GET routes are an enumeration problem: sequential integer IDs plus no auth
means the whole investor and partner base can be walked by an outsider.

**Fix:** a single shared middleware — `requireUser()` / `requireAdmin()` — applied
to every route that is not deliberately public. The auth check is currently
copy-pasted per file, which is exactly why some files do not have it.

---

## 4. HIGH — OTP verification has a hardcoded backdoor

**File:** `src/pages/api/otp.ts`, lines 62–64

```ts
if (phone == "01966662633" && otp == "7910") {
    console.log("default user logged in");
}
```

That phone/OTP pair bypasses OTP validation and issues a valid 30-day JWT. It is
presumably an App Store / Play Store review account, but it is a permanent,
public credential in a public repo.

**Fix:** move the review account behind an env var that is only set in the review
build, or better, provision it as a real account with a real OTP delivered to a
number the reviewers control.

---

## 5. MEDIUM — OTPs are stored in process memory

**File:** `src/pages/api/otp.ts`, line 24

```ts
const otps: OTP = {};
```

The OTP map is module-level state in the Node process. Consequences:

- Any deploy, crash or PM2 restart invalidates every OTP in flight.
- Under PM2 cluster mode or more than one instance, the OTP is issued by one
  worker and verified by another — verification fails intermittently, and the
  failure looks random to the user.
- The map grows without bound; expired entries are only deleted on a successful
  verify, never swept.

The deploy workflow does `pm2 delete` then `pm2 start`, so **every deploy drops
all in-flight OTPs**.

**Fix:** store OTPs in the database (there is already an `app_otps`-style pattern
in the Shathi Sheba backend) or in Redis, with the expiry as a column and a
consumed flag.

---

## 6. MEDIUM — `OTP_EXPIRY` does not match its comment

**File:** `src/config/constants.ts`, line 8

```ts
export const OTP_EXPIRY = process.env.OTP_EXPIRY ? process.env.OTP_EXPIRY : 1 * 60 * 1000 // 5 minutes
```

The value is **1 minute**; the comment says 5. The login screen and any SMS copy
promising five minutes will be wrong. Also note `process.env.OTP_EXPIRY` is a
**string** when set, and it is later used in arithmetic (`Date.now() + OTP_EXPIRY`),
which produces string concatenation rather than addition — set the env var and
expiry breaks entirely. Wrap it in `Number()`.

---

## 7. LOW — `API_URL` points at localhost

**File:** `src/config/constants.ts`, line 2

```ts
// export const API_URL = process.env.API_URL ? process.env.API_URL : 'https://api.digigramventures.com/';
export const API_URL = 'http://localhost:3000/';
```

The production line is commented out. Anything server-side that builds an
absolute URL from this will point at localhost in production.

---

## 8. LOW — CORS is `origin: '*'` on authenticated endpoints

Most handlers use `micro-cors` with `origin: '*'` while also accepting an
`Authorization` header. Because the token is sent explicitly rather than as a
cookie, this is not a CSRF hole, but it does mean any origin can call the
authenticated API with a stolen token. Once the marketing site is the only
browser client, restrict the allowlist to the known origins.

---

## Suggested order of work

1. Rotate all credentials and remove the fallbacks (#1). Nothing else matters
   until this is done — the JWT secret alone defeats every other control.
2. Add `requireUser` / `requireAdmin` middleware and apply it to #2 and #3.
3. Move OTP state to the database (#5), fix the expiry type (#6).
4. Remove the OTP backdoor (#4).
5. Tighten CORS and fix `API_URL` (#7, #8).

Items 1 and 2 should happen before the new marketing site is pointed at this API
in production, because the site will drive more traffic — and more attention — to
those endpoints.
