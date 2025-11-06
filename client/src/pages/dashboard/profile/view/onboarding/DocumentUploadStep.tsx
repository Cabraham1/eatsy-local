import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Upload, Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { OnboardingFormValues } from "./types";

interface DocumentUploadStepProps {
  form: UseFormReturn<OnboardingFormValues>;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const DocumentUploadStep = ({
  form,
  selectedFile,
  onFileChange,
  onBack,
  isSubmitting,
}: DocumentUploadStepProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="id_document"
        render={() => (
          <FormItem>
            <FormLabel>ID Document</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-4">
                <label
                  htmlFor="id-upload"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors hover:border-orange-500 hover:bg-orange-50"
                >
                  <Upload className="mb-2 h-8 w-8 text-gray-400" />
                  <p className="mb-1 text-sm font-medium">
                    {selectedFile ? selectedFile.name : "Click to upload ID document"}
                  </p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                  <input
                    id="id-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={onFileChange}
                  />
                </label>
              </div>
            </FormControl>
            <FormDescription>
              Upload a valid government-issued ID (Passport, Driver&apos;s License, or National ID)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </div>
  );
};

