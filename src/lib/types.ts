export type FuelLog = { id: string; vehicleId: string; liters: number; cost: number; date: string };
export type Expense = { id: string; vehicleId: string; category: 'Toll' | 'Misc'; cost: number; date: string };
export type Vehicle = { id: string; name: string; kmDriven: number; revenue: number; utilization: number };
