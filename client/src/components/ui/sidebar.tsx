import { Link, useLocation } from "wouter";
import { Home, Compass, Bookmark, Utensils, Bell, Store } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@shared/schema";
import { demoFavoriteCooks } from "@/mocks/data";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarLink = ({ href, icon, text }: SidebarLinkProps) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <li>
      <Link href={href}>
        <span
          className={`flex cursor-pointer items-center ${
            isActive
              ? "font-medium text-primary"
              : "text-muted-foreground transition-colors hover:text-primary"
          }`}
        >
          {icon}
          <span className="ml-3">{text}</span>
        </span>
      </Link>
    </li>
  );
};

interface CookItemProps {
  cook: User;
}

const CookItem = ({ cook }: CookItemProps) => {
  return (
    <div className="flex items-center py-2">
      <Avatar className="mr-3 h-8 w-8">
        {cook.profileImage ? (
          <AvatarImage src={cook.profileImage} alt={cook.fullName} />
        ) : (
          <AvatarFallback>{cook?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
      <div>
        <p className="text-sm font-medium">{cook.fullName}</p>
        <p className="text-xs text-muted-foreground">
          {cook.cuisine} • {cook.location}
        </p>
      </div>
    </div>
  );
};

export function Sidebar() {
  const { user } = useAuth();

  // For demonstration, we're using mock data
  const MOCK_DEMO_DATA = true;

  const { data: fetchedFavoriteCooks, isLoading: isLoadingFavs } = useQuery<User[]>({
    queryKey: ["/api/cooks/favorites"],
    enabled: !!user && !MOCK_DEMO_DATA,
  });

  // Demo data for preview purposes - Nigerian market
  // Use centralized favorite cooks data
  const mockFavoriteCooks = demoFavoriteCooks;

  // Use mock data if enabled, otherwise use fetched data
  const favoriteCooks = MOCK_DEMO_DATA ? mockFavoriteCooks : fetchedFavoriteCooks;
  const isLoading = !MOCK_DEMO_DATA && isLoadingFavs;

  return (
    <div className="sticky top-20">
      <nav className="rounded-xl bg-white p-4 shadow-card">
        <ul className="space-y-4">
          <SidebarLink href="/" icon={<Home className="h-5 w-5" />} text="Home" />
          <SidebarLink href="/explore" icon={<Compass className="h-5 w-5" />} text="Explore" />
          <SidebarLink href="/saved" icon={<Bookmark className="h-5 w-5" />} text="Saved" />
          <SidebarLink href="/orders" icon={<Utensils className="h-5 w-5" />} text="My Orders" />
          <SidebarLink
            href="/notifications"
            icon={<Bell className="h-5 w-5" />}
            text="Notifications"
          />
          <SidebarLink
            href="/become-cook"
            icon={<Store className="h-5 w-5" />}
            text="Become a Cook"
          />
        </ul>

        <div className="mt-8 border-t border-muted pt-4">
          <h3 className="mb-3 font-medium">Your Favorite Cooks</h3>

          {isLoading ? (
            <>
              <div className="flex items-center py-2">
                <Skeleton className="mr-3 h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex items-center py-2">
                <Skeleton className="mr-3 h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="mb-1 h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </>
          ) : favoriteCooks && favoriteCooks.length > 0 ? (
            <>
              {favoriteCooks.slice(0, 2).map((cook) => (
                <CookItem key={cook.id} cook={cook} />
              ))}
              {favoriteCooks.length > 2 && (
                <Button variant="link" className="mt-2 p-0 text-sm font-medium text-primary">
                  See all
                </Button>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You haven&apos;t followed any cooks yet.
            </p>
          )}
        </div>
      </nav>
    </div>
  );
}
