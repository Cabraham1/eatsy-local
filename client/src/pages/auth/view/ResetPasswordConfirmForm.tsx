import { useState, useRef, useEffect } from "react";
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
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

const resetPasswordConfirmSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don&apos;t match",
    path: ["confirmPassword"],
  });

type ResetPasswordConfirmFormValues = z.infer<typeof resetPasswordConfirmSchema>;

interface ResetPasswordConfirmFormProps {
  email: string;
  onSubmit: (otp: string, newPassword: string) => Promise<void>;
  onBack: () => void;
  onResendOtp: () => Promise<void>;
  isLoading: boolean;
  isResending: boolean;
}

export const ResetPasswordConfirmForm = ({
  email,
  onSubmit,
  onBack,
  onResendOtp,
  isLoading,
  isResending,
}: ResetPasswordConfirmFormProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<ResetPasswordConfirmFormValues>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    form.setValue("otp", newOtp.join(""));

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    form.setValue("otp", newOtp.join(""));

    const nextEmptyIndex = newOtp.findIndex((digit) => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (values: ResetPasswordConfirmFormValues) => {
    await onSubmit(values.otp, values.newPassword);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-center text-2xl font-bold">Reset Your Password</h2>
        <p className="text-center text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to{" "}
          <span className="font-semibold text-foreground">{email}</span> and your new password
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* OTP Input */}
          <FormField
            control={form.control}
            name="otp"
            render={() => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="h-12 w-12 text-center text-lg font-semibold"
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password (min. 8 characters)"
                      {...field}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      {...field}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>

          <div className="space-y-2">
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onResendOtp}
              disabled={isResending}
            >
              {isResending ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending OTP...
                </span>
              ) : (
                "Resend OTP"
              )}
            </Button>

            <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
