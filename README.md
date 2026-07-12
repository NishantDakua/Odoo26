# 🌍 TransitOps
**Next-Generation Live Transport & Operations Platform**

Welcome to **TransitOps**! This isn't just a spreadsheet replacement—it's a fully-fledged, real-time logistics and transport management platform. 

We built TransitOps to solve the chaos of fleet management. By combining live cargo tracking via **Cesium JS** with robust analytics, strict safety compliance, and beautiful modern UI, we give logistics companies total visibility and control over their assets.

---

## ✨ What Makes TransitOps Special?

* **🛰️ Live Cargo Tracking:** Watch your fleet move in real-time across a 3D globe powered by **Cesium JS**. No more guessing where a shipment is.
* **🔒 Fort-Knox Security:** 
  * Advanced Role-Based Access Control (RBAC).
  * Secure credential management with mandatory password change flows.
  * **Smart Lockouts:** Exceeding password limits automatically triggers a 20-minute pause on login activities to prevent brute-force attacks.
* **🛡️ Built-in Compliance:** The system is smart. If a driver's license is expired, or if a vehicle is in the shop, the system physically blocks them from being assigned to a new trip. 
* **📊 Deep Financial Analytics:** Track fuel efficiency (km/L), operational costs, fleet utilization, and ROI in real-time with beautiful charts.
* **🚦 Safety First:** Every driver has a calculated safety score based on their history, ensuring only the best handle your most precious cargo.

---

## 👥 Meet the Users (Role-Based Access)

TransitOps is built around specialized roles, ensuring users only see what they need to see:

### 👑 The Super Admin
The eye in the sky. The Super Admin monitors the entire platform, provisions new accounts, assigns roles, and resets credentials. 

### 🚚 The Driver
The heartbeat of the operation. Drivers can log in to create trips, assign themselves to available vehicles, and monitor their active deliveries and route assignments. 

### 🦺 The Safety & Fleet Manager
Ensures the fleet stays moving safely. They manage driver licenses, monitor driver safety scores, and handle vehicle maintenance logs. 

### 📈 The Financial Analyst
Focuses on the bottom line. They monitor the analytics dashboard, tracking fuel logs, miscellaneous expenses, toll costs, and overall vehicle profitability.

---

## 🛠️ Under the Hood (Tech Stack)

We've built TransitOps using a modern, scalable stack designed for speed and developer happiness:
* **Core:** Next.js 14 (App Router) with React 18
* **Mapping & 3D:** Cesium JS (for live cargo tracking)
* **Styling:** Tailwind CSS (v3) for beautiful, responsive components
* **Charts:** Recharts for financial and operational dashboards
* **Database & ORM:** PostgreSQL + Prisma
* **State & Forms:** Custom generic CRUD components with React Hooks

---

## 🚀 Getting Started Locally

Want to take it for a spin on your own machine? Here is how to get the engine running.

### 1. Environment Setup
Make sure you have Node.js and a PostgreSQL instance running. Copy the sample environment file:
```bash
cp .env.example .env
```
Ensure your `.env` has your database and auth secrets:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/transitops?schema=public"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install & Run
```bash
# Install the dependencies
npm install 

# Push the database schema
npx prisma db push

# Start the dev server
npm run dev
```

Visit `http://localhost:3000` to access the dashboard!

---
*Built to keep the world moving smoothly. 🌍🚚💨*
