# 🚌 TransitOps
**Smart Transport Operations Platform**

**Hackathon Duration:** 8 Hours  
**Objective:** Build an end-to-end transport operations platform that digitizes vehicle, driver, dispatch, maintenance, and expense management while enforcing business rules and providing operational insights.

---

## 1. 🏢 Business Context
Many logistics companies still rely on spreadsheets and manual logbooks to manage their transport operations. This often leads to scheduling conflicts, underutilized vehicles, missed maintenance, expired driver licenses, inaccurate expense tracking, and poor operational visibility.

**TransitOps** is a centralized platform that allows organizations to manage the complete lifecycle of their transport operations—from vehicle registration and driver management to dispatching, maintenance, fuel logging, and analytics.

---

## 2. 👥 Target Users
* **Fleet Manager:** Oversees fleet assets, maintenance, vehicle lifecycle, and operational efficiency.
* **Driver:** Creates trips, assigns vehicles and drivers, and monitors active deliveries.
* **Safety Officer:** Ensures driver compliance, tracks license validity, and monitors safety scores.
* **Financial Analyst:** Reviews operational expenses, fuel consumption, maintenance costs, and profitability.

---

## 3. ⚙️ Functional Requirements

### 3.1 Authentication
* Implement secure login using email and password.
* Support Role-Based Access Control (RBAC).
* Only authenticated users should access the application.

### 3.2 Dashboard
* Display KPIs such as Active Vehicles, Available Vehicles, Vehicles in Maintenance, Active Trips, Pending Trips, Drivers On Duty, and Fleet Utilization (%).
* Provide filters by vehicle type, status, and region.

### 3.3 Vehicle Registry
* Maintain a master list of vehicles with Registration Number (unique), Vehicle Name/Model, Type, Maximum Load Capacity, Odometer, Acquisition Cost, and Status.
* **Status values:** Available, On Trip, In Shop, Retired.

### 3.4 Driver Management
* Maintain driver profiles including Name, License Number, License Category, License Expiry Date, Contact Number, Safety Score, and Status.
* **Status values:** Available, On Trip, Off Duty, Suspended.

### 3.5 Trip Management
* Create trips by selecting a source, destination, available vehicle, available driver, cargo weight, and planned distance.
* **Trip lifecycle:** Draft → Dispatched → Completed → Cancelled.

### 3.6 Maintenance
* Create maintenance records for vehicles.
* Adding a vehicle to a "Maintenance Log" automatically switches its status to "In Shop", removing it from the Driver's selection pool.

### 3.7 Fuel & Expense Management
* Record fuel logs (liters, cost, date) and other expenses such as tolls or maintenance.
* Automatically compute total operational cost (Fuel + Maintenance) per vehicle.

### 3.8 Reports & Analytics
* Display Fuel Efficiency (Distance/Fuel), Fleet Utilization, Operational Cost, and Vehicle ROI `[(Revenue - (Maintenance + Fuel)) / Acquisition Cost]`.
* Support CSV export; PDF export is optional.

---

## 4. 🚨 Mandatory Business Rules
1. The vehicle registration number must be unique.
2. Retired or In Shop vehicles must never appear in the dispatch selection.
3. Drivers with expired licenses or Suspended status cannot be assigned to trips.
4. A driver or vehicle already marked On Trip cannot be assigned to another trip.
5. Cargo Weight must not exceed the vehicle's maximum load capacity.
6. Dispatching a trip automatically changes both the vehicle and driver status to **On Trip**.
7. Completing a trip automatically changes both the vehicle and driver status back to **Available**.
8. Cancelling a dispatched trip restores the vehicle and driver to **Available**.
9. Creating an active maintenance record automatically changes vehicle status to **In Shop**.
10. Closing maintenance restores the vehicle to **Available** (unless retired).

---

## 5. 🔄 Example Workflow
1. Register a vehicle 'Van-05' with a maximum capacity of 500 kg. Status = Available.
2. Register driver 'Alex' with a valid driving license.
3. Create a trip with Cargo Weight = 450 kg.
4. System validates that 450 kg ≤ 500 kg and allows dispatch.
5. Vehicle and Driver status automatically become **On Trip**.
6. Complete the trip by entering the final odometer and fuel consumed.
7. System marks both Vehicle and Driver as **Available**.
8. Create a maintenance record (e.g., Oil Change). Vehicle status automatically becomes **In Shop** and is hidden from dispatch.
9. Reports update operational cost and fuel efficiency based on the latest trip and fuel log.

---

## 6. 🗄️ Expected Database Entities
* Users
* Roles
* Vehicles
* Drivers
* Trips
* Maintenance Logs
* Fuel Logs
* Expenses

---

## 7. ✅ Mandatory Deliverables
* Responsive web interface
* Authentication with RBAC
* CRUD for Vehicles and Drivers
* Trip Management with validations
* Automatic status transitions
* Maintenance workflow
* Fuel & Expense tracking
* Dashboard with KPIs

---

## 8. 🌟 Bonus Features
* Charts and visual analytics
* PDF export
* Email reminders for expiring licenses
* Vehicle document management
* Search, filters, and sorting
* Dark mode

---

## 🚀 Getting Started (Dev Setup)

### 1. Prerequisites
Ensure you have `Node.js` (v18+) and your preferred package manager (`npm` or `pnpm`) installed. You will also need a running instance of **PostgreSQL**.

### 2. Environment Variables
Copy the example environment file and fill in your database credentials:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/transitops?schema=public"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install & Run
```bash
# Install dependencies
npm install 

# Push the Prisma schema to your database
npx prisma db push

# Start the development server
npm run dev
```
Visit `http://localhost:3000` to see the application!
