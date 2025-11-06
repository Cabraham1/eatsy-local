import React from "react";
import { Route, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Layout } from "@/components/layouts/layout";
import { getAuthToken } from "@/lib/constants/api-client";
import { isTokenValid } from "@/lib/constants/token-validator";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const token = getAuthToken();

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

        // Validate token: check if exists, is valid format, and not expired
        const isAuthenticated = token && isTokenValid(token) && user;

        // Redirect to auth if not authenticated
        if (!isAuthenticated) {
          return <Redirect to="/auth" />;
        }

        // Render the protected component with any route params
        return (
          <Layout>
            <Component {...params} />
          </Layout>
        );
      }}
    </Route>
  );
}
