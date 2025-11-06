import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import { OnboardingFormValues } from "./types";

interface BioStepProps {
  form: UseFormReturn<OnboardingFormValues>;
  onNext: () => void;
}

export const BioStep = ({ form, onNext }: BioStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tell us about yourself</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Share your cooking experience, specialties, and what makes your food special..."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              {field.value.length}/500 characters (minimum 50)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="button" onClick={onNext} className="w-full">
        Continue
      </Button>
    </div>
  );
};

