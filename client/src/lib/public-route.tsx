import React from "react";
import { Route, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

type PublicRouteProps = {
  path: string;
  component: React.ComponentType;
  redirectIfAuthenticated?: boolean;
};

export function PublicRoute({
  path,
  component: Component,
  redirectIfAuthenticated = true,
}: PublicRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {(params) => {
        // Show loading spinner while checking authentication
        if (isLoading) {
          return (
            <div className="flex min-h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        // If user is authenticated and this route should redirect, go to main app
        if (redirectIfAuthenticated && user) {
          return <Redirect to="/for-you" />;
        }

        // Render the public component
        return <Component {...params} />;
      }}
    </Route>
  );
}
