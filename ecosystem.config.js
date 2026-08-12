/**
 * PM2 process definition for new.digigramventures.com.
 *
 * Port 4300, confirmed free on the box.
 *
 * Taken already: 3000 (shathisheba-admin, under *root's* pm2 daemon), 4100
 * (saathi-app — the staging API behind api-test) and 4200
 * (saathi-app-production). 3210 is this site's local dev server.
 *
 * Start this as the `ubuntu` user, never with sudo: root and ubuntu run
 * separate pm2 daemons, and an app registered in root's will not be revived by
 * ubuntu's `pm2 startup` after a reboot.
 *
 * Nginx terminates TLS and proxies to this; see deploy/nginx.conf.
 *
 * `next start` is invoked through its binary rather than `npm run start`, so
 * PM2 supervises the Node process itself. Going through npm leaves PM2
 * watching a shell wrapper, which makes restarts and memory limits unreliable.
 */
module.exports = {
  apps: [
    {
      name: 'digigram-website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 4300',
      instances: 1,
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
