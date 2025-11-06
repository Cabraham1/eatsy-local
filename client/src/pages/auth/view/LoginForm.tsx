import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema } from "@shared/schema";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { TLoginFormValues } from "@/types/auths";

interface LoginFormProps {
  onForgotPassword?: () => void;
}

export const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const { toast } = useToast();
  const { loginMutation } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: TLoginFormValues) => {
    await loginMutation.mutateAsync(values);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
                      placeholder="Enter your password"
                      {...field}
                      autoComplete="current-password"
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

          {onForgotPassword && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? (
              <span className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6">
        <Separator />
        <p className="my-4 text-center text-sm text-gray-500">Or continue with</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            type="button"
            onClick={() => toast({ title: "Social login coming soon" })}
          >
            <img
              className="max-w-[15%]"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
              alt="Google Logo"
            />
            Google
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            type="button"
            onClick={() => toast({ title: "Social login coming soon" })}
          >
            <img
              className="max-w-[15%]"
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-original.svg"
              alt="Facebook Logo"
            />
            Facebook
          </Button>
        </div>
      </div>
    </>
  );
};
