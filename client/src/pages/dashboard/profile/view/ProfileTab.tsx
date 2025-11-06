import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Edit, Check, X } from "lucide-react";
import { useUpdateProfile } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/constants/queryClient";
import { User } from "@shared/schema";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { formatDate } from "@/utils/date";

const profileFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  middleName: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ExtendedUser extends Partial<User> {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  phone?: string;
  fullName?: string;
  username?: string;
  email?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  role?: string;
  is_active?: boolean;
  is_premium?: boolean;
  two_fa_enabled?: boolean;
  date_joined?: string;
  created_at?: string;
}

interface ProfileTabProps {
  user: ExtendedUser;
}

export const ProfileTab = ({ user }: ProfileTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { isLoading, updateProfile } = useUpdateProfile();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      middleName: user?.middle_name || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        middleName: user.middle_name || "",
        phone: user.phone || "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    updateProfile(
      {
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName,
        phone: data.phone,
      },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({ queryKey: ["auth", "me"] });
          setIsEditing(false);
          toast({
            variant: "success",
            title: "Profile updated",
            description: "Your profile has been updated successfully.",
          });
        },
        onError: (error: Error) => {
          toast({
            title: "Update failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                profileForm.reset({
                  firstName: user.first_name || "",
                  lastName: user.last_name || "",
                  middleName: user.middle_name || "",
                  phone: user.phone || "",
                });
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={profileForm.handleSubmit(onProfileSubmit)}
              disabled={isLoading}
            >
              <Check className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Form {...profileForm}>
          <form className="space-y-6" onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={profileForm.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your middle name (optional)"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Username - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Username
                </label>
                <Input
                  value={user?.username || ""}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
                <p className="text-[0.8rem] text-muted-foreground">Username cannot be changed</p>
              </div>
              {/* Email - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input value={user?.email || ""} disabled className="cursor-not-allowed bg-muted" />
                <p className="text-[0.8rem] text-muted-foreground">Email cannot be changed</p>
              </div>
              <FormField
                control={profileForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        defaultCountry="NG"
                        placeholder="Enter phone number"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={!isEditing}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Role - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Role
                </label>
                <Input
                  value={user?.role || "N/A"}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
              </div>
              {/* Account Status - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Account Status
                </label>
                <Input
                  value={user?.is_active ? "Active" : "Inactive"}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
              </div>
              {/* Premium Status - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Premium Status
                </label>
                <Input
                  value={user?.is_premium ? "Premium" : "Free"}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
              </div>
              {/* Two-Factor Authentication - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Two-Factor Auth
                </label>
                <Input
                  value={user?.two_fa_enabled ? "Enabled" : "Disabled"}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
              </div>
              {/* Date Joined - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Date Joined
                </label>
                <Input
                  value={formatDate(user?.date_joined || "") || "N/A"}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
              </div>
              {/* Account Created - Read Only */}
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Account Created
                </label>
                <Input
                  value={formatDate(user?.created_at || "") || "N/A"}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
