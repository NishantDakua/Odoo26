import { FuelLog, Expense, Vehicle } from './types';

export function opCostByVehicle(fuelLogs: FuelLog[], expenses: Expense[], vehicles: Vehicle[]) {
  return vehicles.map(v => {
    const fuel = fuelLogs.filter(f => f.vehicleId === v.id).reduce((s, f) => s + f.cost, 0);
    const exp = expenses.filter(e => e.vehicleId === v.id).reduce((s, e) => s + e.cost, 0);
    return { ...v, fuelCost: fuel, expenseCost: exp, totalCost: fuel + exp };
  });
}

export function fleetKPIs(fuelLogs: FuelLog[], expenses: Expense[], vehicles: Vehicle[]) {
  const costs = opCostByVehicle(fuelLogs, expenses, vehicles);
  const totalCost = costs.reduce((s, c) => s + c.totalCost, 0);
  const totalRevenue = vehicles.reduce((s, v) => s + v.revenue, 0);
  const totalKm = vehicles.reduce((s, v) => s + v.kmDriven, 0);
  const totalLiters = fuelLogs.reduce((s, f) => s + f.liters, 0);
  const avgUtilization = vehicles.length ? vehicles.reduce((s, v) => s + v.utilization, 0) / vehicles.length : 0;

  return {
    fuelEfficiency: totalLiters ? +(totalKm / totalLiters).toFixed(2) : 0,
    fleetUtilization: +avgUtilization.toFixed(1),
    opCost: totalCost,
    roi: totalCost ? +(((totalRevenue - totalCost) / totalCost) * 100).toFixed(1) : 0,
    costsByVehicle: costs.sort((a, b) => b.totalCost - a.totalCost),
  };
}
