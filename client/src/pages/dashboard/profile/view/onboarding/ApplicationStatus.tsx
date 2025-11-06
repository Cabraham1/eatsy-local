import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import type { OnboardingStatusResponse } from "@/services/cook.service";

interface ApplicationStatusProps {
  onboardingStatus: OnboardingStatusResponse;
}

export const ApplicationStatus = ({ onboardingStatus }: ApplicationStatusProps) => {
  const status = onboardingStatus.verification_status;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cook Application Status</CardTitle>
            <CardDescription>Track your cook verification status</CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {status === "under_review" && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h3 className="mb-2 font-semibold text-blue-900">Application Under Review</h3>
              <p className="text-sm text-blue-800">
                Your application is currently being reviewed by our team. This usually takes 2-3 business days.
                We&apos;ll notify you once the review is complete.
              </p>
            </div>
          )}

          {status === "verified" && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h3 className="mb-2 font-semibold text-green-900">Congratulations! 🎉</h3>
              <p className="text-sm text-green-800">
                Your cook account has been verified. You can now start creating and selling your dishes!
              </p>
            </div>
          )}

          {status === "rejected" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="mb-2 font-semibold text-red-900">Application Rejected</h3>
              <p className="text-sm text-red-800">
                Unfortunately, your application was rejected.
              </p>
              <p className="mt-2 text-sm text-red-800">
                Please contact support for more information.
              </p>
            </div>
          )}

          {onboardingStatus?.id_document_url && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">ID Document</p>
              <a
                href={onboardingStatus.id_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                View Document →
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

