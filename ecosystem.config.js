/**
 * PM2 process definition for new.digigramventures.com.
 *
 * Port 4300. The estate already uses 3111 (admin dev), 3210 (this site's dev
 * server) and 4200 (the production API), so this avoids all three — two Next
 * apps silently fighting over a port is a confusing way to lose an afternoon.
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
