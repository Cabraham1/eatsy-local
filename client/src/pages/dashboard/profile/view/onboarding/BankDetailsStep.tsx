import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormValues } from "./types";

interface BankDetailsStepProps {
  form: UseFormReturn<OnboardingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

export const BankDetailsStep = ({ form, onNext, onBack }: BankDetailsStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="bank_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bank Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Access Bank" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="account_holder_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Holder Name</FormLabel>
            <FormControl>
              <Input placeholder="Full name as shown on bank account" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bank_account_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Number</FormLabel>
            <FormControl>
              <Input placeholder="Your bank account number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
};

