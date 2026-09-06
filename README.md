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

- **Node.js 22.13.1**
  - If you have [nvm](https://github.com/nvm-sh/nvm) installed, run `nvm use` to automatically switch to the correct version

## Project Structure

```
├── api/           # Vercel serverless functions (production API routes)
├── server.ts      # Local Express server mirroring the api/ routes for local dev
├── src/
│   ├── pages/     # Route-level page components
│   ├── components/ui/
│   └── assets/
└── public/
```

## Quick Start

```bash
git clone https://github.com/WSU-Software-Development-Club/club-website.git
cd club-website
npm install
cp .env.example .env   # then fill in DATABASE_URL
npm run dev
```

`npm run dev` runs the Vite dev server and the local Express API (`server.ts`) together.

## Design Guidelines

This project follows the [WSU brand guidelines](https://brand.wsu.edu/) for colors and visual elements.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the branch and pull request workflow.
