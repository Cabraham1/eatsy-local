import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { OItpVerificationFormProps } from "@/types/auths";

export const OtpVerificationForm = ({ email, mode, onBack }: OItpVerificationFormProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { verifyLoginOtpMutation, verifyRegistrationOtpMutation, resendOtpMutation } = useAuth();

  const verifyOtpMutation =
    mode === "login" ? verifyLoginOtpMutation : verifyRegistrationOtpMutation;

  useEffect(() => {
    if (verifyOtpMutation.isSuccess) {
      setOtp(["", "", "", "", "", ""]);
    }
  }, [verifyOtpMutation.isSuccess]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) return;

    await verifyOtpMutation.mutateAsync({
      email,
      otp: otpCode,
    });
  };

  const handleResendOtp = async () => {
    await resendOtpMutation.mutateAsync({ email });
  };

  const otpCode = otp.join("");
  const isOtpComplete = otpCode.length === 6;

  const title = mode === "login" ? "Verify Your Login" : "Verify Your Email";
  const backButtonText = mode === "login" ? "Back to Login" : "Back to Registration";

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a 6-digit verification code to
        </p>
        <p className="text-sm font-medium">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="h-12 w-12 text-center text-lg font-semibold"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isOtpComplete || verifyOtpMutation.isPending}
        >
          {verifyOtpMutation.isPending ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify OTP"
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <div className="text-center">
          <p className="mb-2 text-sm text-muted-foreground">Didn&apos;t receive the code?</p>
          <Button
            type="button"
            variant="link"
            className="h-auto p-0 text-primary"
            onClick={handleResendOtp}
            disabled={resendOtpMutation.isPending}
          >
            {resendOtpMutation.isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Resending...
              </span>
            ) : (
              "Resend OTP"
            )}
          </Button>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          {backButtonText}
        </Button>
      </div>
    </div>
  );
};
