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
4. Task search (title, description, status, filters)
5. Switch between multiple profiles
6. Assign tasks using categories
7. Pagination

## TODO:

- Mobile support (need to to through and double check the css)
- Write more unit test and E2E tests. Need to setup Jest and Puppeteer. Also setup some sort of staging data.
- Setup CI/CD to deploy onto Vercel
- UI needs more polish
