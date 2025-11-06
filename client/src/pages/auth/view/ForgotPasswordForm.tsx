import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export const ForgotPasswordForm = ({ onSubmit, onBack, isLoading }: ForgotPasswordFormProps) => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    await onSubmit(values.email);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-center text-2xl font-bold">Reset Password</h2>
        <p className="text-center text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you an OTP to reset your password
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </span>
            ) : (
              "Send OTP"
            )}
          </Button>

          <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </form>
      </Form>
    </div>
  );
};
