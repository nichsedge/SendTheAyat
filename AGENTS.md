# Repository Guidelines for Agents (SendTheAyat)

## Project Overview
- **Name**: SendTheAyat (KirimAyat.xyz)
- **Concept**: SendTheSong for Al-Qur'an — sending personal heartfelt messages paired with meaningful Quranic verses and crystal-clear recitations.
- **Stack**: Next.js 15 (App Router, Static Export SSG) + React 19 + TypeScript + Tailwind CSS v4 + Cloudflare Pages & D1 Database.

## Runtime & Tooling Standards
- **Package Manager**: Use `bun` (`bun install`, `bun run dev`, `bun run build`, `bun run deploy`).
- **Deployment Target**: Cloudflare Pages (`sendtheayat.pages.dev`).
- **Database**: Cloudflare D1 (`sendtheayat-db`). Schema is defined in `schema.sql`.
- **Pages Functions**: Located in `functions/`:
  - `functions/api/messages.ts`: REST API for querying and inserting messages into D1.
  - `functions/v/[id].ts`: Dynamic edge router for `/v/:id` providing server-side OpenGraph / Twitter Cards for social bots (WhatsApp, Twitter, Telegram) and client routing via `HTMLRewriter`.

## Code Conventions
- **No Backward Compatibility Shims**: Always target modern ES/TS standards and clean architectures.
- **Strict Typing**: All message payloads must adhere to `PersonalMessage` in `lib/types.ts`.
- **Privacy Handling**: `isPrivate` messages are unlisted; they must never appear in the public feed or name search (`is_private = 0`), but remain accessible via direct URL.
- **Media Exports**: Story exports must use 9:16 aspect ratio (`toPng` at `pixelRatio: 2.5+`) for optimal rendering on mobile Instagram/TikTok/WhatsApp stories.
