"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {

  Search,
  Heart,
  Bookmark,
  Settings,
  LogOut,
  Grid3X3,
  Menu,
  X,
  ChefHat,
} from "lucide-react";
import { CartIcon } from "@/components/ui/cart-icon";
import { NavItems } from "./navigation";
import { Role } from "@/types/enum";

export const MainNav = () => {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Handle scroll effect for glassmorphic header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // If user isn't authenticated, don't show the navigation
  // if (!user) return null;

  // Get first name for greeting
  // const firstName = user?.fullName ? user.fullName.split(" ")[0] : "User";

  // Check if current path is active
  const isActivePath = (path: string) => {
    if (path === "/") return location === path;
    return location.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/");
    } catch {
      navigate("/");
    }
  };

  const handleBecomeCook = () => {
    navigate("/profile?tab=onboarding");
    setIsMobileMenuOpen(false);
  };

  const isUserNotCook = user && user.role !== Role.COOK;

  return (
    <>
      {/* Glassmorphic Header */}
      <div
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-all duration-200 ease-out",
          isScrolled
            ? "border-b border-orange-100/50 bg-white/70 shadow-sm backdrop-blur-md"
            : "border-b border-orange-50/30 bg-white/80 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/for-you">
                <h1 className="font-heading cursor-pointer text-2xl font-bold text-primary transition-transform duration-150 ease-out hover:scale-[1.02]">
                  Eatsy<span className="text-[#FF9F1C]">.</span>
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1 lg:flex">
              {NavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActivePath(item.href) ? "default" : "ghost"}
                    className={cn(
                      "flex items-center gap-2 transition-all duration-150 ease-out",
                      isActivePath(item.href)
                        ? "bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                        : "hover:bg-orange-50 hover:text-orange-700"
                    )}
                    size="sm"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              {/* Become a Cook Button - Only show for non-cook users */}
              {isUserNotCook && (
                <Button
                  onClick={handleBecomeCook}
                  className="ml-2 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md transition-all duration-700 ease-out hover:scale-[1.05] hover:from-orange-600 hover:to-amber-600 hover:shadow-lg animate-breathe hover:animate-none"
                  size="sm"
                >
                  <ChefHat className="h-4 w-4" />
                  Become a Cook
                </Button>
              )}
            </nav>

            {/* Desktop Search Bar */}
            <div className="mx-6 hidden max-w-md flex-1 md:flex">
              <div
                className={cn(
                  "relative w-full transition-all duration-150",
                  isSearchFocused && "scale-[1.01]"
                )}
              >
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 transition-colors duration-150" />
                <Input
                  placeholder="Search dishes, cooks, or cuisines"
                  className={cn(
                    "h-10 w-full rounded-full py-2 pl-10 pr-4 transition-all duration-150",
                    "border-orange-100/50 bg-orange-50/50 backdrop-blur-sm",
                    "focus-visible:bg-orange-50/70 focus-visible:ring-1 focus-visible:ring-orange-300",
                    "hover:bg-orange-50/70"
                  )}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            {/* Mobile & User Actions */}
            <div className="flex items-center gap-2">
              {/* Cart Icon */}
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-150 ease-out hover:bg-orange-50"
                onClick={() => navigate("/cart")}
              >
                <CartIcon />
              </Button>

              {/* Mobile Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-150 ease-out hover:bg-orange-50 md:hidden"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-150 ease-out hover:bg-orange-50 lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full transition-all duration-150 ease-out hover:scale-[1.02] hover:bg-orange-50"
                  >
                    <Avatar className="h-9 w-9 ring-1 ring-orange-100 transition-all duration-150">
                      <AvatarImage src={user?.profileImage || undefined} />
                      <AvatarFallback className="bg-orange-500 text-white">
                        {user?.fullName
                          ? user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : user?.username?.substring(0, 2).toUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 border-orange-100/50 bg-white/90 backdrop-blur-md"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullName || user?.username || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "No email"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-orange-100/50" />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="transition-colors duration-150 hover:bg-orange-50"
                  >
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/liked")}
                    className="transition-colors duration-150 hover:bg-orange-50"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Liked Dishes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/saved")}
                    className="transition-colors duration-150 hover:bg-orange-50"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>Saved Dishes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/settings")}
                    className="transition-colors duration-150 hover:bg-orange-50"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-orange-100/50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="text-red-600 transition-colors duration-150 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-out md:hidden",
            isMobileSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search dishes, cooks, or cuisines"
                className="h-12 w-full rounded-xl border-orange-100/50 bg-orange-50/50 py-3 pl-10 pr-4 backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-orange-300"
                autoFocus={isMobileSearchOpen}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-200 ease-out lg:hidden",
          isMobileMenuOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/10 backdrop-blur-sm transition-opacity duration-200",
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute left-0 right-0 top-16 mx-4 rounded-2xl transition-all duration-200 ease-out",
            "border border-orange-100/50 bg-white/90 shadow-lg backdrop-blur-md",
            isMobileMenuOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "scale-98 -translate-y-2 opacity-0"
          )}
        >
          <div className="p-6">
            {/* Become a Cook Banner - Only show for non-cook users */}
            {isUserNotCook && (
              <div className="mb-4 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white shadow-md">
                <div className="flex items-center gap-3">
                  <ChefHat className="h-6 w-6" />
                  <div className="flex-1">
                    <h3 className="font-semibold">Become a Cook</h3>
                    <p className="text-xs text-white/90">Start earning by sharing your recipes</p>
                  </div>
                </div>
                <Button
                  onClick={handleBecomeCook}
                  className="mt-3 w-full bg-white text-orange-600 transition-all duration-150 hover:bg-orange-50"
                  size="sm"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-2">
              {NavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActivePath(item.href) ? "default" : "ghost"}
                    className={cn(
                      "h-12 w-full justify-start gap-3 text-left transition-all duration-150",
                      "hover:scale-[1.01]",
                      isActivePath(item.href)
                        ? "bg-orange-500 text-white shadow-sm"
                        : "hover:bg-orange-50 hover:text-orange-700"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 border-t border-orange-100/50 pt-6">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  className="h-10 justify-start gap-2 transition-all duration-150 hover:bg-orange-50 hover:text-orange-700"
                  onClick={() => {
                    navigate("/liked");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Heart className="h-4 w-4" />
                  Liked
                </Button>
                <Button
                  variant="ghost"
                  className="h-10 justify-start gap-2 transition-all duration-150 hover:bg-orange-50 hover:text-orange-700"
                  onClick={() => {
                    navigate("/saved");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Bookmark className="h-4 w-4" />
                  Saved
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}
