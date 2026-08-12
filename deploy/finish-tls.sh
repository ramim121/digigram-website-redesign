#!/usr/bin/env bash
#
# Finishes new.digigramventures.com once its DNS A record resolves.
#
# Everything else is already in place: the app is built and running under PM2 on
# 4300, and the nginx vhost is enabled and serving over plain HTTP. The only
# thing that could not be done ahead of time is the certificate — certbot proves
# control of the name over HTTP, so it fails until DNS points here.
#
#   bash finish-tls.sh
#
# Safe to re-run. It refuses to touch nginx if the config does not test clean.

set -euo pipefail

HOST=new.digigramventures.com
EXPECT_IP=18.143.126.210

echo "1/4  checking DNS"
GOT=$(dig +short "$HOST" | tail -1)
if [ -z "$GOT" ]; then
    echo "     $HOST does not resolve yet."
    echo "     Add an A record -> $EXPECT_IP and wait for it to propagate."
    exit 1
fi
if [ "$GOT" != "$EXPECT_IP" ]; then
    echo "     $HOST resolves to $GOT, expected $EXPECT_IP."
    echo "     Certbot would validate against the wrong host. Fix DNS first."
    exit 1
fi
echo "     $HOST -> $GOT"

echo "2/4  checking the site answers over HTTP"
CODE=$(curl -s -o /dev/null -m 20 -w '%{http_code}' "http://$HOST/" || true)
if [ "$CODE" != "200" ]; then
    echo "     got HTTP $CODE, expected 200."
    echo "     Check:  pm2 list  and  curl -I http://127.0.0.1:4300/"
    exit 1
fi
echo "     HTTP 200"

echo "3/4  requesting the certificate"
# --redirect makes certbot add the HTTP->HTTPS redirect, matching the other
# vhosts on this box. --no-eff-email skips the mailing-list prompt so this can
# run unattended.
sudo certbot --nginx -d "$HOST" \
    --non-interactive --agree-tos --redirect --no-eff-email \
    -m info@digigramventures.com

echo "4/4  verifying nothing else broke"
sudo nginx -t
for h in api.digigramventures.com api-test.digigramventures.com \
         digigramventures.com shathisheba.digigramventures.com "$HOST"; do
    printf '     %-40s ' "$h"
    curl -s -o /dev/null -m 20 -w '%{http_code}\n' "https://$h/"
done

echo
echo "Done. Next, in Google Cloud Console -> Credentials -> the *web* OAuth"
echo "client, add this as an authorised JavaScript origin or sign-in will fail:"
echo "     https://$HOST"
