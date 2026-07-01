import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  processing_failed: "border-slate-200 bg-slate-50 text-slate-700",
};

const statusLabels: Record<string, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  processing: "Processing",
  processing_failed: "Processing",
};

export function getStatusLabel(status?: string) {
  return statusLabels[status || "processing"] || status?.replace(/_/g, " ") || "Processing";
}

export default function StatusBadge({
  status,
  className,
}: {
  status?: string;
  className?: string;
}) {
  const normalized = status || "processing";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize tracking-normal",
        statusStyles[normalized] || statusStyles.processing,
        className,
      )}
    >
      {getStatusLabel(normalized)}
    </span>
  );
}
