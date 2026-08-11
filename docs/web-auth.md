# Website authentication — phone/OTP and Google, with no signup

Phase D. What is built, why it is shaped this way, and what is still missing.

## The rule that shaped everything

**No account is ever created from the website.** Only someone already registered
in the Shathi app can sign in, with the same credentials.

The existing backend routes do the opposite:

| Route | Behaviour on an unknown identity |
|---|---|
| `POST/PUT /api/otp` | **creates** the `users` row — this is how the app registers people |
| `POST /api/auth/google` | **creates** the row and copies the Google avatar into S3 |

Pointing the site at those would have turned the login form into a silent
signup form. They are also what the shipped app calls, and the app treats a 401
as a forced logout, so changing them risks ejecting live users mid-session.

So both were left untouched and two web-only routes were added:

- `POST/PUT /api/v2/web/otp`
- `POST /api/v2/web/google`

They verify identically and then **look the account up instead of creating it**.
An unknown number or Google address comes back as HTTP 404 with
`code: "NOT_REGISTERED"`, which the login form turns into the "register in the
app" panel with store links — the site's replacement for a signup form.

The duplication is deliberate and annotated in both files. `hashOtp` and
`timingSafeEqual` are copied rather than shared, because a refactor of
`/api/otp` is a change to the live app's login path.

### Two smaller hardenings in the v2 routes

- **No phone re-binding.** `/api/otp` lets a signed-in caller attach or change
  the phone number on their account. The website has no such flow, and
  accepting one would be an account-takeover surface reachable without
  re-authentication. The v2 route only signs in.
- **Google's `email_verified` is checked.** Matching an account purely on the
  email string would let anyone who can create a Google account at an address
  claim a Shathi account that merely had that address typed into it.

## Where the token lives

The Shathi JWT goes into an **httpOnly cookie** (`shathi_session`, 30 days,
`sameSite=lax`, `secure` in production). Client JavaScript cannot read it, so an
XSS bug in any third-party script cannot walk off with a 30-day credential.

Every authenticated call is made server-side by a route handler or a server
component that reads the cookie through `lib/auth/session.ts`. The browser never
holds the token and never talks to the Shathi API directly.

```
browser ──► /api/auth/otp/request ──► v2/web/otp   (POST)   send code
browser ──► /api/auth/otp/verify  ──► v2/web/otp   (PUT)    → sets cookie
browser ──► /api/auth/google      ──► v2/web/google         → sets cookie
browser ──► /api/auth/logout                                → clears cookie
```

Logout is POST, never GET: a GET logout can be fired by a cross-site image tag
or a link prefetcher and signs people out at random. There is no token
revocation list on the backend, so logout clears the cookie and the token
expires on its own — which is exactly why it is httpOnly.

## The account page

`/[locale]/account` is a server component. An unauthenticated request is
redirected before any account markup is produced, rather than being sent the
markup and having the browser hide it.

It is `force-dynamic`. Without it the page is captured at build time — when
there is no session — and that snapshot, a redirect to the login screen, would
be served to signed-in visitors.

The profile checklist (`profileGaps`) is derived from the same fields the
booking flow will require, so it cannot report "complete" for a profile that
booking then rejects. Bank lookups return `null` on failure rather than `[]`, so
"we could not check" is never rendered as "you have no account on file".
Account numbers are shown as last-four only.

## Verified

Against a production build (`next build && next start`) talking to a local
backend:

```
/en/account, no cookie              → redirected to /login
/en/account, valid cookie           → renders, shows the account holder
session token present in HTML       → 0 occurrences
otp/request, unregistered number    → 404 NOT_REGISTERED  (no SMS sent)
otp/request, malformed number       → 400 Invalid phone number
otp/verify, wrong code              → 400 Invalid OTP
google, missing/garbage token       → 400
logout                              → Set-Cookie with Max-Age=0
```

Happy path, exercised by seeding a known code straight into `app_otps` so no
SMS was sent to a real person (the row was deleted afterwards):

```
otp/verify with the seeded code     → 200, body carries only fullName + phone
cookie                              → #HttpOnly_ , 169-byte value
/en/account with that cookie        → renders the account holder
replaying the same code             → 400 Invalid OTP  (single use holds)
```

### One development-only caveat

In `next dev`, the RSC debug payload includes the cookies a server component
read, so the session token **is** visible in the dev HTML. It is absent from the
production build — confirmed above. Do not demo the site to anyone from a `dev`
server over a shared screen.

## Migration that had to be applied

`app_otps` did not exist in the database. Phase A moved OTPs out of process
memory into that table, so **OTP login would have started failing the moment
Phase A deployed** — for the app as well as the site. `001_app_otps.sql` has now
been applied (a new table; nothing existing was touched), using the new generic
runner:

```bash
node db/migrate.mjs db/migrations/001_app_otps.sql --dry-run
node db/migrate.mjs db/migrations/001_app_otps.sql
```

## Still to do in this phase

- **NID upload, profile photo, and add-bank forms.** The account page reports
  what is missing and links to the profile route; the forms themselves still
  need building against `profile/nid`, `profile/picture` and `banks/user-bank`,
  all of which take multipart bodies and need a proxy route each.
- **Google sign-in button.** The exchange route is built and tested; the client
  side needs Google Identity Services wired to post its ID token to it.
- `components/auth/session.tsx` is still the old localStorage shell. It now only
  drives client-side display (the header); the cookie is the authority. It
  should be reduced to that role explicitly or removed.
