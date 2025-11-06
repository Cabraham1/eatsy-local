import { useState } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { ApiClientError } from "@/lib/constants/api-client";

const registerSchema = z.object({
  firstName: z.string({
    message: "First name is required",
  }),
  middleName: z.string().optional(),
  lastName: z.string({
    message: "Last name is required",
  }),
  username: z.string({
    message: "Username must is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),

  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onShowOtpVerification: (email: string) => void;
}

interface InsertUser {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
}

export function RegisterForm({ onShowOtpVerification }: RegisterFormProps) {
  const { registerMutation, resendOtpMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const registrationData: InsertUser = {
      username: values.username,
      email: values.email,
      password: values.password,
      first_name: values.firstName,
      last_name: values.lastName,
    };

    // Only include middle_name if it's not empty
    if (values.middleName && values.middleName.trim()) {
      registrationData.middle_name = values.middleName;
    }

    try {
      await registerMutation.mutateAsync(registrationData);
      setPendingEmail(null);
    } catch (error: unknown) {
      if (error instanceof ApiClientError) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("email") &&
          (errorMessage.includes("exist") || errorMessage.includes("already"))
        ) {
          setPendingEmail(values.email);
        }
      }
    }
  };

  const handleVerifyExistingEmail = async () => {
    if (pendingEmail) {
      try {
        await resendOtpMutation.mutateAsync({ email: pendingEmail });
        onShowOtpVerification(pendingEmail);
        setPendingEmail(null);
      } catch (error) {
        // Error is handled in the mutation
      }
    }
  };

  return (
    <>
      {pendingEmail && (
        <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 p-4">
          <p className="mb-3 text-sm text-orange-800">
            This email is already registered. Click below to receive a new OTP code.
          </p>
          <Button
            type="button"
            onClick={handleVerifyExistingEmail}
            variant="default"
            className="w-full"
            disabled={resendOtpMutation.isPending}
          >
            {resendOtpMutation.isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </span>
            ) : (
              "Send OTP & Verify"
            )}
          </Button>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Middle Name <span className="text-xs text-gray-500">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Middle name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    {...field}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} autoComplete="username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 8 characters)"
                        {...field}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword ? (
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
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
