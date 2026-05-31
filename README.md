# Estatly

An internal property management platform for real estate agencies.
Built to streamline how agents, managers, and admins handle listings,
clients, and viewings — inspired by the back-office tools used by
agencies in markets like Dubai.

**Live demo:** https://estatly-three.vercel.app

## Status

V1 shipped. Active development continues on V2 features.

## Demo Logins

Try the app with any of these test accounts:

| Role    | Email                     | Password      |
| ------- | ------------------------- | ------------- |
| Admin   | admin-test@gmail.com      | Admin12345    |
| Manager | manager-test@gmail.com    | Manager12345  |
| Agent   | agenttest@gmail.com       | Agent12345    |

Each role sees a different version of the app, with permissions
enforced at three layers: route guards, UI visibility, and
PostgreSQL Row Level Security.

## Features

- Multi-role authentication (Admin / Manager / Agent)
- Three-layer authorization (route + UI + database RLS)
- Property listings with create / edit / delete and approval workflow
- Multi-image upload to Supabase Storage
- Client pipeline management with status tracking
- Viewing scheduling with inline status updates
- Agent management (admin/manager only)
- Agency settings (admin only)
- Dashboard with stats and charts
- Search across properties and viewings
- URL-based filtering, sorting, and pagination
- Light and dark mode

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Routing:** React Router v6
- **State:** TanStack Query (server state) + Context API (UI state)
- **Forms:** React Hook Form + Zod validation
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Charts:** Recharts + shadcn charts
- **Dates:** date-fns

## Roadmap (V2)

- Multi-agency support (multi-tenancy)
- AI assistant for natural-language queries against agency data
- Real-time notifications for property approvals
- Agent performance leaderboard
- Viewing notes and post-viewing feedback display
- Property and client detail pages with extended views

## Development

\`\`\`bash
pnpm install
cp .env.example .env.local  # then add your Supabase credentials
pnpm run dev
\`\`\`

## Author

Lamin Foday ([molamikedevs](https://github.com/molamikedevs))
