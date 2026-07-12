type StatusBadgeProps = {
  status: string;
  variant?: "trip" | "vehicle" | "driver" | "maintenance";
};

const statusStyles = {
  trip: {
    DRAFT: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    DISPATCHED: "bg-status-ontrip/10 text-status-ontrip border-status-ontrip/20",
    COMPLETED: "bg-status-available/10 text-status-available border-status-available/20",
    CANCELLED: "bg-status-retired/10 text-status-retired border-status-retired/20",
  },
  vehicle: {
    AVAILABLE: "bg-status-available/10 text-status-available border-status-available/20",
    ON_TRIP: "bg-status-ontrip/10 text-status-ontrip border-status-ontrip/20",
    IN_SHOP: "bg-status-inshop/10 text-status-inshop border-status-inshop/20",
    RETIRED: "bg-status-retired/10 text-status-retired border-status-retired/20",
  },
  driver: {
    AVAILABLE: "bg-status-available/10 text-status-available border-status-available/20",
    ON_TRIP: "bg-status-ontrip/10 text-status-ontrip border-status-ontrip/20",
    OFF_DUTY: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    SUSPENDED: "bg-status-retired/10 text-status-retired border-status-retired/20",
  },
  maintenance: {
    ACTIVE: "bg-status-inshop/10 text-status-inshop border-status-inshop/20",
    COMPLETED: "bg-status-available/10 text-status-available border-status-available/20",
  },
};

export function StatusBadge({ status, variant = "trip" }: StatusBadgeProps) {
  const styles = statusStyles[variant];
  const style = styles[status as keyof typeof styles] || "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
