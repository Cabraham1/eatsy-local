import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useCartStore } from "@/stores/cart-store";

export function MobileCart() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { totalItems, totalAmount } = useCartStore();

  // Don't show if user is not logged in or there are no items
  if (!user || totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 mx-auto w-11/12 max-w-md">
      <Button
        className="flex w-full items-center justify-between py-6 shadow-lg"
        onClick={() => navigate("/cart")}
      >
        <div className="flex items-center">
          <ShoppingCart className="mr-2 h-5 w-5" />
          <span>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>
        <span>View Cart · ₦{totalAmount.toLocaleString()}</span>
      </Button>
    </div>
  );
}
