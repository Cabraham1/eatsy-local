import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "@styles/index.css";
import { AuthProvider } from "./hooks/use-auth";
import { queryClient } from "./lib/constants/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
