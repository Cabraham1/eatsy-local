import { useEffect, useState, lazy} from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation, useSearch } from "wouter";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProfileTab = lazy(() => import("./view/ProfileTab").then((module) => ({ default: module.ProfileTab })));
const OrdersTab = lazy(() => import("./view/OrdersTab").then((module) => ({ default: module.OrdersTab })));
const FavoritesTab = lazy(() => import("./view/FavoritesTab").then((module) => ({ default: module.FavoritesTab })));
const SecurityTab = lazy(() => import("./view/SecurityTab").then((module) => ({ default: module.SecurityTab })));
const OnboardingTab = lazy(() => import("./view/OnboardingTab").then((module) => ({ default: module.OnboardingTab })));

export const ProfilePage = () => {
  const { user, isLoading, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const [isUserReady, setIsUserReady] = useState(false);

  const urlParams = new URLSearchParams(searchParams);
  const activeTab = urlParams.get("tab") || "profile";

  // Wait for user data to be fully loaded
  useEffect(() => {
    if (!isLoading && user) {
      setIsUserReady(true);
    }
  }, [user, isLoading]);

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", value);
    setLocation(`/profile?${newParams.toString()}`);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Show loading state while user data is loading
  if (isLoading || !isUserReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render if no user (let ProtectedRoute handle it)
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col items-start gap-8 md:flex-row">
          {/* Profile header with avatar */}
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={user.profileImage || undefined} />
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                {user.fullName
                  ? user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : user.username?.substring(0, 2).toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>

            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold">{user.fullName || user.username}</h2>
              {user.userType === "cook" && (
                <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
                  Chef
                </span>
              )}
              {user.location && (
                <p className="mt-1 text-sm text-muted-foreground">{user.location}</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="mt-4 text-destructive"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {logoutMutation.isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>

          {/* Main content area */}
          <div className="w-full flex-1">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                {user.userType !== "cook" && (
                  <TabsTrigger value="onboarding">Become a Cook</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="profile">
                <ProfileTab user={user} />
              </TabsContent>

              <TabsContent value="orders">
                <OrdersTab userId={String(user.id)} />
              </TabsContent>

              <TabsContent value="favorites">
                <FavoritesTab />
              </TabsContent>

              <TabsContent value="security">
                <SecurityTab />
              </TabsContent>

              <TabsContent value="onboarding">
                <OnboardingTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
