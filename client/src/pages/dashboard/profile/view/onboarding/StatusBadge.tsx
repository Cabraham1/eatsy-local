import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import type { VerificationStatus } from "@/services/cook.service";

interface StatusBadgeProps {
  status: VerificationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    not_submitted: {
      icon: AlertCircle,
      label: "Not Submitted",
      className: "bg-gray-100 text-gray-800",
    },
    under_review: {
      icon: Clock,
      label: "Under Review",
      className: "bg-blue-100 text-blue-800",
    },
    verified: {
      icon: CheckCircle,
      label: "Verified",
      className: "bg-green-100 text-green-800",
    },
    rejected: {
      icon: XCircle,
      label: "Rejected",
      className: "bg-red-100 text-red-800",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.className}`}>
      <Icon className="h-4 w-4" />
      {config.label}
    </div>
  );
};

