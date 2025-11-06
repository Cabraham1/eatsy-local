import { Link, useLocation } from "wouter";
import { Home, Search, ShoppingBag, Bell, User } from "lucide-react";

export function MobileNavbar() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around border-t border-muted bg-white py-2 md:hidden">
      <Link href="/">
        <div
          className={`flex cursor-pointer flex-col items-center px-3 py-1 ${isActive("/") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-xs">Home</span>
        </div>
      </Link>
      <Link href="/explore">
        <div
          className={`flex cursor-pointer flex-col items-center px-3 py-1 ${isActive("/explore") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Search className="h-5 w-5" />
          <span className="mt-1 text-xs">Explore</span>
        </div>
      </Link>
      <Link href="/orders">
        <div
          className={`flex cursor-pointer flex-col items-center px-3 py-1 ${isActive("/orders") ? "text-primary" : "text-muted-foreground"}`}
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="mt-1 text-xs">Orders</span>
        </div>
      </Link>
      <Link href="/notifications">
        <div
          className={`flex cursor-pointer flex-col items-center px-3 py-1 ${isActive("/notifications") ? "text-primary" : "text-muted-foreground"}`}
        >
          <Bell className="h-5 w-5" />
          <span className="mt-1 text-xs">Alerts</span>
        </div>
      </Link>
      <Link href="/profile">
        <div
          className={`flex cursor-pointer flex-col items-center px-3 py-1 ${isActive("/profile") ? "text-primary" : "text-muted-foreground"}`}
        >
          <User className="h-5 w-5" />
          <span className="mt-1 text-xs">Profile</span>
        </div>
      </Link>
    </nav>
  );
}
