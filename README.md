# TaskFlow

A todo list app

## Run locally

1. Run Postgres locally
2. Copy `.env.development.sample` to `.env.development`. Update `.env.development` to point to your local version of Postgres.
3. Install dependencies by running `yarn`
4. Setup database with `yarn prisma:dev`
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features Available

1. Login/Signup
2. CRUD operations for Tasks
3. CRUD operations for Categories
4. Task search (title, description)
5. Mobile web support

## TODO:

- Setup CI/CD to deploy onto Vercel
- Write more unit test and E2E tests
- UI needs more polish
