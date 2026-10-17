# Angela-Maria foundation

This directory is a local application foundation. It is not the public website.

The public site remains the static HTML at the repository root. Vercel still serves that site from the repository root. Do not set the Vercel project root to `platform/`, and do not add a root `package.json`. Either change would make Vercel build this application instead of the current pages.

## What this phase includes

- English routes under `/en` and Arabic routes under `/ar`, with `lang` and `dir` set for each.
- A PostgreSQL schema for offerings, translations, and the handmade catalog.
- An idempotent seed of `shop-data.js`.
- Administrator sign-in by a one-time email link, closed until SMTP is configured.
- A product list and editor for price, fulfillment, and stock.
- A payment boundary that stays disabled.

Arabic product text, checkout, bookings, and reports are not created here. Prices and stock stay empty until an administrator enters them.

## Local workflow

Requirements: Node.js 20 or newer, npm, and a PostgreSQL database you control.

```bash
cd platform
npm install
copy .env.example .env
```

Set `DATABASE_URL` in `.env` to that local database. Leave `ADMIN_EMAILS` and the SMTP variables empty until a real administrator mailbox exists. An empty allowlist refuses every session.

A disposable local database can be started with Docker, bound to localhost only:

```bash
docker run -d --name angila-foundation-pg ^
  -e POSTGRES_PASSWORD=choose-a-local-password ^
  -e POSTGRES_USER=angila ^
  -e POSTGRES_DB=angila_foundation ^
  -p 127.0.0.1:54329:5432 postgres:16-alpine
```

Then:

```bash
npx prisma migrate deploy
npm run db:seed
npm run dev -- --port 3001
```

`npm run dev` is Next's development server. It defaults to port 3000 and moves to another port when 3000 is already taken. Pass `--port` with a free port so the address stays stable. The ignored local environment for this workspace pins port 3001 because port 3000 is used by another program. Do not stop that other program.

If Prisma cannot download its query engine because Node rejects the certificate, prefix the command with `NODE_OPTIONS=--use-system-ca`.

Open `http://localhost:3000/en` and `http://localhost:3000/ar`. The public HTML site is unchanged and is not served by this process.

## Catalog mapping

`shop-data.js` is the source. The seed upserts by slug and only writes English translation rows.

| Source | Database |
| --- | --- |
| `slug` | `handmade_products.slug` and offering id `offering:<slug>` |
| `name`, `shortDescription` | English `offering_translations` |
| `points`, `materials`, `dimensions`, `care` | English `product_translations` |
| `category` | `category_key`, with the English label from the source categories |
| `price: null` | `price_minor_units` null on insert. A non-null source price fails the seed instead of being guessed as shekels or agorot. Re-seeding does not clear a price an administrator saved. |
| `available` | `source_available`. This is not a stock count. New rows start with `inventory_mode = unknown` and null stock. Re-seeding does not change fulfillment or stock. |
| `images`, `imageFocus`, `featured`, `layout`, `published` | Stored as given. `published: true` becomes offering status `published`. |

Arabic translation rows are not created. Re-running the seed updates English catalog copy and does not delete an Arabic row added later. It also leaves `price_minor_units`, `stock_quantity`, and `inventory_mode` untouched.

Currency on each product row is `ILS`. Amounts entered in the editor are shekels and are stored as integer agorot.

## Administrator sign-in

Sign-in uses a one-time link sent through SMTP. There is no password and no development bypass. The administration pages and every admin API check the session on the server.

Until all of the following are set, `POST /api/admin/session` returns `sign_in_not_configured` and the admin screens stay closed:

1. Generate `AUTH_SECRET` with a long random value, for example `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Keep it only in the ignored `.env` file.
2. Set `ADMIN_EMAILS` to the real administrator addresses, separated by commas. Do not invent an address. Matching ignores case and surrounding spaces.
3. Set `APP_ORIGIN` to the exact origin in the dev server's `Local:` line, with no path. For the pinned local port that is `http://localhost:3001`. Production (`NODE_ENV` or `VERCEL_ENV` of `production`) requires `https`.
4. When an email provider is available, set `SMTP_HOST`, `SMTP_PORT`, and `EMAIL_FROM`. `EMAIL_FROM` must contain `@`. If that server requires a login, set both `SMTP_USER` and `SMTP_PASSWORD`. Leave all five empty until then. Any provider that offers authenticated SMTP submission is sufficient; this project does not select one.

Until SMTP is configured, a development server opened at `localhost` can sign in an allowlisted address from that computer. Production cannot.

Restart the application after changing these values. Open `/en/admin`. Enter an allowlisted address. The mailbox receives a link that expires in 15 minutes and works once. Addresses that are not allowlisted receive the same on-screen confirmation and no email.

The session cookie is `httpOnly`, `SameSite=Lax`, `Secure` in production, and expires after 12 hours. The raw link token is stored only as a SHA-256 hash.

The in-memory rate limit allows 10 sign-in attempts per 15 minutes for the whole process. It ignores `X-Forwarded-For`, because that header is chosen by the client. Restarting the process clears the limit, and a second process has its own limit. Put a shared limit at the edge before running more than one instance. The sign-in link is a query parameter, so an access log of that request can contain it; the consume response asks the browser not to send that URL onward as a referrer. An audit table of product edits is a later improvement; this phase does not pretend to record one.

`paymentBoundary.configured` is false. Calling the server payment guard throws. There is no checkout route.
