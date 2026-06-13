# zoto-test

A Next.js test harness and playground for experimenting with form-driven action bars, modern React patterns, and a rich task/approval data model.

## Highlights

- **Action Bar + clean separation**: Forms are pure (fields + RHF + mutations). Action buttons are declared in sibling `*.actions.ts` modules. `form-registry.ts` is the single composition root (metadata + component + `getActions` factory). A thin `FormHost` wires live actions to the top `ActionBar`. Forms never know about the bar.
- Production-style forms using React Hook Form + Zod + TanStack Query mutations + Sonner toasts.
- Comprehensive Drizzle + SQLite schema for tasks, subtasks, and multi-level approvals (ready to integrate).
- Full shadcn/ui library plus supporting primitives, advanced theming tokens, and TypeScript throughout.

## Tech Stack

**Core**
- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + PostCSS

**Forms & State**
- React Hook Form + @hookform/resolvers (Zod)
- @tanstack/react-query
- Zod

**Data & DB**
- Drizzle ORM + @libsql/client (file-based SQLite at `./sqlite.db`)
- drizzle-kit for push / studio

**UI & Components**
- shadcn/ui (radix-nova style) — 50+ components
- Radix primitives, Base UI, lucide-react, vaul (drawer), cmdk, embla-carousel, react-resizable-panels, recharts, input-otp, sonner, etc.
- next-themes (partial integration)

**Tooling**
- Biome (lint + format)
- pnpm (preferred; lockfiles for both pnpm and npm present)

## Getting Started

```bash
# Install dependencies (pnpm recommended)
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

The project includes a ready-to-use task management schema.

```bash
# Push the current schema to the local SQLite DB (creates/updates sqlite.db)
pnpm db:push

# Launch Drizzle Studio for visual inspection/editing
pnpm db:studio
```

The DB file (`sqlite.db`) lives at the project root. See [src/db/schema.ts](src/db/schema.ts) for the full model (tasks, subtasks, approvals + relations).

## Scripts

| Script          | Description                              |
|-----------------|------------------------------------------|
| `pnpm dev`      | Start Next.js dev server                 |
| `pnpm build`    | Production build                         |
| `pnpm start`    | Start production server                  |
| `pnpm lint`     | Run Biome linter                         |
| `pnpm format`   | Format code with Biome                   |
| `pnpm db:push`  | Push schema changes with drizzle-kit     |
| `pnpm db:studio`| Open Drizzle Studio                      |

## Project Structure

```
zoto-test/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Main demo: ActionBar + form tabs
│   │   ├── globals.css              # Theming tokens (oklch + shadows)

│   ├── components/
│   │   ├── action-bar/              # Dumb presenter (receives actions prop)
│   │   ├── forms/                   # Pure forms + *.actions.ts + registry + FormHost (controller bridge)
│   │   └── ui/                      # shadcn/ui components (~56 files)
│   ├── db/
│   │   ├── schema.ts                # Full task/subtask/approval model
│   │   ├── index.ts                 # Drizzle client (libsql file)
│   │   └── types.ts
│   ├── form-actions/                # FormActionProvider, useRegisterActions, types
│   ├── hooks/
│   └── lib/
├── drizzle.config.ts
├── components.json
├── biome.json
├── package.json
└── sqlite.db
```

## Main Demo (http://localhost:3000)

The root page demonstrates the clean **Action Bar + separated actions** architecture:

- Sticky header with a dumb `ActionBar` that receives actions as props.
- Form switcher tabs: **Edit Profile** and **Invite Member**.
- Each form is pure (fields + RHF + Zod + mutations + toasts). No bar coupling.
- Action buttons are declared in sibling modules (`profile.actions.ts`, `invite.actions.ts`) as pure `getXActions(ctrl)` functions.
- `form-registry.ts` is the single source of truth: metadata + component + `getActions` factory.
- `FormHost` renders the active form, captures the live controller via a thin bridge, computes actions via the registry, and feeds them to `ActionBar`.
- Built with React Hook Form + Zod + TanStack Query + Sonner.

See:
- [src/app/page.tsx](src/app/page.tsx)
- [src/components/forms/form-registry.ts](src/components/forms/form-registry.ts)
- [src/components/forms/form-host.tsx](src/components/forms/form-host.tsx)
- [src/components/forms/profile.actions.ts](src/components/forms/profile.actions.ts) and [invite.actions.ts](src/components/forms/invite.actions.ts)
- [src/components/forms/profile-form.tsx](src/components/forms/profile-form.tsx) (pure)
- [src/components/action-bar/action-bar.tsx](src/components/action-bar/action-bar.tsx) (dumb presenter)

## Database Layer

A complete relational model is defined and ready:

- **tasks**: title, description, status (6 values), priority (4), assignee, dates, hours, progress, tags, archived, etc.
- **subtasks**: nested under tasks (cascade delete), own status/priority/assignee/dates/notes.
- **approvals**: multi-level approval workflow on tasks (requestedBy, approver, status, level, comment, rejectionReason...).

Uses prefixed nanoid primary keys and timestamp columns with auto now/updated.

See full definitions and relations in [src/db/schema.ts](src/db/schema.ts).

The client is initialized in [src/db/index.ts](src/db/index.ts). Migrations output is configured to `src/db/migrations` (not yet generated).

## Current Status & Notes

- **Documentation & metadata**: This README replaces the original create-next-app boilerplate. The root layout still contains placeholder `<title>` / description (recommended to sync).
- **Theming**: Extensive custom CSS variables and dark mode rules exist in `globals.css`. `next-themes` is a dependency and the Sonner toaster wrapper attempts to use it, but no `ThemeProvider` is currently mounted in [src/components/providers.tsx](src/components/providers.tsx).
- **Data model**: The task/subtask/approval schema is fully implemented in Drizzle but **not yet consumed** by the form demos (current UI focuses purely on the action bar + form registration experiments).
- **API routes**: None exist yet (`src/app/api` directory is absent). The `/test` demo references example endpoints for illustration only.
- **Tooling**: Biome is used for linting and formatting (2-space indent). Both pnpm and npm lockfiles are present.
- **React Query**: Configured with a 60s staleTime default.

The project is intentionally a focused testbed for UI patterns rather than a complete application.

## References

- [Form Actions context & hook](src/form-actions/context.tsx)
- [Drizzle schema](src/db/schema.ts)
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query/latest)
- [Drizzle ORM](https://orm.drizzle.team)
- [Biome](https://biomejs.dev)
- [Next.js](https://nextjs.org)
