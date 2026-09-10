# medical.sketcher — Full-Stack Handoff

`medical.sketcher` is a multilingual learning platform for nurses studying German. The application combines a React 19 frontend, a Node/Express server, tRPC procedures, Manus OAuth, MySQL/TiDB through Drizzle ORM, an AI learning assistant named **abdelrazaq**, level assessments, Instagram Direct ordering, lesson feedback moderation, and a persistent light/dark theme.

> **Handoff note:** The repository is prepared as a source-code delivery package. It has been checked with TypeScript and Vitest in the current project environment. A production operator must still provide the required environment variables, database connection, OAuth configuration, storage configuration, and domain DNS settings before deploying independently.

## Main capabilities

The public experience supports Arabic, English, and German, including RTL layout for Arabic. The home page presents the A1.1 German-for-nurses book, free sample pages, a direct Instagram ordering flow, level shelves, the A1.1 assessment, the `abdelrazaq` learning assistant, legal pages, learner feedback forms, and a dark-mode toggle saved in the browser.

Learner comments are stored as **pending** by default. Only an administrator can approve them from Owner Studio, and only approved feedback is returned to the public page. The project does not seed or fabricate testimonials, reviews, ratings, or learner identities.

Owner Studio is available at `/admin` for the configured administrator account. It supports level and shelf settings, assessment question management, assistant settings, and lesson-feedback moderation. The public ordering route is `https://ig.me/m/medical.sketcher`.

## Technology

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, shadcn/ui, Lucide icons |
| Server | Node.js, Express 4, tRPC 11, TypeScript |
| Database | MySQL/TiDB, Drizzle ORM, Drizzle Kit |
| Authentication | Manus OAuth with cookie-based sessions |
| AI | Manus built-in LLM integration |
| Storage | Manus/S3-compatible storage helpers |
| Tests | Vitest and TypeScript compiler checks |
| Package manager | pnpm 10 |

## Requirements

Use Node.js 22 or a compatible current LTS release, pnpm 10, and a MySQL-compatible database such as MySQL or TiDB. The deployment environment must support a Node server process and provide HTTPS for OAuth and cookie security. The project does not include `node_modules`, build output, production secrets, or database data.

## Local setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Fill in the required values. Never commit `.env` or production secrets.

3. Install dependencies:

   ```bash
   pnpm install --frozen-lockfile
   ```

4. Generate and apply database migrations against the configured database:

   ```bash
   pnpm drizzle-kit generate
   pnpm drizzle-kit migrate
   ```

   Review generated SQL before applying it to a production database. The current schema includes users, learning questions, quiz attempts, content shelves, assistant settings, and moderated lesson feedback.

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Run checks before handing the project to a client or deploying it:

   ```bash
   pnpm check
   pnpm test
   pnpm build
   ```

## Production deployment

The production build is generated with:

```bash
pnpm build
```

The build produces the Vite client bundle and the server bundle under `dist/`. Start it with:

```bash
pnpm start
```

The hosting provider must expose the port supplied by the environment and must not hardcode a port in the deployment configuration. Set `NODE_ENV=production`, configure all server and frontend variables, and use a managed MySQL/TiDB database. Configure the OAuth callback URL for the production domain according to the Manus OAuth application settings.

For the built-in Manus deployment, the current published domain is:

`https://scrabnurse-n9uvu7xz.manus.space`

For a company-owned domain, add the domain in the hosting control panel, complete the DNS records requested by the provider, and update OAuth redirect/callback settings to the final HTTPS URL. Do not change DNS until the target deployment is running and the company has tested login, Owner Studio, sample download, Instagram ordering, the assessment, feedback submission, and dark mode.

## Environment variables

See `ENVIRONMENT_VARIABLES.md` for the complete template. The most important values are:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MySQL/TiDB connection string |
| `JWT_SECRET` | Session-cookie signing secret; use a long random value |
| `VITE_APP_ID` | Manus OAuth application ID |
| `OAUTH_SERVER_URL` | Manus OAuth server URL |
| `VITE_OAUTH_PORTAL_URL` | Frontend login portal URL |
| `OWNER_OPEN_ID` | Open ID of the account allowed to use Owner Studio |
| `BUILT_IN_FORGE_API_URL` | Manus built-in API endpoint |
| `BUILT_IN_FORGE_API_KEY` | Server-side built-in API key |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend built-in API endpoint when required |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend built-in API key when required |
| `SHOPIFY_STORE_DOMAIN` | Optional connected Shopify store domain |
| `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN` | Optional Storefront API token |
| `VITE_APP_TITLE` | Website title shown by the project shell |
| `VITE_APP_LOGO` | Optional application logo configuration |

Production secrets must be added through the deployment platform's secret manager. Do not place real keys in the repository, ZIP file, screenshots, README, or support messages.

## Database and moderation workflow

New learner feedback is intentionally saved with the `pending` status. The owner signs in through Manus OAuth, opens `/admin`, chooses **Lesson feedback**, and approves or rejects each submission. Approved feedback becomes visible under the corresponding lesson key. This workflow protects the company from publishing unverified or inappropriate user-generated content.

The lesson keys currently used by the A1.1 page are `a1-1-lesson-1` through `a1-1-lesson-11`. If the lesson structure changes, update the lesson key list in `client/src/pages/Home.tsx` and keep the keys lowercase with hyphens.

## Important operational notes

The current public purchase flow is manual Instagram Direct ordering, not an independent card checkout. Shopify-related server functionality exists in the project configuration, but the visitor-facing flow is intentionally directed to `@medical.sketcher` as requested. A company can later replace this with a verified payment provider after completing provider onboarding, webhooks, refund policy, and security review.

The legal pages are present in Arabic, English, and German. They should be reviewed and customized by the company or its legal adviser before commercial launch, especially for privacy, refunds, digital products, data retention, and applicable jurisdiction.

The project contains a development-store Shopify configuration. If the company wants to use a different Shopify store, claim and authorize the connected store through the project integration settings before using the related store tools.

## Delivery checklist

Before handing the project to the company, confirm that the recipient has the ZIP file, access to the required secret manager, the MySQL/TiDB connection details, the Manus OAuth application details, the storage configuration, and the final domain ownership. The recipient should run `pnpm install --frozen-lockfile`, configure `.env`, run migrations, and then run `pnpm check`, `pnpm test`, and `pnpm build`.

A first production smoke test should cover the home page in all three languages, Arabic RTL layout, light/dark mode persistence, free sample preview and download, Instagram Direct ordering, the A1.1 assessment, user feedback submission, Owner Studio access, feedback approval, and legal page routes.

## Project structure

```text
client/                 React frontend and pages
server/                 tRPC routers, database helpers, and server runtime
drizzle/                Drizzle schema and SQL migrations
storage/                Storage helpers
shared/                 Shared constants and types
.env.example            Safe environment variable template
package.json            Scripts and dependencies
pnpm-lock.yaml          Reproducible dependency lockfile
```

## Available scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm check` | Run TypeScript without emitting files |
| `pnpm test` | Run the Vitest suite |
| `pnpm build` | Build frontend and production server bundles |
| `pnpm start` | Start the production server from `dist/` |
| `pnpm drizzle-kit generate` | Generate SQL from the Drizzle schema |
| `pnpm drizzle-kit migrate` | Apply reviewed migrations to the configured database |
| `pnpm format` | Format project files with Prettier |

## Handoff status

The package is intended for company review and deployment. It is not a substitute for company-owned production credentials, legal approval, payment-provider approval, DNS control, or a final security review. The source code and README describe the current implemented scope and the operational steps needed to take ownership safely.
