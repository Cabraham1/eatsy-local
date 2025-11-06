import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { Badge } from "@/components/ui/badge";

interface CartIconProps {
  className?: string;
  showBadge?: boolean;
  onClick?: () => void;
}

export function CartIcon({ className = "", showBadge = true, onClick }: CartIconProps) {
  const { totalItems } = useCartStore();

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <ShoppingCart className="h-6 w-6" />
      {showBadge && totalItems > 0 && (
        <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 p-0 text-xs hover:bg-orange-600">
          {totalItems > 99 ? "99+" : totalItems}
        </Badge>
      )}
    </div>
  );
}
