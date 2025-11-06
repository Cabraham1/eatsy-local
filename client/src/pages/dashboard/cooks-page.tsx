import React, { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Star,
  Heart,
  Search,
  MapPin,
  ChefHat,
  TrendingUp,
  Users,
  Zap,
  MessageSquare,
  Play,
  Sparkles,
  Grid3X3,
  SlidersHorizontal,
  CheckCircle,
  Shield,
  Flame,
  Leaf,
  Utensils,
  Coffee,
  Cake,
  Pizza,
  Fish,
  Beef,
  ListIcon,
  PlusIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { getQueryFn } from "@/lib/constants/queryClient";

const CooksPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [filters, setFilters] = useState({
    specialties: [] as string[],
    rating: 0,
    location: "",
    verified: false,
    online: false,
  });

  // Debounce search query to avoid too many API calls
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch cooks with search parameters
  const cooksUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
    if (filters.specialties.length > 0) params.append("specialties", filters.specialties.join(","));
    if (filters.rating > 0) params.append("minRating", filters.rating.toString());
    if (filters.location) params.append("location", filters.location);
    if (filters.verified) params.append("verified", "true");
    if (filters.online) params.append("online", "true");
    params.append("sortBy", sortBy);
    return `/api/cooks?${params.toString()}`;
  }, [
    debouncedSearchQuery,
    filters.specialties,
    filters.rating,
    filters.location,
    filters.verified,
    filters.online,
    sortBy,
  ]);

  const {
    data: cooksData,
    isLoading: isCooksLoading,
    error: cooksError,
  } = useQuery({
    queryKey: [cooksUrl],
    queryFn: getQueryFn(),
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: true,
  });

  // Use the data directly since backend handles filtering
  const filteredCooks = Array.isArray(cooksData) ? cooksData : [];

  // Calculate actual specialty counts from cooks data
  const calculateSpecialtyCounts = (cooks: any[]) => {
    const specialtyCounts: { [key: string]: number } = {};

    cooks.forEach((cook) => {
      if (cook.specialties) {
        cook.specialties.forEach((specialty: string) => {
          specialtyCounts[specialty] = (specialtyCounts[specialty] || 0) + 1;
        });
      }
    });

    return specialtyCounts;
  };

  const specialtyCounts = calculateSpecialtyCounts(filteredCooks);

  // Get all unique specialties from the data with their icons
  const specialtyIcons: { [key: string]: any } = {
    Nigerian: ChefHat,
    "Jollof Rice": Utensils,
    Soups: Flame,
    Grilled: Flame,
    Vegetarian: Leaf,
    Vegan: Leaf,
    "Gluten-Free": Shield,
    Spicy: Zap,
    Sweet: Cake,
    Savory: Utensils,
    Breakfast: Coffee,
    Dessert: Cake,
    Seafood: Fish,
    Beef: Beef,
    Chicken: Beef,
    Pizza: Pizza,
  };

  // Create dynamic specialties from actual data
  const specialties = Object.keys(specialtyCounts)
    .filter((specialty) => specialtyCounts[specialty] > 0)
    .map((specialty) => ({
      name: specialty,
      icon: specialtyIcons[specialty] || ChefHat,
      count: specialtyCounts[specialty],
    }))
    .sort((a, b) => b.count - a.count);

  const ratingOptions = [
    { value: 0, label: "Any Rating" },
    { value: 4.5, label: "4.5+ Stars" },
    { value: 4.0, label: "4.0+ Stars" },
    { value: 3.5, label: "3.5+ Stars" },
  ];

  const sortOptions = [
    { value: "popular", label: "Most Popular", icon: TrendingUp },
    { value: "rating", label: "Highest Rated", icon: Star },
    { value: "newest", label: "Newest First", icon: Sparkles },
    { value: "verified", label: "Verified First", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative z-10 mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <h1 className="font-poppins mb-4 text-4xl font-bold md:text-5xl">
              Meet Our Amazing <span className="text-amber-200">Home Cooks</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-orange-100">
              Discover passionate cooks who bring authentic Nigerian flavors to your table
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder="Search cooks, specialties, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl border-0 bg-white/95 py-4 pl-12 pr-4 text-lg shadow-lg backdrop-blur-sm"
              />
              {searchQuery && (
                <div className="absolute right-16 top-1/2 -translate-y-1/2 transform text-xs font-medium text-orange-500">
                  {isCooksLoading ? "Searching..." : "Search active"}
                </div>
              )}
              <Button
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-xl bg-orange-500 hover:bg-orange-600"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-center">
            <div className="rounded-2xl bg-white/20 px-6 py-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">200+</div>
              <div className="text-sm text-orange-100">Active Cooks</div>
            </div>
            <div className="rounded-2xl bg-white/20 px-6 py-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-orange-100">Verified Chefs</div>
            </div>
            <div className="rounded-2xl bg-white/20 px-6 py-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm text-orange-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Specialties Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <h2 className="font-poppins text-2xl font-bold">Browse by Specialty</h2>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {specialties.map((specialty) => {
              const IconComponent = specialty.icon;
              return (
                <Badge
                  key={specialty.name}
                  variant={filters.specialties.includes(specialty.name) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105",
                    filters.specialties.includes(specialty.name)
                      ? "bg-orange-500 text-white shadow-lg"
                      : "border-orange-200 bg-white hover:bg-orange-50"
                  )}
                  onClick={() => {
                    setFilters((prev) => {
                      if (prev.specialties.includes(specialty.name)) {
                        return {
                          ...prev,
                          specialties: prev.specialties.filter((s) => s !== specialty.name),
                        };
                      } else {
                        return {
                          ...prev,
                          specialties: [...prev.specialties, specialty.name],
                        };
                      }
                    });
                  }}
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  {specialty.name}
                  <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {specialty.count}
                  </span>
                </Badge>
              );
            })}
          </div>

          {/* Additional Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Rating:</span>
              <select
                value={filters.rating}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    rating: parseFloat(e.target.value),
                  }))
                }
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gray-500" />
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={filters.verified}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      verified: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                Verified Only
              </label>
            </div>

            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-gray-500" />
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <input
                  type="checkbox"
                  checked={filters.online}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      online: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                Online Now
              </label>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {Array.isArray(filteredCooks) ? filteredCooks.length : 0} cooks found
              {(searchQuery ||
                filters.specialties.length > 0 ||
                filters.rating > 0 ||
                filters.verified ||
                filters.online) && <span className="ml-1 text-orange-500">(filtered)</span>}
              {isCooksLoading && <span className="ml-1 text-blue-500">(loading...)</span>}
            </span>
            <div className="flex rounded-xl bg-gray-100 p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-lg"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-lg"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cooks Grid/List */}
        {isCooksLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              <div className="absolute inset-0 animate-pulse rounded-full bg-orange-100"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600">
              {searchQuery ? `Searching for "${searchQuery}"...` : "Loading amazing cooks..."}
            </p>
          </div>
        ) : cooksError ? (
          <Card className="border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-4 text-red-500">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Oops! Something went wrong</h3>
              <p className="text-red-600">Unable to load cooks. Please try again later.</p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Card>
        ) : Array.isArray(filteredCooks) && filteredCooks.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            )}
          >
            {filteredCooks.map((cook: any) => (
              <CookCard key={cook.id || Math.random()} cook={cook} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
              <ChefHat className="h-12 w-12 text-orange-400" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-gray-700">No cooks found</h3>
            <p className="mx-auto mb-6 max-w-md text-gray-500">
              Try adjusting your search terms or filters to discover more amazing cooks.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    specialties: [],
                    rating: 0,
                    location: "",
                    verified: false,
                    online: false,
                  });
                }}
              >
                Clear All Filters
              </Button>
              {user?.userType === "cook" && (
                <Link href="/cooks/apply">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Become a Cook
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Cook Card Component
const CookCard = ({ cook, viewMode }: { cook: any; viewMode: "grid" | "list" }) => {
  const [isFollowing, setIsFollowing] = useState(cook.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(
    cook.followersCount || Math.floor(Math.random() * 500) + 50
  );

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    setFollowersCount((prev: number) => (isFollowing ? prev - 1 : prev + 1));
  };

  if (viewMode === "list") {
    return (
      <Link href={`/cooks/${cook.id || 1}`}>
        <Card className="overflow-hidden border border-orange-100 bg-white transition-all hover:border-orange-200 hover:shadow-lg">
          <div className="flex">
            <div className="relative h-32 w-48 flex-shrink-0">
              <img
                src={
                  cook.profileImage ||
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=480&auto=format&fit=crop"
                }
                alt={cook.fullName || "Nigerian Cook"}
                className="h-full w-full object-cover"
              />
              {cook.isVerified && (
                <Badge className="absolute left-2 top-2 bg-green-500 text-white">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verified
                </Badge>
              )}
              {cook.isOnline && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                  ONLINE
                </div>
              )}
            </div>

            <CardContent className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-1 line-clamp-1 text-lg">
                    {cook.fullName || "Nigerian Cook"}
                  </CardTitle>

                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {cook.location || "Lagos, Nigeria"}
                    </span>
                  </div>

                  <CardDescription className="mb-3 line-clamp-2">
                    {cook.bio ||
                      "Passionate home cook bringing authentic Nigerian flavors to your table."}
                  </CardDescription>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center text-amber-500">
                      <Star className="mr-1 h-4 w-4 fill-current" />
                      <span>{cook.rating || 4.5}</span>
                    </div>

                    <div className="flex items-center text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{followersCount} followers</span>
                    </div>

                    <div className="flex items-center text-gray-500">
                      <Utensils className="mr-1 h-4 w-4" />
                      <span>{cook.dishesCount || Math.floor(Math.random() * 20) + 5} dishes</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="mb-2 flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={handleFollow} className="p-1">
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          isFollowing ? "fill-red-500 text-red-500" : "text-gray-400"
                        )}
                      />
                    </Button>
                    <Button size="sm" variant="ghost" className="p-1">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/cooks/${cook.id || 1}`}>
      <Card className="h-full overflow-hidden border border-orange-100 bg-white transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
        <div className="relative aspect-[4/3]">
          <img
            src={
              cook.profileImage ||
              "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=480&auto=format&fit=crop"
            }
            alt={cook.fullName || "Nigerian Cook"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {cook.isVerified && (
            <Badge className="absolute left-3 top-3 bg-green-500 text-white shadow-lg">
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          )}

          {cook.isOnline && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white shadow-lg">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
              ONLINE
            </div>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={handleFollow}
            className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white"
          >
            <Heart
              className={cn("h-4 w-4", isFollowing ? "fill-red-500 text-red-500" : "text-gray-600")}
            />
          </Button>
        </div>

        <CardContent className="p-4">
          <CardTitle className="mb-2 line-clamp-1 text-lg">
            {cook.fullName || "Nigerian Cook"}
          </CardTitle>

          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="line-clamp-1 text-sm text-gray-600">
              {cook.location || "Lagos, Nigeria"}
            </span>
          </div>

          <CardDescription className="mb-4 line-clamp-2 h-10">
            {cook.bio || "Passionate home cook bringing authentic Nigerian flavors to your table."}
          </CardDescription>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center text-amber-500">
                <Star className="mr-1 h-4 w-4 fill-current" />
                <span className="font-medium">{cook.rating || 4.5}</span>
              </div>

              <div className="flex items-center text-gray-500">
                <Users className="mr-1 h-4 w-4" />
                <span>{followersCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="p-1">
                <MessageSquare className="h-4 w-4 text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span>{cook.dishesCount || Math.floor(Math.random() * 20) + 5} dishes</span>
              <span className="mx-2">•</span>
              <span>{cook.experience || "5+ years"}</span>
            </div>

            <Button size="sm" className="bg-orange-500 shadow-lg hover:bg-orange-600">
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CooksPage;
