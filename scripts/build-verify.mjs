/**
 * `next build` into a throwaway directory, so it cannot disturb a dev server.
 *
 * WHY THIS EXISTS
 * `next build` and `next dev` both write `.next`. Running a build to check
 * something while a dev server is up replaces the dev chunks underneath the
 * running process, which then fails every request with
 *
 *   Cannot find module './vendor-chunks/<something>.js'
 *
 * That reads like a broken dependency and is not: it is a live process holding
 * references to files that were deleted a moment ago. The fix is always to stop
 * the dev server, delete `.next` and start again — which is a lot of ceremony
 * for "does it still build".
 *
 * WHY NOT `NEXT_DIST_DIR=... next build` IN package.json
 * npm runs scripts through cmd.exe on Windows, which has no `VAR=value command`
 * syntax and fails with "'NEXT_DIST_DIR' is not recognized". `cross-env` would
 * fix it at the cost of a dependency; setting the variable here costs nothing.
 *
 * Deploys still use plain `npm run build`, which writes `.next` as normal.
 */
import { spawn } from "node:child_process";

const DIST = ".next-verify";

const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "build"],
    {
        stdio: "inherit",
        env: { ...process.env, NEXT_DIST_DIR: DIST },
    },
);

child.on("exit", (code) => {
    if (code === 0) {
        console.log(`\nBuilt into ${DIST}/ — .next and any running dev server are untouched.`);
    }
    process.exit(code ?? 1);
});
