# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server (port 3001 via PM2)
npm run lint     # Run ESLint
```

Production is managed with PM2 (`ecosystem.config.js`), running on port 3001.

## Architecture

This is a **stateless Next.js 14 frontend** (App Router, TypeScript) generated with v0.app. It has no backend or database — all data comes from an external ERP REST API.

**External API base URL** is loaded from `public/config.json` at runtime, with fallback to `https://www.alfaeorders.com:19443/erpapi/panel`. The API client in [lib/api.ts](lib/api.ts) handles all HTTP operations and field mapping between frontend camelCase and backend conventions.

**Data flow:**
- `app/page.tsx` — single main page, client component, owns all state
- `lib/api.ts` — typed API wrapper (`getColumns`, `createColumn`, `updateColumn`, `deleteColumn`) with `mapToBackendFields` / `mapFromBackendFields` for name conversion (e.g. `basecategory` ↔ `baseCategory`)
- `types/schema-column.ts` — shared TypeScript interfaces (`SchemaColumn`, `CreateSchemaColumn`)
- `components/` — display components (`schema-columns-table.tsx`, `schema-column-form.tsx`, `filters.tsx`) plus `ui/` (shadcn/ui primitives)

## Key Details

- **UI library:** shadcn/ui (New York style) + Radix UI primitives + Lucide icons + Tailwind CSS
- **Build:** `next.config.mjs` has `ignoreBuildErrors: true` and `ignoreDuringBuilds: true` — TypeScript and ESLint errors won't fail builds
- **API field quirks:** `values` from the backend can be `null`, a `string`, or an `Array<object>` — always use `valuesToString()` (in `schema-column-form.tsx`) before rendering in a textarea, and `displayValues()` (in `schema-columns-table.tsx`) for table cells. Never render the raw value directly.
- **Boolean fields (`editable`, `visible`):** the backend can return `null` — always coerce with `=== true` rather than truthy checks, and send explicit booleans via `mapToBackendFields`.
- **Deployment:** Vercel (live project); PM2 for self-hosted production on Linux
