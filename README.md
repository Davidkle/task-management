# TaskFlow

A todo list app. See below for screenshots.

- [Landing Page](screenshots/landing.png)
- [Task View](screenshots/task-view.png)
- [Task List](screenshots/task-list.png)
- [Login](screenshots/login.png)

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

# Appendix

## Technical Design

### Site

- Use React, Shadcn and Tailwind CSS. These are the most popular choices for frontend currently
- Use SPA, CSR because of frequent atomic user interactions (drag-drop, real-time updates, filtering)
- Tanstack query: server state management and caching. Will also be used for local state management where needed.

#### Alternatives and Other Considerations

- Use Redux when the application grows
- SSR is good for SEO and initial page load, performance, but less suitable for highly interactive applications
- Zustand: lightweight client side state management. Does not easily support caching server state.

### Server

- Use a Next.js API server.
- A user should be able to switch profiles
- REST API
- Auth middleware. Use JWT tokens
- Zod for request validation

#### Alternatives and other considerations

- GraphQL: good choice when the app grows too large where there are separate roles for FE and BE. Benefits include type safety, single endpoint, and reduced overfetching. Consider when there are complex data relationships and multiple client applications requiring different data subsets.
- Microservices architecture: Use for scaling the app when clear service boundaries emerge. Consider when independent deployments, different tech stacks per service and/or team autonomy is needed.
- Adopt protocol buffers for inter-service communication to ensure type safety and efficient serialization across service boundaries.
- Rotate tokens

### Database

- PostgreSQL with Prisma ORM
- Single database sufficient for initial scale
- Use composite indexes (userId, status, etc) to improve query performance
- Support pagination

#### Alternatives and other considerations

- Schema
  - Data structure mostly finalized and unlikely to change
  - Strong consistency guarantees, complex relationships
  - Complex querying requirements with joins across multiple tables
  - Better for read requirements
- Schemaless
  - Data structure is still evolving
  - Better write performance
- Master-slave replication: master for writes, read replicas for queries. Need for scale i.e. API latency is high
- Caching: Redis for frequently accessed tasks, search results. Need for scale
- API rate limiting: Implement per-user rate limits to prevent abuse

## Monitoring and Observability (didn't do)

- Error and Performance Tracking: Sentry for frontend, Datadog for backend
- Structured logging with request IDs for traceability
- Health checks: DB connectivity and site up time

## Other Considerations (didn't do)

- Rich media support
  - Upload the asset to S3 and keep a URL reference in data model
  - Includes images, videos, audio files, etc.
- Multiple player mode
  - Websockets for live task updates and notifications
  - Track task modifications with timestamps and user attribution
  - Merge strategy: last writer winds for simple conflicts, manual resolution for complex ones
- WebSockets vs Polling
  - WebSockets for realtime bidirectional communication, efficient for frequent updates
  - Polling: simple implementation, better for infrequent updates and mobile clients

## Screenshots

### Landing Page

[Landing Page Screenshot](screenshots/landing.png)

### Task View

[Task View Screenshot](screenshots/task-view.png)

### Task List

[Task List Screenshot](screenshots/task-list.png)

### Login

[Login Screenshot](screenshots/login.png)
