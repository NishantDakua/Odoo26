import { FuelLog, Expense, Vehicle } from './types';

export const vehicles: Vehicle[] = [
  { id: 'V001', name: 'Bus 001', kmDriven: 4200, revenue: 185000, utilization: 82 },
  { id: 'V002', name: 'Bus 002', kmDriven: 3800, revenue: 162000, utilization: 76 },
  { id: 'V003', name: 'Van 003', kmDriven: 2100, revenue: 74000, utilization: 61 },
  { id: 'V004', name: 'Bus 004', kmDriven: 4600, revenue: 201000, utilization: 90 },
];

export const fuelLogs: FuelLog[] = [
  { id: 'F001', vehicleId: 'V001', liters: 320, cost: 28800, date: '2026-05-04' },
  { id: 'F002', vehicleId: 'V002', liters: 290, cost: 26100, date: '2026-05-06' },
  { id: 'F003', vehicleId: 'V003', liters: 180, cost: 16200, date: '2026-05-10' },
  { id: 'F004', vehicleId: 'V004', liters: 350, cost: 31500, date: '2026-05-12' },
  { id: 'F005', vehicleId: 'V001', liters: 300, cost: 27000, date: '2026-06-04' },
  { id: 'F006', vehicleId: 'V004', liters: 340, cost: 30600, date: '2026-06-11' },
];

export const expenses: Expense[] = [
  { id: 'E001', vehicleId: 'V001', category: 'Toll', cost: 1200, date: '2026-05-05' },
  { id: 'E002', vehicleId: 'V002', category: 'Misc', cost: 3200, date: '2026-05-09' },
  { id: 'E003', vehicleId: 'V003', category: 'Toll', cost: 800, date: '2026-05-11' },
  { id: 'E004', vehicleId: 'V004', category: 'Misc', cost: 4500, date: '2026-05-15' },
  { id: 'E005', vehicleId: 'V001', category: 'Toll', cost: 1100, date: '2026-06-05' },
];

export const monthlyRevenue = [
  { month: 'Jan', revenue: 410000 },
  { month: 'Feb', revenue: 425000 },
  { month: 'Mar', revenue: 398000 },
  { month: 'Apr', revenue: 442000 },
  { month: 'May', revenue: 460000 },
  { month: 'Jun', revenue: 478000 },
];
