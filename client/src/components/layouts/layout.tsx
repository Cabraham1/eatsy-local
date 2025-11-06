import React from "react";
import { Link } from "wouter";
import { MainNav } from "./main-nav";
import { MobileCart } from "./mobile-cart";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";
import { CreatePostButton } from "@/components/ui/create-post-button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // const [location] = useLocation();
  // const { user, isLoading } = useAuth();

  // Don't show navigation during authentication loading (except on landing and auth pages)
  // if (isLoading && location !== "/" && location !== "/auth") {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-primary" />
  //       <span className="ml-2 text-gray-600">Loading...</span>
  //     </div>
  //   );
  // }

  // The Toaster should always be present
  return (
    <div className="flex min-h-screen flex-col">
      {<MainNav />}
      <main className="flex-1">{children}</main>
      {<MobileCart />}
      <Toaster />
      
      {/* Create Post Button (visible only to cooks) */}
      <CreatePostButton />
      
      {/* Global Floating Hire a Chef Button */}
      <Link href="/cooks">
        <Button className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-white shadow-lg hover:bg-orange-600">
          <ChefHat className="mr-1 h-4 w-4" />
          <span>Hire a Chef</span>
        </Button>
      </Link>
    </div>
  );
}
