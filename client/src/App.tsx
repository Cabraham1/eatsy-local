import { Switch, Route } from "wouter";
import { Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "./lib/protected-route";
import { PublicRoute } from "./lib/public-route";
import { AuthProvider } from "@/hooks/use-auth";
import { queryClient } from "@/lib/constants/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { routes, notFoundRoute } from "@/routes";

function Router() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <Switch>
        {routes.map(
          ({ path, component: Component, protected: isProtected, redirectIfAuthenticated }) =>
            isProtected ? (
              <ProtectedRoute key={path} path={path} component={Component} />
            ) : (
              <PublicRoute
                key={path}
                path={path}
                component={Component}
                redirectIfAuthenticated={redirectIfAuthenticated}
              />
            )
        )}
        <Route>
          <notFoundRoute.component />
        </Route>
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
