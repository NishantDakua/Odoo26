# TransitOps

A transport operations platform built with Next.js 14, TypeScript, Prisma ORM, PostgreSQL, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3.3
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS 3.4.1
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database connection string.

3. Run Prisma migrations:
```bash
pnpm prisma:migrate
```

4. (Optional) Seed the database:
```bash
pnpm prisma:seed
```

### Development

Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm prisma:migrate` - Run database migrations
- `pnpm prisma:seed` - Seed the database
- `pnpm prisma:studio` - Open Prisma Studio

## Project Structure

```
/src
  /app
    /(auth)           # Authentication pages
    /(dashboard)      # Dashboard pages
    /api              # API routes
  /components
    /ui               # Reusable UI components
    /layout           # Layout components
    /forms            # Form components
  /modules            # Feature modules
  /lib                # Utilities and helpers
  /hooks              # React hooks
  /types              # TypeScript types
/prisma
  schema.prisma       # Database schema
  seed.ts             # Database seed script
```

## Features

- **Dashboard:** Overview with KPIs, recent trips, and vehicle status
- **Fleet Management:** Track vehicles, status, and maintenance
- **Driver Management:** Manage driver information and assignments
- **Trip Dispatch:** Create and manage trips
- **Maintenance Tracking:** Log and track vehicle maintenance
- **Fuel & Expenses:** Track fuel consumption and expenses
- **Analytics:** Operational insights and reports

## Database Schema

The schema includes:
- **User:** Authentication and RBAC (Fleet Manager, Dispatcher, Safety Officer, Financial Analyst)
- **Vehicle:** Fleet vehicles with status tracking
- **Driver:** Driver information and license management
- **Trip:** Trip planning and tracking
- **MaintenanceLog:** Vehicle maintenance records
- **FuelLog:** Fuel consumption tracking
- **Expense:** Additional expenses (tolls, misc)

## Status Color Conventions

- **Available:** Green (`#22c55e`)
- **On Trip:** Blue (`#3b82f6`)
- **In Shop/Maintenance:** Orange (`#f97316`)
- **Retired/Cancelled:** Red (`#ef4444`)
