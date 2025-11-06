import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingStatus, useSubmitOnboarding } from "@/services/cook.service";
import { Loader2 } from "lucide-react";
import { queryClient } from "@/lib/constants/queryClient";
import { ApplicationStatus } from "./onboarding/ApplicationStatus";
import { ProgressIndicator } from "./onboarding/ProgressIndicator";
import { BioStep } from "./onboarding/BioStep";
import { BankDetailsStep } from "./onboarding/BankDetailsStep";
import { DocumentUploadStep } from "./onboarding/DocumentUploadStep";
import { onboardingFormSchema, type OnboardingFormValues } from "./onboarding/types";

const TOTAL_STEPS = 3;

export const OnboardingTab = () => {
  const { toast } = useToast();
  const { data: onboardingStatus, isLoading: isLoadingStatus } = useOnboardingStatus();
  const { isLoading: isSubmitting, submitOnboarding } = useSubmitOnboarding();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      bio: "",
      bank_account_number: "",
      bank_name: "",
      account_holder_name: "",
    },
  });

  const onSubmit = (data: OnboardingFormValues) => {
    const formData = new FormData();
    formData.append("bio", data.bio);
    formData.append("bank_account_number", data.bank_account_number);
    formData.append("bank_name", data.bank_name);
    formData.append("account_holder_name", data.account_holder_name);
    formData.append("id_document", data.id_document);

    submitOnboarding(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cook", "onboarding-status"] });
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        toast({
          title: "Application submitted",
          variant: "success",
          description: "Your cook application has been submitted successfully. We'll review it shortly.",
        });
        form.reset();
        setSelectedFile(null);
        setCurrentStep(1);
      },
      onError: (error: Error) => {
        toast({
          title: "Submission failed",
          description: error.message || "Failed to submit your application. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("id_document", file);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingFormValues)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["bio"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["bank_name", "account_holder_name", "bank_account_number"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  if (isLoadingStatus) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const status = onboardingStatus?.verification_status || "not_submitted";

  if (status !== "not_submitted" && onboardingStatus) {
    return <ApplicationStatus onboardingStatus={onboardingStatus} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Become a Cook</CardTitle>
        <CardDescription>Complete your cook profile to start selling your dishes</CardDescription>
        <ProgressIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && <BioStep form={form} onNext={nextStep} />}
            {currentStep === 2 && <BankDetailsStep form={form} onNext={nextStep} onBack={prevStep} />}
            {currentStep === 3 && (
              <DocumentUploadStep
                form={form}
                selectedFile={selectedFile}
                onFileChange={handleFileChange}
                onBack={prevStep}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
