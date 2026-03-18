interface StatusBadgeProps { status: string; }

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = String(status).toUpperCase();
  const cls = s === "APPROVED" ? "green" : s === "PENDING" ? "yellow" : "red";
  return <span className={`badge badge-${cls}`}>{status}</span>;
}