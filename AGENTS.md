# AGENTS.md

MiniCoders is two independent npm apps. There is no root `package.json`, workspace, CI, or test suite — run commands inside `MiniCoders-Client` or `MiniCoders-Server`.

## Structure

- `MiniCoders-Client/` — Next.js 16.4.5 / React 19 App Router app (TypeScript, Tailwind v4, shadcn "base-nova"). Auth flows plus problems/contest/games/admin shells.
- `MiniCoders-Server/` — Express 5 + TypeScript ESM API, Prisma 7 (PostgreSQL), Redis, JWT auth. All routes live under `/api/v1/*`.
- `MiniCoders-Client/AGENTS.md` is auto-generated and rewritten by `next dev`; leave it alone. This root file is the cross-project guide.

## Commands

From `MiniCoders-Client`:

- `npm run dev` / `npm run build` / `npm start` / `npm run lint`
- No typecheck script: `npx.cmd tsc --noEmit`

From `MiniCoders-Server`:

- `npm run dev` (tsx watch `src/server.ts`), `npm run build` (tsup → `dist/`), `npm start` (`node dist/server.js`)
- No typecheck script: `npx.cmd tsc --noEmit`
- `npm test` is a placeholder; there are no tests.
- The Prisma config is `prisma7.config.ts` (non-default name), so every Prisma CLI call needs `--config prisma7.config.ts`:
  - `npx.cmd prisma generate --config prisma7.config.ts`
  - `npx.cmd prisma migrate dev --config prisma7.config.ts`
- `prisma/generated/` is gitignored; run `generate` before typechecking or starting after schema changes.
- PowerShell here blocks `npx.ps1`; use `npx.cmd` / `npm.cmd`.

## Server notes

- `src/server.ts` connects Postgres and Redis before listening; local startup fails if either is unavailable.
- Env comes from `.env` in the server cwd (`src/config/index.ts`). See that file for exact keys: `DATABASE_URL`, `REDIS_*`, `JWT_*`, `GOOGLE_CLIENT_ID`, `SMTP_*`, `EMAIL_SENDER`, `APP_URL`, `PORT`, `BCRYPT_SALT_ROUNDS`. Stripe keys are declared but unused.
- CORS only allows `APP_URL` with credentials. `auth(...roles)` accepts the `accessToken` cookie or `Authorization: Bearer`.
- Module layout is `src/modules/<name>/` with route + controller + service + interface (+ optional validation). Register the router in `src/app.ts`. Naming is inconsistent between modules (`auth.routes.ts` vs `problems.route.ts`); copy the module you are editing.
- Responses use the `sendResponse` envelope `{ success, statusCode, message, data, meta? }`. Throw `AppError` inside `catchAsync` and let `globalErrorHandler` format it. `validateRequest` validates only `req.body`; query params are parsed manually in controllers.
- Prisma models are split across `prisma/schema/*.prisma`. Import generated code from `prisma/generated/prisma/client` or `/enums`, never `@prisma/client`.
- Email templates are read at runtime from `process.cwd()/src/templates`; tsup bundles only `src/server.ts` and does not copy them, so a built `dist/` needs that folder present.

## Client notes

- Env keys: `BACKEND_API_URL` (server-only, used by most `services/*.ts` server actions), `NEXT_PUBLIC_API_URL` (used by `getme.ts` and `logout.ts`), and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (the provider throws without it). The README only documents `NEXT_PUBLIC_API_URL`; set all three.
- Auth calls are `"use server"` actions: they call Express, then re-set `accessToken`/`refreshToken` as httpOnly cookies via `next/headers`. `getMe` forwards the cookie manually.
- There is no middleware or route guard; layouts only call `getMe()` for the navbar. Role checks happen on the server API only.
- Next 16 has `cacheComponents: true`; `params`/`searchParams` are Promises and dynamic reads need a Suspense boundary. `app/(codingProblems)/problems/page.tsx` is the reference pattern.
- Tailwind v4 runs through the Turbopack loader in `next.config.ts` (no tailwind config file). shadcn components use `@base-ui/react`, not Radix. `cn` comes from the `cn` package (re-exported by `@/lib/utils`).
- Zod password rules are duplicated in `lib/validation.ts` and `src/modules/auth/auth.validation.ts`; keep them aligned.
- `npm run lint` currently reports pre-existing `react/no-unescaped-entities` errors; `npx.cmd tsc --noEmit` passes.

## Known rough edges

- `auth.service.ts` renders `kids-welcome-email.ejs`, but only `user-welcome-email.ejs` exists, so email verification fails while sending the welcome mail.
- Registration shape has drifted: server validation uses `patient`, the service reads `kids`, and the client sends neither.

## Conventions

- Recent commits use `client:` / `server:` prefixes.
- Client deploys on Vercel. Server `vercel.json` serves `dist/server.js`, so run `npm run build` before deploying.
