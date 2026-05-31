# MedTrack

## Overview

**MedTrack** is a **Next.js + TypeScript** web application for managing medication schedules and tracking adherence over time. It supports authenticated users, stores medication plans and daily dose logs, and exposes API endpoints for dose tracking and dashboard analytics (daily adherence, weekly summary, and adherence streaks).

---

## Key Features

- **Medication management**
  - Add and remove medications with a dosage and scheduled times.
  - Medication schedules are used to generate dose slots and logs.

- **Dose tracking**
  - API-driven dose logging for a given date (defaults to today).
  - Automatically creates missing doseLog entries for scheduled doses.
  - Allows users to **mark doses as taken** (sets `status = TAKEN` and `takenAt`).

- **Adherence dashboard**
  - Computes **daily adherence** for the **last 7 days**.
  - Produces a **weekly summary** aggregation.
  - Calculates a current **adherence streak**.

- **Auth-protected workspace**
  - Protected pages require a valid session (`requirePageSession()`).
  - Uses **NextAuth** for authentication flows (Next.js API route at `api/auth/[...nextauth]`).
  - Login redirects authenticated users to `/`.

- **Privacy & compliance pages**
  - Includes **Privacy Policy** and **Terms of Service** pages.

---

## Tech Stack

- **Next.js (App Router)** + **React**
- **TypeScript**
- **NextAuth** (authentication)
- **Prisma** (Postgres adapter + Prisma client)
- **dotenv** (environment variable support)
- **Tailwind CSS** (styling)
- UI/visual utilities:
  - `lucide-react`
  - `recharts` (charts used in adherence/dashboard views)
- Version pinning:
  - Uses `pnpm.overrides` to lock certain dependency versions (e.g., `@hono/node-server`, `postcss`, `uuid`)

---

## Project Architecture

### 1) Type System (`src/types/index.ts`)

Centralized shared domain types for medication/adherence logic:

- **MedicationInput**
  - `name`, `dosage`, `times`
- **DoseStatus**
  - `PENDING`, `TAKEN`, `MISSED`
- **Medication**
  - Extends `MedicationInput` with `id` and `createdAt`
- **DoseLogWithMedication**
  - Represents a logged dose tied to a medication:
    - schedule fields (e.g., date/time slot)
    - `status`
    - optional `takenAt`
    - timestamps
    - embedded `medication`
- **DailyAdherencePoint**
  - Summarizes per-day metrics:
    - `date`, `label`
    - totals and counts (including taken count)
    - computed `percentage`

### 2) App Shell & Global Styling

- **Root Layout**: `src/app/layout.tsx`
  - Defines global metadata (title/description).
  - Loads Google fonts:
    - Inter (CSS variable)
    - Source Serif 4 (CSS variable)
  - Wraps pages with `<html>` / `<body>` and applies font classes.
  - Imports global CSS (`src/app/globals.css`).

- **Global Styles**: `src/app/globals.css`
  - Tailwind base/components/utilities import.
  - Theme variables for light/dark and semantic colors (including taken/due/missed states).
  - Consistent typography and focus styling.
  - Utility class for a serif display font.
  - Light/dark color scheme behavior via `prefers-color-scheme`.

### 3) Pages (App Router)

- **Home**: `src/app/page.tsx`
  - Requires session (`requirePageSession()`).
  - Renders:
    - `AppHeader`
    - `DoseSchedule` (primary dose scheduling UI)

- **Dashboard**: `src/app/dashboard/page.tsx`
  - Requires session.
  - Renders `AppHeader` and `DashboardSummary` (last 7 days adherence overview).

- **Medications**: `src/app/medications/page.tsx`
  - Requires session.
  - Renders `AppHeader` and `MedicationManager` for adding/managing medication schedules.

- **Login**: `src/app/login/page.tsx`
  - Loads session via `getAppSession()`.
  - If authenticated, redirects to `/`.
  - Otherwise renders login UI with a `LoginButton`.

- **Privacy / Terms**
  - `src/app/privacy/page.tsx`: privacy policy UI with Google sign-in usage and data handling description.
  - `src/app/terms/page.tsx`: terms of service UI with purpose and "not medical advice" sections.

