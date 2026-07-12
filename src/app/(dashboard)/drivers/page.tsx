import DriverTable from '@/components/drivers/DriverTable';

export default function DriversPage() {
  return (
    <div className="px-8 py-7">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900 dark:text-white">Drivers</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage fleet drivers, licenses, and safety scores.
        </p>
      </div>
      <DriverTable />
    </div>
  );
}
