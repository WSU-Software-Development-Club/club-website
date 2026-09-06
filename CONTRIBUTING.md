# Contributing

## Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/WSU-Software-Development-Club/club-website.git
   cd club-website
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL` (ask a maintainer for a dev database connection string).
3. Start the dev server:
   ```bash
   npm run dev
   ```

## Workflow

1. Create a branch for your change:
   ```bash
   git checkout -b your-branch-name
   ```
2. Make your changes and commit them with a descriptive message:
   ```bash
   git add <files>
   git commit -m "Your descriptive commit message"
   ```
3. Push the branch and open a pull request against `main`:
   ```bash
   git push origin your-branch-name
   ```
4. Before requesting review, make sure the build and lint pass:
   ```bash
   npm run build
   npm run lint
   ```