### 4) Server/API Routes

All API routes are Next.js route handlers under `src/app/api/...`.

#### Doses API: `src/app/api/doses/route.ts`

Implements `/api/doses` with:

- **Setup/auth checks**
  - Uses authenticated user email.
  - Returns:
    - **401** if missing auth
    - **setup-required** if DB isn't configured

- **GET**
  - Accepts optional `date` query param (defaults to today).
  - Validates date and enforces a **7-day before/after** window.
  - Loads user medications.
  - Computes scheduled dose slots for the requested date range.
  - Creates missing `doseLog` entries using `skipDuplicates`.
  - Returns all dose logs for the day (with medication details).

- **POST**
  - Parses input to identify the `doseLogId`.
  - Verifies the dose log belongs to the authenticated user.
  - Updates status to **TAKEN** and sets `takenAt = now`.
  - Returns updated dose log.
  - Errors:
    - **404** if dose log not found
    - **400** for validation/id issues

- **PATCH**
  - Not supported (**405**).

#### Dashboard API: `src/app/api/dashboard/route.ts`

Implements an authenticated GET endpoint for:

- **Auth/setup checks**
  - Unauthorized if not logged in.
  - **setup-required** if DB isn't configured.

- Queries dose logs from the **last 7 days** (start of today back 6 days).
- Computes and returns:
  - `daily` adherence points
  - `summary` weekly aggregation
  - `streak` current adherence streak

Returns JSON: `{ daily, summary, streak }`.

#### NextAuth: `src/app/api/auth/[...nextauth]/route.ts`

- Exposes NextAuth under `/api/auth/[...nextauth]`.
- Uses shared `authOptions`.
- Exports handler for both **GET** and **POST**.

#### Medications API

- **Collection**: `src/app/api/medications/route.ts` (`/api/medications`)
  - **GET**: fetches user medications ordered newest first.
  - **POST**: creates a medication for the authenticated user and returns **201**.
  - Auth/setup checks performed similarly to other routes.

- **Item Delete**: `src/app/api/medications/[id]/route.ts` (`/api/medications/:id`)
  - Authenticates with `getApiUserEmail()`.
  - Returns **401** if not logged in.
  - Enforces ownership by deleting where both `id` and `userEmail` match.
  - Returns **404** if not found.
  - Returns `{ ok: true }` on success.

---

## Installation

> Note: Exact package manager is inferred from the presence of `pnpm.overrides`; scripts are described as npm/pnpm-compatible.

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   - Create a `.env` file with required values (e.g., database connection and auth credentials).
   - The app includes checks for whether the database is configured; if it isn't, APIs respond with `setup-required`.

3. **Generate Prisma client and run the app**

   ```bash
   pnpm run dev
   ```

---

## Usage

### Development

Start the dev server:

```bash
pnpm run dev
```

Runs: `next dev`

### Build

Generates Prisma client and builds:

```bash
pnpm run build
```

Runs: `prisma generate && next build`

### Start Production

```bash
pnpm run start
```

Runs: `next start`

### Lint/Type Check

```bash
pnpm run typecheck
```

Runs: `tsc --noEmit`

### Prisma (database + client)

The project includes helper scripts for:

- Prisma client generation (`prisma generate`)
- Database migration commands (available via the repo's Prisma-related scripts)

---

## API Endpoints (Summary)

- `GET /api/doses?date=YYYY-MM-DD`  
  Returns dose logs and ensures missing scheduled logs exist. Limited to a 7-day before/after window.

- `POST /api/doses`  
  Marks a dose as taken (`status = TAKEN`) and sets `takenAt`.

- `GET /api/dashboard`  
  Returns `{ daily, summary, streak }` for last 7 days (auth-protected).

- `GET /api/medications`  
  Lists user medications.

- `POST /api/medications`  
  Creates a medication.

- `DELETE /api/medications/:id`  
  Deletes the medication belonging to the authenticated user.

---

*This README was generated with [PresentMe](https://www.presentmeapp.xyz/). View the full presentation [here](https://www.presentmeapp.xyz/p/727b60ee-9266-43b7-af62-8d605ce5d7bf).*
