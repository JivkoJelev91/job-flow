# JobFlow

A personal job application tracking dashboard. Keep track of every job application in one place: company, position, status, salary, interviews, notes, and next steps.

Built entirely for personal usage and not intended for public deployment.

## Features

- Application dashboard with a table-based view, sorting, filtering, and search
- Full application records: company, position, job URL, salary, location, work mode, employment type, status
- Interviews and notes per application
- "Needs attention" section for overdue next actions and upcoming interviews
- Overview page with statistics: response/offer/ghost rates, applications per week, status and work-mode breakdown

## Technologies

- [Next.js](https://nextjs.org) (App Router, React Server Components, Server Actions)
- TypeScript
- PostgreSQL
- [Prisma](https://www.prisma.io) ORM
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) with Base UI
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

## Getting Started

Prerequisites: Node.js and a local PostgreSQL server.

1. Install dependencies: `npm install` (or `pnpm install`)
2. Create a database and set `DATABASE_URL` in `.env` (see `.env.example`)
3. Apply migrations: `npx prisma migrate dev`
4. Optionally load sample data: `npm run db:seed` (refuses to run when data already exists; set `SEED_FORCE=1` to force)
5. Start the dev server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check with TypeScript |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Load sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:create` | Create the local database |