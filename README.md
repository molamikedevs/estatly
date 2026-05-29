# Estatly

An internal property management platform for real estate agencies.
Built to streamline how agents, managers, and admins handle listings,
clients, and viewings inspired by the back-office tools used by
agencies in markets like Dubai.

## Status

🚧 Currently in active development

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Routing:** React Router v6
- **State:** TanStack Query (server state) + Context API (UI state)
- **Forms:** React Hook Form + Zod validation
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Tailwind CSS v4 + Shadcn/ui
- **Charts:** Recharts
- **Dates:** date-fns

## Features (In Progress)

- [ ] Multi-role authentication (Admin / Manager / Agent)
- [ ] Property listings management with approval workflow
- [ ] Property detail pages with image galleries
- [ ] Client management
- [ ] Viewing scheduling
- [ ] Dashboard with stats and analytics
- [ ] Agent performance tracking
- [ ] Dark mode

## Development

```bash
pnpm install
cp .env.example .env.local  # then add your Supabase credentials
pnpm run dev
```

## Author

Lamin Foday ([molamikedevs](https://github.com/molamikedevs))
