# 🚌✨ Welcome to TransitOps! 

Hello and welcome to **TransitOps**! This is our blazing-fast, 4-hour hackathon build for a comprehensive **Transport Operations Platform**. We've designed this project to be built in parallel by a 4-person team, ensuring no one blocks anyone else. 

Buckle up! Let's get this fleet on the road! 🚀

---

## 🛠️ Our Tech Stack
We are keeping it modern, scalable, and delightful to work with:
* **Framework:** Next.js 14 (App Router)
* **API:** Next.js API Routes (or Node/Express)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Styling:** Tailwind CSS (with beautiful shared design tokens! 🎨)
* **Charts:** Recharts / Chart.js

---

## 🏃‍♀️ Getting Started

Ready to spin up the garage? Follow these steps!

### 1. Prerequisites
Make sure you have `Node.js` (v18+) and your favorite package manager installed (we use `pnpm` or `npm`). You'll also need a running instance of **PostgreSQL**.

### 2. Environment Variables
Copy the example environment file and fill in your secrets:
```bash
cp .env.example .env
```
Make sure your `.env` looks a little something like this:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/transitops?schema=public"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install & Run
```bash
# Install all the goodies! 📦
npm install 

# Push the Prisma schema to your database 🗄️
npx prisma db push

# Seed the database with some realistic sample data 🌱
npm run prisma:seed

# Start the engine! 🏎️💨
npm run dev
```
Visit `http://localhost:3000` to see your fleet in action!

---

## 👯‍♀️ The Dream Team & Roles

To conquer the 4-hour hackathon, we split the app by **Role-Based Access Control (RBAC)**. Every person owns an entire vertical slice (Schema ➡️ API ➡️ UI). 

* 🧑‍🔧 **P1: The Fleet Manager** (Vehicle Registry & Maintenance)
* 🎧 **P2: The Dispatcher** (Dashboard & Trip Dispatcher)
* 🦺 **P3: The Safety Officer** (Auth/RBAC, Drivers, & Settings)
* 📈 **P4: The Financial Analyst** (Fuel & Expenses, Reports & Analytics)

---

## ⏱️ The 4-Hour Game Plan

### 🏁 Phase 0: Everyone Together (0:00 - 0:25)
*Nobody codes alone until the foundation is locked!*
* **Lock the Prisma Schema:** `User`, `Role`, `Vehicle`, `Driver`, `Trip`, `MaintenanceLog`, `FuelLog`, `Expense`.
* **Lock the Status Enums:** 
  * 🚙 *Vehicle:* Available, On Trip, In Shop, Retired
  * 🧑‍✈️ *Driver:* Available, On Trip, Off Duty, Suspended
  * 🗺️ *Trip:* Draft, Dispatched, Completed, Cancelled
  * 🔧 *Maintenance:* Active, Completed
* **API Contract Sign-off:** We agree on the JSON payloads for all cross-cutting endpoints.
* **Design Tokens:** Agree on colors (Green = Available/Completed, Blue = On Trip/Dispatched, etc.).

### 🏗️ Phase 1: Parallel Build (0:25 - 2:30)
Everyone retreats to their corners and builds their CRUD operations, UI, and logic using mock data. P3 builds Auth first so everyone can test protected routes!

### 🤝 Phase 2: Integration (2:30 - 3:15)
We come back together and wire it all up! We replace mock data with real API calls, integrate endpoints, merge our branches, and resolve any pesky conflicts. 

### 🐛 Phase 3: Bug Bash + Polish (3:15 - 3:45)
* Test a teammate's slice (fresh eyes catch bugs!).
* Ensure styling consistency.
* Verify our core business rules.

### 🚀 Phase 4: Demo Prep & Deploy (3:45 - 4:00)
One person deploys (Vercel/Render) while the rest prep the demo script using our seeded data (e.g., VAN-05, TRUCK-11).

---

## 🚨 Critical Business Rules (Do Not Cut!)
Even if time gets tight, these rules **must** work to ensure a safe and functional transit system:
1. **Unique Reg Numbers:** Every vehicle needs a unique registration.
2. **Safety First:** Vehicles "In Shop" or "Retired" are hidden from dispatch.
3. **Valid Licenses Only:** Expired or suspended drivers cannot be assigned to trips.
4. **Weight Limits:** Cargo weight cannot exceed vehicle capacity.
5. **Status Auto-Transitions:** Dispatching a trip automatically sets the vehicle and driver to "On Trip". Completing/Canceling sets them back to "Available".

---
*Built with ❤️ and a lot of caffeine! Happy routing!* 🚌✨
