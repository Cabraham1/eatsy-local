import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useChangePassword, useDeleteAccount } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/constants/queryClient";
import { Eye, EyeOff } from "lucide-react";
import { ApiClientError } from "@/lib/constants/api-client";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export const SecurityTab = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isLoading: isChangingPassword, changePassword } = useChangePassword();
  const { isLoading: isDeletingAccount, deleteAccount } = useDeleteAccount();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = (data: PasswordFormValues) => {
    changePassword(
      {
        old_password: data.currentPassword,
        new_password: data.newPassword,
      },
      {
        onSuccess: () => {
          passwordForm.reset();
          setShowCurrentPassword(false);
          setShowNewPassword(false);
          setShowConfirmPassword(false);
          toast({
            variant: "success",
            title: "Password changed",
            description: "Your password has been changed successfully.",
          });
        },
        onError: (error: Error) => {
          if (error instanceof ApiClientError) {
            const backendErrors = error.errors;

            if (backendErrors) {
              if (backendErrors.old_password) {
                passwordForm.setError("currentPassword", {
                  type: "manual",
                  message: backendErrors.old_password[0],
                });
              }

              if (backendErrors.new_password) {
                passwordForm.setError("newPassword", {
                  type: "manual",
                  message: backendErrors.new_password[0],
                });
              }
            } else {
              toast({
                title: "Password change failed",
                description: error.message || "An error occurred. Please try again.",
                variant: "destructive",
              });
            }
          }
        },
      }
    );
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm("Are you sure you want to delete your account? This action cannot be undone.")
    ) {
      deleteAccount(undefined, {
        onSuccess: () => {
          queryClient.clear();
          navigate("/");
          toast({
            title: "Account deleted",
            description: "Your account has been permanently deleted.",
          });
        },
        onError: (error: Error) => {
          toast({
            title: "Account deletion failed",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form className="space-y-6" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your current password"
                        type={showCurrentPassword ? "text" : "password"}
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showCurrentPassword ? (
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
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your new password"
                        type={showNewPassword ? "text" : "password"}
                        {...field}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {showNewPassword ? (
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
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm your new password"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
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
            <Button type="submit" className="w-full" disabled={isChangingPassword}>
              {isChangingPassword ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col items-start space-y-2 border-t pt-6">
        <h3 className="text-lg font-medium">Delete Account</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Once you delete your account, there is no going back. This action is permanent.
        </p>
        <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeletingAccount}>
          {isDeletingAccount ? "Deleting Account..." : "Delete Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};
