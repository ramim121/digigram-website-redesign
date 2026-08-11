# Deploying new.digigramventures.com

The site is a Next 15 app served by `next start` behind nginx on the existing
EC2 box, alongside the API. It renders per request — sessions, projects and
bookings all come from the API — so it cannot be exported as static files.

| | |
|---|---|
| Port | `4300` (3111, 3210 and 4200 are already taken) |
| Path on server | `/var/www/html/digigram-website-redesign` |
| Process manager | PM2, app name `digigram-website` |
| Deploy | GitHub Actions, **manual trigger** |

---

## One-time setup on the server

### 1. DNS

Point an `A` record for `new.digigramventures.com` at the EC2 elastic IP and
wait for it to resolve. Certbot validates over HTTP and fails if the name does
not yet answer.

```bash
dig +short new.digigramventures.com
```

### 2. Directory and first checkout

```bash
sudo mkdir -p /var/www/html/digigram-website-redesign
sudo chown -R "$USER":"$USER" /var/www/html/digigram-website-redesign
```

### 3. Environment

The workflow **excludes** `.env.production` from the rsync, so the file on the
server is the authority and is never overwritten by a deploy. Create it once:

```bash
cd /var/www/html/digigram-website-redesign
cat > .env.production <<'EOF'
SHATHI_API_URL=https://api.digigramventures.com/api/
SHATHI_S3_URL=https://saathi-files-new.s3.ap-southeast-1.amazonaws.com/
SHATHI_REVALIDATE=300
SHATHI_TIMEOUT_MS=8000

NEXT_PUBLIC_SITE_URL=https://new.digigramventures.com
NEXT_PUBLIC_GA_ID=G-JLQYQDN2RZ
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<the web OAuth client id>
EOF
chmod 600 .env.production
```

> **`NEXT_PUBLIC_SITE_URL` must match the real origin.** It builds canonical
> URLs, the sitemap and Open Graph tags. Wrong here means Google indexes the
> wrong host.

Two things must line up on the **API** side, or email verification breaks:

- `WEB_BASE_URL` on the API must be `https://new.digigramventures.com`. It is
  what verification links are built from; wrong and every link 404s.
- `EMAIL_FROM` must be an address SES has verified for the account, or every
  send fails with `MessageRejected`.

### 4. Google OAuth origins

Add to the **web** OAuth client in Google Cloud Console:

- Authorised JavaScript origin: `https://new.digigramventures.com`

Without it, Google sign-in fails in the browser with an origin mismatch and no
useful message.

### 5. nginx and TLS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/new.digigramventures.com
sudo ln -s /etc/nginx/sites-available/new.digigramventures.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d new.digigramventures.com
```

### 6. GitHub secrets

The workflow reuses the secrets the API deploy already uses:
`DEV_SSH_HOST`, `DEV_SSH_USERNAME`, `DEV_SSH_PRIVATE_KEY`, `DEV_SSH_PORT`.
If they are set on the API repo, add the same values to this one.

### 7. PM2 on boot

```bash
pm2 startup     # run the command it prints
pm2 save
```

---

## Deploying

Actions → **Deploy new.digigramventures.com** → *Run workflow*.

It rsyncs, runs `npm ci`, builds, then reloads PM2 and fails the job if the site
does not answer on `127.0.0.1:4300` afterwards.

### Why the build happens before the process stops

The API's deploy does `pm2 delete` → build → `pm2 start`, which means the API is
**down for the whole build**. This one builds first and only then reloads, so a
failed build leaves the running site untouched.

### Manual deploy, if Actions is unavailable

```bash
cd /var/www/html/digigram-website-redesign
git pull origin main
npm ci
NODE_OPTIONS="--max-old-space-size=4096" npm run build
pm2 reload ecosystem.config.js --update-env
```

---

## Things that will bite

**`next/font/google` fetches Montserrat at build time.** The build fails
outright — `NextFontError: Failed to fetch Montserrat from Google Fonts` — if
the server cannot reach `fonts.googleapis.com`. This already happened once
locally as a transient failure and passed on retry. If the EC2 security group
restricts egress, open it or the deploy will fail unpredictably.

**Build memory.** `NODE_OPTIONS=--max-old-space-size=4096` is not decoration;
92 pages are generated and the default heap is not always enough on a small
instance.

**The site reads the production API.** There is no separate content store. An
API outage takes project listings with it — pages degrade rather than crash, but
they will be empty.

**Two Next apps on one box.** The admin panel and this site both run under PM2.
Check `pm2 list` before assuming a restart affected the right one.

---

## Rollback

```bash
cd /var/www/html/digigram-website-redesign
git log --oneline -5
git checkout <previous-sha>
npm ci && npm run build
pm2 reload ecosystem.config.js --update-env
```

PM2 keeps the old process alive until the reload succeeds, so a failed build at
this point leaves the previous version serving.
