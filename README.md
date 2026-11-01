<div align="center">

<img src="client/public/favicon.svg" width="72" alt="Cineverse logo" />

# Cineverse

**A full-stack movie ticket booking platform for India: live seat maps, Stripe payments and a complete cinema-operator back office.**

[Live demo](https://ticket-booking-platform-bice.vercel.app) · [Getting started](#getting-started) · [API reference](#api-reference) · [Contributing](#contributing)

[![CI](https://github.com/AmanBhaskar16/Ticket-Booking-Platform/actions/workflows/ci.yml/badge.svg)](https://github.com/AmanBhaskar16/Ticket-Booking-Platform/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Express-5-404d59?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-dc382d?style=flat-square&logo=redis&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-payments-635bff?style=flat-square&logo=stripe&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

</div>

---

## Overview

Cineverse covers the whole cinema-booking loop. Moviegoers browse what's playing in their city, pick seats on a live map, add food and pay with Stripe. Cinema owners run their screens, prices, menus and entry scanning from a dashboard. Admins oversee the catalogue, users, offers and payouts.

The interesting parts are on the server:

- **No double bookings.** Seats are claimed with a conditional MongoDB update inside a transaction, so two people paying for the same seat at the same moment can't both win. Integration tests check this under concurrent requests.
- **Live seat map.** Seats someone is selecting are held in Redis with a 10-minute TTL and broadcast over Socket.io. The Redis adapter keeps every server instance in sync.
- **Server-side pricing.** Seat tiers, dynamic pricing, Prime discounts, coupons, food, the convenience fee and GST are all computed on the server. The checkout quote and the charged amount always match.
- **Showtimes that schedule themselves.** A background job keeps a rolling week of shows on every cinema and prunes old, unbooked ones, so the database stays a constant size.

## Contents

- [Features](#features)
- [Architecture](#architecture)
- [How a booking works](#how-a-booking-works)
- [Business rules](#business-rules)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [Testing](#testing)
- [API reference](#api-reference)
- [Project structure](#project-structure)
- [Engineering notes](#engineering-notes)
- [Contributing](#contributing)
- [Roadmap](#roadmap)

---

## Features

### For moviegoers

| | |
|---|---|
| **Discover** | Now-showing and coming-soon catalogue, search (<kbd>⌘K</kbd>), filters by genre, language, format and city, similar titles, trailers |
| **Choose a show** | 7-day date strip, showtimes grouped by cinema, IMAX / 4DX / Dolby Atmos badges, accessibility tags, "near me" cinemas |
| **Pick seats** | Live seat map with Regular / Prime / Recliner tiers, wheelchair spaces and seats others are holding right now |
| **Add food** | Popcorn, combos, snacks and drinks from that cinema's menu, collected at the counter |
| **Pay** | Stripe card payments, wallet balance, or both; coupon codes; itemised fee and GST |
| **Tickets** | QR ticket, add to Google / Apple calendar, reminder email and in-app notification 3 hours before the show |
| **Cancel & refund** | Refund preview before cancelling, refund to card or instantly to the wallet |
| **Prime Pass** | 15% off every ticket, no convenience fee, full refunds up to the cancellation cut-off; 30-day free trial |
| **Wallet & gift cards** | Buy gift cards for friends, redeem codes, ledger of every credit and debit |
| **Engage** | Movie reviews with likes, verified-visit theatre reviews (cleanliness, sound, seating), watchlist, "notify me when bookings open" |
| **Support** | Help centre with FAQs, support tickets linked to a booking, staff replies in-app |

### For cinema owners

| | |
|---|---|
| **Theatre profile** | Photos, amenities with per-amenity photos, map location, opening hours |
| **Screens** | Visual seat-layout editor: rows, aisles, seat tiers and prices, wheelchair spaces |
| **Scheduling** | Bulk scheduling across days and times with clash detection, or let the auto-scheduler fill a rolling week |
| **Pricing** | Rules for weekends, mornings, prime time and opening day, applied automatically when a show is scheduled |
| **Policies** | Theatre-specific cancellation windows on top of the platform policy |
| **Food & drinks** | Menu editor with photo upload; a matching stock photo is shown until you add your own |
| **Entry** | Check-in tab that scans ticket QR codes with the device camera |
| **Money** | Sales analytics, monthly payout statements after platform commission, CSV export |

### For admins

Catalogue management (movies, trailers, posters, release status), cinema-owner approvals, user management, coupons and offers, support inbox, platform analytics, payouts across cinemas, and an audit log of every staff change.

### Platform

OTP email verification · role-based access (Customer / Cinema owner / Admin) with ownership checks · light & dark themes · city picker · responsive down to phone width · rate limiting and security headers · cached catalogue · photo credits page for bundled stock images

---

## Architecture

```mermaid
flowchart LR
    web["React SPA<br/><sub>Vercel</sub>"]
    api["Express API + Socket.io<br/><sub>Render</sub>"]
    db[("MongoDB Atlas")]
    redis[("Redis<br/><sub>seat holds · cache · pub/sub</sub>")]
    ext["Stripe · Cloudinary · Gmail SMTP"]

    web -- "REST + WebSocket" --> api
    api --> db
    api --> redis
    api --> ext
```

The API follows **routes → middleware → controllers → services → models**. Zod validates every write, ownership middleware stops cinema owners from touching other cinemas' data, and business logic lives in services so it can be tested without HTTP. Three jobs run inside the API process:

| Job | Every | What it does |
|---|---|---|
| Stale booking expiry | 5 min | Cancels unpaid bookings older than 10 minutes and frees their seats |
| Show reminders | 5 min | Email + in-app reminder ~3 hours before showtime |
| Auto-scheduler | 6 h (and on boot) | Releases due movies, fills empty screen-days for the next 8 days, prunes old unbooked shows. A Redis lock makes sure only one instance runs it |

The backend runs on Render rather than serverless, because Socket.io needs a long-lived process to hold WebSocket connections.

---

## How a booking works

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer
    participant A as API
    participant R as Redis
    participant M as MongoDB
    participant S as Stripe

    C->>A: select seats (socket)
    A->>R: hold seats, TTL 10 min
    A-->>C: other viewers see them as held
    C->>A: POST /bookings/initiate
    A->>M: transaction: claim seats if still free
    A->>S: create PaymentIntent
    A-->>C: client secret + server-priced total
    C->>S: pay
    C->>A: POST /bookings/confirm
    A->>S: verify payment
    A->>M: booking → SUCCESSFUL, ticket code
    A-->>C: QR ticket, seats broadcast as booked
```

```mermaid
stateDiagram-v2
    direction LR
    [*] --> IN_PROCESS: seats claimed
    IN_PROCESS --> SUCCESSFUL: payment verified
    IN_PROCESS --> CANCELLED: abandoned for 10 min
    SUCCESSFUL --> CANCELLED: customer cancels (refund per policy)
```

---

## Business rules

| Rule | Value |
|---|---|
| Convenience fee | ₹25 per ticket + 18% GST, waived for Prime |
| Prime Pass | ₹799 / 30 days, 30-day free trial once per account, 15% off tickets |
| Cancellation | 100% refund ≥ 24 h before the show · 50% between 24 h and 2 h (Prime: 100%) · not cancellable < 2 h. Cinemas can override the windows |
| Refunds | To the original card (5–7 days) or instantly to the wallet. The convenience fee is kept unless the cinema cancels the show |
| Gift cards | ₹100 – ₹10,000, valid for a year |
| Platform commission | 10% of what the cinema keeps (tickets + food). Prime discounts and coupons are funded by the platform |
| Seat hold | 10 minutes |

All money is computed on the server ([pricing.service.js](server/services/pricing.service.js), [refundPolicy.js](server/utils/refundPolicy.js)), so the checkout quote and the amount actually charged always agree.

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript 5.9, Vite 7, React Router 7, Tailwind CSS 4, Framer Motion, Socket.io client, Stripe Elements |
| **Backend** | Node.js, Express 5, Mongoose 9, Socket.io 4 + Redis adapter, Zod 4, JWT, bcrypt, Multer, Nodemailer |
| **Data** | MongoDB Atlas (replica set, for transactions), Redis 7 (seat holds, cache, pub/sub, job lock) |
| **Services** | Stripe (payments & refunds), Cloudinary (media), Gmail SMTP (email) |
| **Quality** | Vitest + mongodb-memory-server, GitHub Actions CI, k6 load tests, ESLint |
| **Delivery** | Docker multi-stage builds, Docker Compose, Vercel (frontend), Render (backend), Upstash (Redis) |

---

## Getting started

### Prerequisites

| Tool | Version | Notes |
|---|---|---|
| [Node.js](https://nodejs.org) | 20 or newer (CI uses 22) | Comes with npm |
| [Git](https://git-scm.com) | any | |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | any | Optional. The easiest way to run Redis, or the whole stack |

You also need four free accounts. Everything runs in test mode, so no real money moves.

| Service | Used for | What to copy |
|---|---|---|
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) | Database | Create a free M0 cluster → **Connect → Drivers** → connection string. Add your IP under **Network Access**. |
| [Stripe](https://dashboard.stripe.com/register) | Payments | **Developers → API keys** (test mode): the *Publishable* key (`pk_test_…`) and *Secret* key (`sk_test_…`) |
| [Cloudinary](https://cloudinary.com/users/register_free) | Image & video uploads | Dashboard → *Cloud name*, *API key*, *API secret* |
| Gmail | OTP & booking emails | Turn on 2-Step Verification, then create an [App Password](https://myaccount.google.com/apppasswords). Use that 16-character password, not your Gmail password. |

> MongoDB must be a **replica set**, because bookings use transactions. Every Atlas cluster, including the free tier, already is one. A plain local `mongod` is not.

### 1. Clone and install

```bash
git clone https://github.com/AmanBhaskar16/Ticket-Booking-Platform.git
cd Ticket-Booking-Platform

cd server && npm install && cd ..
cd client && npm install && cd ..
```

### 2. Add environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
cp .env.example .env            # only needed if you'll use Docker Compose
```

On Windows PowerShell, use `Copy-Item` instead of `cp`.

**`server/.env`**

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3000` | Port the API listens on |
| `CLIENT_URL` | `http://localhost:5173` | Frontend origin allowed by CORS |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/cineverse` | Atlas connection string, with a database name at the end |
| `REDIS_URL` | `redis://localhost:6379` | Local Redis, or `rediss://…` for a hosted one such as Upstash |
| `AUTH_KEY` | a long random string | Secret used to sign login tokens. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `STRIPE_SECRET_KEY` | `sk_test_…` | Stripe secret key |
| `CLOUDINARY_CLOUD_NAME` · `CLOUDINARY_API_KEY` · `CLOUDINARY_API_SECRET` | | From the Cloudinary dashboard |
| `EMAIL_USER` · `EMAIL_PASS` · `EMAIL_FROM` | `you@gmail.com` · app password · `Cineverse <you@gmail.com>` | Gmail address, App Password, and the sender shown to users |

**`client/.env`**

| Variable | Example | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | Must match the server's `PORT` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` | Stripe publishable key |

**`.env`** (repo root, Docker Compose only): `VITE_STRIPE_PUBLISHABLE_KEY`.

### 3. Start the app

<details open>
<summary><b>Option A: Node.js + Redis in Docker</b> (recommended for development)</summary>

```bash
# Terminal 1: Redis
docker run -d --name cineverse-redis -p 6379:6379 redis:7-alpine

# Terminal 2: API with auto-reload
cd server
npm run dev

# Terminal 3: frontend with hot reload
cd client
npm run dev
```

No Docker? Install Redis directly (`brew install redis && brew services start redis` on macOS), or point `REDIS_URL` at a free [Upstash](https://upstash.com) database.

</details>

<details>
<summary><b>Option B: everything in Docker Compose</b></summary>

```bash
docker compose up --build
```

This builds and starts Redis, the API and the frontend (served by nginx). MongoDB still comes from `MONGODB_URI` in `server/.env`. Stop everything with `docker compose down`.

</details>

### 4. Check that it works

| Open | You should see |
|---|---|
| http://localhost:3000/health | `{"status":"ok"}` |
| The API terminal | `mongo db connected successfully`, `🔴 Redis connected`, `Server running at http://localhost:3000` |
| http://localhost:5173 | The Cineverse home page |

### 5. Load demo data (optional)

```bash
cd server
npm run seed
```

This adds about 35 movies, 20 cinemas in 15 cities (with seat layouts, menus and pricing rules), reviews, and a week of showtimes. It's safe to re-run: movies, cinemas and users that already exist are left untouched. Demo accounts use `@example.com` addresses and can't sign in.

### 6. Create the first admin

The sign-up page only offers the *Movie Goer* and *Theatre Owner* roles, so create the first admin through the API. Use a real inbox for the email, because you'll receive an OTP there.

```bash
# 1. Sign up. The response contains your userId
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"you@gmail.com","password":"a-strong-password","userRole":"ADMIN"}'

# 2. Verify with the userId from step 1 and the 6-digit code from your email
curl -X POST http://localhost:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"userId":"<userId>","otp":"123456"}'
```

Now sign in at http://localhost:5173/login. The first admin is approved automatically. After that, new admins and theatre owners wait for approval in **Dashboard → Users**.

### 7. Make a test booking

Sign up as a Movie Goer, pick any show, choose seats and pay with a [Stripe test card](https://docs.stripe.com/testing):

| Card number | Result |
|---|---|
| `4242 4242 4242 4242` | Payment succeeds |
| `4000 0000 0000 0002` | Card declined |
| `4000 0025 0000 3155` | Asks for 3-D Secure |

Use any future expiry date, any CVC and any postcode.

### Scripts

| Where | Command | What it does |
|---|---|---|
| `server/` | `npm run dev` | API with auto-reload (nodemon) |
| | `npm start` | API without auto-reload (production) |
| | `npm test` / `npm run test:watch` | Run the test suite once / on every change |
| | `npm run seed` | Load demo data |
| | `npm run schedule` | Run the show auto-scheduler once |
| `client/` | `npm run dev` | Dev server at http://localhost:5173 |
| | `npm run build` | Type-check and build to `client/dist` |
| | `npm run preview` | Serve the production build locally |
| | `npm run lint` | ESLint |

### Troubleshooting

| Problem | Fix |
|---|---|
| `error in connecting mongodb` | Check `MONGODB_URI`, and add your IP in Atlas → **Network Access** (or allow `0.0.0.0/0` while developing) |
| `Redis client error: connect ECONNREFUSED` | Redis isn't running. Start the Docker container from step 3, or check `REDIS_URL` |
| `Transaction numbers are only allowed on a replica set` | You're using a standalone local MongoDB. Use Atlas, or start `mongod` as a replica set |
| Frontend shows network errors | `VITE_API_BASE_URL` must point at the running API. Restart `npm run dev` after editing `client/.env` |
| CORS error in the browser console | `CLIENT_URL` in `server/.env` must exactly match the frontend URL, including the port |
| Port 5000 already in use on macOS | AirPlay Receiver uses it. Keep the API on 3000, or turn AirPlay Receiver off in System Settings |
| OTP email never arrives | `EMAIL_PASS` must be a Gmail **App Password**. Check spam too; the API logs a mail error if sending fails |
| Payment form doesn't load | `VITE_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY` must both be test-mode keys from the same Stripe account |
| No showtimes | Run `npm run seed`, or give a cinema some movies. The auto-scheduler fills the week when the API starts |

---

## Deployment

| Part | Host | Settings |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Root directory `client`, build `npm run build`, output `dist`. Env: `VITE_API_BASE_URL` (your API URL + `/api/v1`), `VITE_STRIPE_PUBLISHABLE_KEY`. `client/vercel.json` handles SPA routing |
| API | [Render](https://render.com) web service | Root directory `server`, build `npm ci`, start `npm start`, health check `/health`. Env: everything from `server/.env`, with `CLIENT_URL` set to the Vercel URL |
| Redis | [Upstash](https://upstash.com) | Copy the `rediss://` URL into `REDIS_URL` |
| Database | MongoDB Atlas | Allow Render's outbound IPs (or `0.0.0.0/0`) in Network Access |

The API needs a long-running process for WebSockets, so it can't run as Vercel serverless functions. On Render's free tier the service sleeps when idle; a pinger such as UptimeRobot hitting `/health` keeps it awake.


## Testing

```bash
cd server && npm test
```

The suite runs against a real in-memory MongoDB replica set, so transactions behave the same as in production. It covers concurrent seat claims, payment confirmation, cancellations and refunds, the wallet and payouts, Prime, coupons, theatre ownership, seat layouts and pricing rules, support tickets, the audit log and the auto-scheduler. CI runs it on every push and pull request.

Load tests for the movie list endpoint live in [`k6/`](k6). Locally, the Redis cache cut p95 latency from **588 ms to 57 ms** under an 80/20 hit/miss mix, with zero errors.

---

## API reference

Base path `/api/v1`. 🔓 public · 👤 signed in · 🎬 cinema owner or admin · 🛡 admin.

<details>
<summary><b>Auth & account</b></summary>

| | Endpoint | |
|---|---|---|
| `POST` | `/auth/signup` · `/auth/verify-otp` · `/auth/resend-otp` · `/auth/signin` | 🔓 rate-limited |
| `PATCH` | `/auth/reset` · `/users/profile` · `/users/change-password` | 👤 |
| `GET` `PATCH` `DELETE` | `/users` · `/users/:id` | 🛡 |

</details>

<details>
<summary><b>Movies & reviews</b></summary>

| | Endpoint | |
|---|---|---|
| `GET` | `/movies` · `/movies/:id` (Redis-cached) · `/movies/:id/similar` | 🔓 |
| `POST` `PATCH` `DELETE` | `/movies` · `/movies/:id` · `/movies/:id/status` | 🛡 |
| `GET` | `/movies/:movieId/reviews` · `/reviews/top` | 🔓 |
| `GET` `POST` `PATCH` `DELETE` | `/movies/:movieId/reviews/my` · `/reviews` · `/reviews/:id` · `/reviews/:id/like` | 👤 |

</details>

<details>
<summary><b>Theatres & shows</b></summary>

| | Endpoint | |
|---|---|---|
| `GET` | `/theatres` · `/theatres/cities` · `/theatres/:id` · `/theatres/:id/movies` · `/theatres/:id/reviews` | 🔓 |
| `GET` `PUT` `DELETE` | `/theatres/:id/reviews/me` (verified visit) | 👤 |
| `POST` `PATCH` | `/theatres` · `/theatres/:id` · `/theatres/:id/movies` · `/theatres/:id/status` | 🎬 own only |
| `GET` | `/shows` · `/shows/:id` | 🔓 |
| `POST` `PATCH` `DELETE` | `/shows` · `/shows/bulk` · `/shows/:id` · `/shows/:id/status` | 🎬 own only |

</details>

<details>
<summary><b>Bookings & payments</b></summary>

| | Endpoint | |
|---|---|---|
| `POST` | `/bookings/quote` · `/bookings/initiate` · `/bookings/confirm` · `/bookings/cancel` | 👤 |
| `GET` | `/bookings/my` · `/bookings/:id` · `/bookings/:id/refund-quote` | 👤 |
| `GET` `POST` | `/bookings/owner` · `/bookings/check-in` | 🎬 |
| `GET` | `/bookings` | 🛡 |
| `GET` | `/offers` | 🔓 |
| `GET` `POST` `PATCH` `DELETE` | `/coupons` · `/coupons/:id` | 🛡 |

</details>

<details>
<summary><b>Prime, wallet & gift cards</b></summary>

| | Endpoint | |
|---|---|---|
| `GET` | `/prime/plan` | 🔓 |
| `GET` `POST` | `/prime/me` · `/prime/subscribe` · `/prime/confirm` | 👤 |
| `GET` `POST` | `/wallet` · `/wallet/redeem` | 👤 |
| `GET` `POST` | `/gift-cards/mine` · `/gift-cards/purchase` · `/gift-cards/confirm` | 👤 |

</details>

<details>
<summary><b>Watchlist, notifications & support</b></summary>

| | Endpoint | |
|---|---|---|
| `GET` `POST` `PUT` `DELETE` | `/me/watchlist` · `/me/watchlist/movies` · `/me/watchlist/merge` · `/me/watchlist/:movieId` | 👤 |
| `PUT` `DELETE` | `/me/notify/:movieId` | 👤 |
| `GET` `PATCH` | `/notifications` · `/notifications/read-all` · `/notifications/:id/read` | 👤 |
| `GET` `POST` `PATCH` | `/support` · `/support/mine` · `/support/:id` | 👤 (list all: 🛡) |

</details>

<details>
<summary><b>Operations</b></summary>

| | Endpoint | |
|---|---|---|
| `GET` | `/stats` | 🔓 |
| `GET` | `/payouts` | 🎬 |
| `GET` | `/audit-logs` | 🛡 |
| `POST` | `/upload/image` | 🔓 optional sign-in |
| `POST` | `/upload/video` | 🛡 |
| `DELETE` | `/upload/:publicId` | 👤 |
| `GET` | `/health` (no prefix) | 🔓 |

</details>

---

## Project structure

```
├── client/                    React + TypeScript SPA
│   ├── public/images/         Bundled stock photos (cinema, food) — see /credits
│   └── src/
│       ├── api/               Axios client, one module per resource
│       ├── components/        booking/ · dashboard/ · home/ · movies/ · common/
│       ├── context/           Auth, Socket, City, Theme
│       ├── pages/             Route-level screens (lazy-loaded)
│       └── utils/             Seat layout, fees, calendar, image fallbacks
├── server/                    Express API
│   ├── controllers/  routes/  middlewares/  validations/
│   ├── services/              Business logic: booking, pricing, payouts, auto-scheduler…
│   ├── models/                Mongoose schemas and indexes
│   ├── socket.js              Live seat map (Socket.io + Redis)
│   ├── seed/                  Demo catalogue (npm run seed)
│   └── tests/                 Vitest integration tests
├── k6/                        Load-test scripts
└── docker-compose.yml         Server + client + Redis
```

---

## Engineering notes

**Atomic seat claims.** The booking only goes through if none of the requested seats is already taken, checked and written in a single update inside a transaction:

```js
const show = await Show.findOneAndUpdate(
  { _id: showId, bookedSeats: { $not: { $elemMatch: { $in: seats } } } },
  { $push: { bookedSeats: { $each: seats } } },
  { session, new: true },
);
if (!show) throw { err: "Seats already taken", code: 409 };
```

**Seat holds without timers.** A held seat is a Redis key with a 10-minute expiry, so holds survive restarts and are shared across instances. A 5-minute cron cancels unpaid bookings as a backstop.

**Cache invalidation by version.** Movie list responses are cached under a version number. Any movie write bumps the version, which retires every cached filter combination at once without scanning keys.

**Price snapshots.** A show copies its screen's seat layout and tier prices when it's scheduled. Later edits to a screen or pricing rule never reprice tickets that are already on sale.

**Bounded show data.** The auto-scheduler only fills screen-days that are empty, so hand-scheduled days are never touched. It deletes auto-created shows that ended over two days ago with no bookings, which keeps the `shows` collection at roughly *cinemas × screens × 5 × 10* documents.

---

## Contributing

Contributions are welcome, from typo fixes to new features.

### Workflow

1. **Fork** the repo (or create a branch if you have write access), then sync with `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/short-description
   ```
2. **Name the branch** by type: `feat/…` new feature · `fix/…` bug fix · `docs/…` documentation · `refactor/…` · `test/…` · `chore/…` tooling.
3. **Make your change** and keep it focused. One feature or fix per pull request is much easier to review.
4. **Run the checks** before pushing. CI runs the server tests on every PR:
   ```bash
   cd server && npm test
   cd ../client && npm run lint && npm run build
   ```
5. **Commit** using [Conventional Commits](https://www.conventionalcommits.org):
   ```
   feat(booking): show refund preview before cancelling
   fix(seat-map): release held seats when the socket disconnects
   docs: add troubleshooting for Atlas network access
   ```
6. **Push and open a pull request** against `main`:
   ```bash
   git push -u origin feat/short-description
   ```
   In the description, say what changed, why, and how you tested it. Add screenshots for UI changes and link the issue it closes (`Closes #12`).

### Pull request checklist

- [ ] `npm test` passes in `server/`
- [ ] `npm run lint` and `npm run build` pass in `client/`
- [ ] New server logic has a test in `server/tests/services/`
- [ ] New environment variables are added to the matching `.env.example` and to this README
- [ ] UI works in light and dark themes and at phone width
- [ ] No secrets, `.env` files or `node_modules` in the diff

### Code conventions

- **Server layers:** a route adds validation (`validations/*.js`, Zod) and auth/ownership middleware, the controller only handles HTTP, and business logic goes in `services/` so it can be tested directly. Throw `{ err, code }` objects for expected errors.
- **Money and rules stay on the server.** Prices, refunds and fees are computed in `services/pricing.service.js` and `utils/refundPolicy.js`. The client only displays them.
- **Client:** TypeScript with no `any`. Shared types go in `src/types`, API calls in `src/api`, and each component keeps its CSS file next to it. Use the theme tokens in `src/styles/global.css` instead of hard-coded colours.
- **Match the surrounding code:** naming, comment style and file layout.

### Reporting bugs and ideas

Open an [issue](https://github.com/AmanBhaskar16/Ticket-Booking-Platform/issues) with steps to reproduce, what you expected, what happened, and screenshots or logs if you have them. For security problems, please contact the maintainer privately instead of opening a public issue.

---

## Roadmap

- [ ] Authenticate Socket.io connections with the JWT
- [ ] Structured JSON logging
- [ ] HTTP-level tests for auth and catalogue routes
- [ ] Private-network Redis in production to cut cache latency

---

<div align="center">

MIT © [Aman Bhaskar](https://github.com/AmanBhaskar16) · IIIT Ranchi

[LinkedIn](https://linkedin.com/in/aman-bhaskar-1086a9269) · [GitHub](https://github.com/AmanBhaskar16) · [LeetCode](https://leetcode.com/u/Aman_Bhaskar16/)

</div>
