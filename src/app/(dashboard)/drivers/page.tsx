import DriverTable from '@/components/drivers/DriverTable';

export default function DriversPage() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
          Fleet Management
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: 0 }}>
          Drivers
        </h1>
      </div>
      <DriverTable />
    </div>
  );
}
