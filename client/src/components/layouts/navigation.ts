import { Compass, Home, UtensilsCrossed, Users } from "lucide-react";
import { ShoppingBag } from "lucide-react";

  export const NavItems = [
    { href: "/for-you", icon: Compass, label: "For You" },
    { href: "/home", icon: Home, label: "Home" },
    { href: "/dishes", icon: UtensilsCrossed, label: "Dishes" },
    { href: "/cooks", icon: Users, label: "Cooks" },
    { href: "/orders", icon: ShoppingBag, label: "Orders" },
  ];