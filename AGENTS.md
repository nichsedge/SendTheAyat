# Repository Guidelines for Agents (SendTheAyat)

## Project Overview
- **Name**: SendTheAyat (KirimAyat.xyz)
- **Concept**: SendTheSong for Al-Qur'an — sending personal heartfelt messages paired with meaningful Quranic verses and crystal-clear recitations.
- **Stack**: Next.js 15 (App Router, Static Export SSG) + React 19 + TypeScript + Tailwind CSS v4 + Cloudflare Pages & D1 Database.

## Runtime & Tooling Standards
- **Package Manager**: Primary: `bun` (`bun install`, `bun run dev`, `bun run build`, `bun run deploy`). Dual lockfiles (`bun.lock` and `package-lock.json`) are maintained for full compatibility with Cloudflare Pages CI and npm environments.
- **Node Runtime**: Node 22 LTS pinned via `.node-version` for Cloudflare Pages build system.
- **Deployment Target**: Cloudflare Pages (`sendtheayat.pages.dev`).
  - Framework Preset: `None` / `Next.js (Static HTML Export)`
  - Build Command: `bun run build` (or `npm run build`)
  - Build Output Directory: `out`
- **Database**: Cloudflare D1 (`sendtheayat-db`). Schema is defined in `schema.sql`.
- **Pages Functions**: Located in `functions/`:
  - `functions/api/messages.ts`: REST API for querying and inserting messages into D1.
  - `functions/v/[id].ts`: Dynamic edge router for `/v/:id` providing server-side OpenGraph / Twitter Cards for social bots (WhatsApp, Twitter, Telegram) and client routing via `HTMLRewriter`.

## Code Conventions
- **No Backward Compatibility Shims**: Always target modern ES/TS standards and clean architectures.
- **Strict Typing**: All message payloads must adhere to `PersonalMessage` in `lib/types.ts`.
- **Privacy Handling**: `isPrivate` messages are unlisted; they must never appear in the public feed or name search (`is_private = 0`), but remain accessible via direct URL.
- **Media Exports**: Story exports must use 9:16 aspect ratio (`toPng` at `pixelRatio: 2.5+`) for optimal rendering on mobile Instagram/TikTok/WhatsApp stories.

## Cloudflare Pages & Deployment Guardrails
- **Dual Lockfile Synchronization**: Bun 1.2+ uses text-format `bun.lock`. Because Cloudflare Pages automated CI detects `package-lock.json` (or `bun.lockb`), whenever packages change, always run `npm i --package-lock-only` so `package-lock.json` stays clean and in sync with `bun.lock`.
- **Engine Version Guarantee**: Cloudflare Pages v2 build image defaults to Node 18.17.1 (incompatible with Next 15). Always maintain `.node-version` set to `22` at repository root.
- **No OpenNext or Server Adapters**: Do not install `@opennextjs/cloudflare` or generate `open-next.config.ts`. The project uses SSG (`output: 'export'`) with edge Pages Functions in `functions/`.
- **ESLint 9 Flat Config**: Use `@next/eslint-plugin-next.flatConfig` in `eslint.config.mjs`. Never use legacy `.eslintrc.json` or `@rushstack/eslint-patch`.

