# WSU Software Development Club Website

The official club website for the Software Development Club at Washington State University. This site enables our club to showcase our projects, announce upcoming events, highlight our team members, and provide information about our club for prospective members looking to join our community!

## Tech Stack

- **React.js** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Neon Serverless PostgreSQL** - Backend relational database
- **Vercel** - Deployment platform

## Prerequisites

- **Node.js 22** (22.13 or newer, see `.nvmrc` and the `engines` field in `package.json`)
  - If you have [nvm](https://github.com/nvm-sh/nvm) installed, run `nvm use` to automatically switch to the correct version

## Project Structure

```
├── api/           # Vercel serverless functions (production API routes)
│   └── _lib/      # Shared SQL queries + handler wrapper used by api/ and server.ts
├── server.ts      # Local Express server exposing the same routes for local dev
├── src/
│   ├── pages/     # Route-level page components
│   ├── components/ui/
│   ├── components/admin/  # Password-gated editor for the database tables
│   └── assets/
├── public/
└── .github/       # CI workflow, Dependabot, CODEOWNERS, PR and issue templates
```

### Adding an API route

1. Add the query functions and the row type to `api/_lib/queries.ts`.
2. Add a body validator to `api/_lib/validate.ts` if the route accepts writes.
3. Create `api/<name>.ts` that exports `vercelResource({ list, parse, create, update, remove })`.
4. Register the same path in `server.ts` with `route("/api/<name>", { ...same ops })`.

Both environments share the query, the validator, and the request dispatch in
`api/_lib/handler.ts`, so that logic only lives in one place. `GET` is public;
`POST`, `PATCH`, and `DELETE` require an admin session token.

## Quick Start

```bash
git clone https://github.com/WSU-Software-Development-Club/club-website.git
cd club-website
npm install
cp .env.example .env   # then fill in DATABASE_URL
npm run dev
```

`npm run dev` runs the Vite dev server and the local Express API (`server.ts`) together.

## Admin Page

`/admin` is a password-gated page for adding, editing, and removing events,
projects, and team members, so club leaders do not have to edit rows in the Neon
console by hand. It is not linked from the navbar - navigate to it directly.

It needs two more environment variables alongside `DATABASE_URL`:

| Variable               | Purpose                                             |
| ---------------------- | --------------------------------------------------- |
| `ADMIN_PASSWORD`       | The password typed on the login screen              |
| `ADMIN_SESSION_SECRET` | Any long random string, used to sign session tokens |

Set both in `.env` for local development **and** in the Vercel project settings
for production, otherwise every login attempt on the deployed site fails.

Signing in exchanges the password for a token that expires after 8 hours and is
kept only for the life of the browser tab; the password itself is never stored.
Rate limiting is unreliable on serverless, so **choose a long random password** -
that, not the login delay, is what keeps the page shut.

## Design Guidelines

This project follows the [WSU brand guidelines](https://brand.wsu.edu/) for colors and visual elements.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch and pull request workflow.
