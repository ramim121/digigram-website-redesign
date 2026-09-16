/**
 * PM2 process definition for new.digigramventures.com.
 *
 * Port 4300, confirmed free on the box.
 *
 * Taken already: 3000 (shathisheba-admin, under *root's* pm2 daemon), 4100
 * (saathi-app â€” the staging API behind api-test) and 4200
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
      /*
       * 512M was too low and was the cause of a restart every minute or two on
       * the production copy of this site.
       *
       * Nothing was crashing. `next/image` optimises remote S3 photographs with
       * sharp, and decoding a JPEG into a raw bitmap costs multiples of the file
       * size — a page of project cards pushed steady-state RSS past 400M, and
       * pm2 killed the process for crossing the ceiling. The restarts looked
       * like instability and were really this limit doing exactly what it was
       * told.
       *
       * The disk-cache errors in the log ("LRUCache: calculateSize returned 0")
       * are a separate, cosmetic Next 15.5.23 bug: the image still serves 200,
       * only the cache write fails. Verified by requesting optimised images
       * directly — they succeed and the process does not restart.
       *
       * 900M leaves room for image work while still catching a genuine leak.
       * The box has 3.7G and five Node processes; the other four sit at
       * 140-190M with no ceiling at all.
       */
      max_memory_restart: '900M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
