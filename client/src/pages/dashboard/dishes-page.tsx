import React, { useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Clock,
  Star,
  Heart,
  Search,
  ChefHat,
  TrendingUp,
  Users,
  Zap,
  ShoppingCart,
  Play,
  Sparkles,
  Grid3X3,
  List,
  SlidersHorizontal,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { getQueryFn } from "@/lib/constants/queryClient";

const DishesPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    categories: [] as string[],
    cookingTime: "",
    dietary: [] as string[],
    location: "",
  });

  // Debounce search query to avoid too many API calls
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const dishesUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery) params.append("search", debouncedSearchQuery);
    if (filters.categories.length > 0) params.append("categories", filters.categories.join(","));
    if (filters.dietary.length > 0) params.append("dietary", filters.dietary.join(","));
    params.append("priceMin", filters.priceRange[0].toString());
    params.append("priceMax", filters.priceRange[1].toString());
    params.append("sortBy", sortBy);
    return `/api/dishes?${params.toString()}`;
  }, [debouncedSearchQuery, filters.categories, filters.dietary, filters.priceRange, sortBy]);

  const {
    data: dishesData,
    isLoading: isDishesLoading,
    error: dishesError,
  } = useQuery({
    queryKey: [dishesUrl],
    queryFn: getQueryFn(),
    refetchOnWindowFocus: false,
    staleTime: 0,
    enabled: true,
  });

  // Use the data directly since backend handles filtering
  const filteredDishes = Array.isArray(dishesData) ? dishesData : [];

  // Calculate actual category counts from dishes data
  const calculateCategoryCounts = (dishes: any[]) => {
    const categoryCounts: { [key: string]: number } = {};

    dishes.forEach((item) => {
      // Handle both old structure (item.dish.tags) and new structure (item.tags or derived from item properties)
      let tags: string[] = [];

      if (item.dish?.tags) {
        tags = item.dish.tags;
      } else {
        // Create tags from the new data structure
        if (item.title || item.caption) {
          const dishName = (item.title || item.caption).toLowerCase();

          // Extract categories based on dish names/captions
          if (dishName.includes("jollof") || dishName.includes("rice")) {
            tags.push("Rice");
          }
          if (
            dishName.includes("soup") ||
            dishName.includes("egusi") ||
            dishName.includes("pepper")
          ) {
            tags.push("Soups");
          }
          if (dishName.includes("suya") || dishName.includes("grilled")) {
            tags.push("Grilled");
          }
          if (dishName.includes("ice cream") || dishName.includes("dessert")) {
            tags.push("Dessert");
          }
          if (
            dishName.includes("tea") ||
            dishName.includes("shayi") ||
            dishName.includes("drink")
          ) {
            tags.push("Drinks");
          }
          if (dishName.includes("spicy") || dishName.includes("pepper")) {
            tags.push("Spicy");
          }
          if (dishName.includes("chicken") || dishName.includes("meat")) {
            tags.push("Protein");
          }

          // Default category if no specific match
          if (tags.length === 0) {
            tags.push("Nigerian");
          }
        }
      }

      tags.forEach((tag: string) => {
        categoryCounts[tag] = (categoryCounts[tag] || 0) + 1;
      });
    });

    return categoryCounts;
  };

  const categoryCounts = calculateCategoryCounts(filteredDishes);

  // Get all unique categories from the data with their emojis
  const categoryEmojis: { [key: string]: string } = {
    "Jollof Rice": "🍚",
    Soups: "🍲",
    Swallow: "🥣",
    Grilled: "🔥",
    Snacks: "🥜",
    Protein: "🍖",
    Breakfast: "🥞",
    Drinks: "🥤",
    Dessert: "🍰",
    Rice: "🍚",
    Vegetarian: "🥬",
    Spicy: "🌶️",
  };

  // Create dynamic categories from actual data
  const categories = Object.keys(categoryCounts)
    .filter((category) => categoryCounts[category] > 0) // Only show categories with dishes
    .map((category) => ({
      name: category,
      emoji: categoryEmojis[category] || "🍽️", // Default emoji if not found
      count: categoryCounts[category],
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  const dietaryOptions = [
    { name: "Vegetarian", emoji: "🥬" },
    { name: "Spicy", emoji: "🌶️" },
    { name: "Gluten-Free", emoji: "🌾" },
    { name: "Low-Carb", emoji: "💪" },
  ];

  const sortOptions = [
    { value: "popular", label: "Most Popular", icon: TrendingUp },
    { value: "rating", label: "Highest Rated", icon: Star },
    {
      value: "price-low",
      label: "Price: Low to High",
      icon: SlidersHorizontal,
    },
    {
      value: "price-high",
      label: "Price: High to Low",
      icon: SlidersHorizontal,
    },
    { value: "newest", label: "Newest First", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative z-10 mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <h1 className="font-poppins mb-4 text-4xl font-bold md:text-5xl">
              Discover Amazing <span className="text-amber-200">African Dishes</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-orange-100">
              From home cooks to professional chefs, explore authentic flavors made with love
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder="Search dishes, cooks, or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl border-0 bg-white/95 py-6 pl-6 pr-4 text-xs shadow-lg backdrop-blur-sm"
              />
              {searchQuery && (
                <div className="absolute right-16 top-1/2 -translate-y-1/2 transform text-xs font-medium text-orange-500">
                  {isDishesLoading ? "Searching..." : "Search active"}
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
              <div className="text-2xl font-bold">500+</div>
              <div className="text-sm text-orange-100">Active Dishes</div>
            </div>
            <div className="rounded-2xl bg-white/20 px-6 py-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">200+</div>
              <div className="text-sm text-orange-100">Home Cooks</div>
            </div>
            <div className="rounded-2xl bg-white/20 px-6 py-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">4.8★</div>
              <div className="text-sm text-orange-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Section */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <ChefHat className="h-6 w-6 text-orange-500" />
            <h2 className="font-poppins text-2xl font-bold">Browse by Category</h2>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Badge
                key={category.name}
                variant={filters.categories.includes(category.name) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all hover:scale-105",
                  filters.categories.includes(category.name)
                    ? "bg-orange-500 text-white shadow-lg"
                    : "border-orange-200 bg-white hover:bg-orange-50"
                )}
                onClick={() => {
                  setFilters((prev) => {
                    if (prev.categories.includes(category.name)) {
                      return {
                        ...prev,
                        categories: prev.categories.filter((c) => c !== category.name),
                      };
                    } else {
                      return {
                        ...prev,
                        categories: [...prev.categories, category.name],
                      };
                    }
                  });
                }}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
                <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {category.count}
                </span>
              </Badge>
            ))}
          </div>

          {/* Dietary Filters */}
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Dietary Options:</span>
          </div>
          <div className="mb-6 flex flex-wrap gap-2">
            {dietaryOptions.map((option) => (
              <Badge
                key={option.name}
                variant={filters.dietary.includes(option.name) ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all hover:scale-105",
                  filters.dietary.includes(option.name)
                    ? "bg-green-500 text-white"
                    : "border-green-200 bg-white hover:bg-green-50"
                )}
                onClick={() => {
                  setFilters((prev) => {
                    if (prev.dietary.includes(option.name)) {
                      return {
                        ...prev,
                        dietary: prev.dietary.filter((d) => d !== option.name),
                      };
                    } else {
                      return {
                        ...prev,
                        dietary: [...prev.dietary, option.name],
                      };
                    }
                  });
                }}
              >
                <span className="mr-1">{option.emoji}</span>
                {option.name}
              </Badge>
            ))}
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
              {Array.isArray(filteredDishes) ? filteredDishes.length : 0} dishes found
              {(searchQuery || filters.categories.length > 0 || filters.dietary.length > 0) && (
                <span className="ml-1 text-orange-500">(filtered)</span>
              )}
              {isDishesLoading && <span className="ml-1 text-blue-500">(loading...)</span>}
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
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Dishes Grid/List */}
        {isDishesLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              <div className="absolute inset-0 animate-pulse rounded-full bg-orange-100"></div>
            </div>
            <p className="mt-4 text-lg text-gray-600">
              {searchQuery ? `Searching for "${searchQuery}"...` : "Loading delicious dishes..."}
            </p>
          </div>
        ) : dishesError ? (
          <Card className="border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-4 text-red-500">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Oops! Something went wrong</h3>
              <p className="text-red-600">Unable to load dishes. Please try again later.</p>
            </div>
            <Button
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Card>
        ) : Array.isArray(filteredDishes) && filteredDishes.length > 0 ? (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "space-y-4"
            )}
          >
            {filteredDishes.map((item: any) => (
              <DishCard key={item.dish?.id || Math.random()} item={item} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100">
              <Search className="h-12 w-12 text-orange-400" />
            </div>
            <h3 className="mb-2 text-2xl font-semibold text-gray-700">No dishes found</h3>
            <p className="mx-auto mb-6 max-w-md text-gray-500">
              Try adjusting your search terms or filters to discover more delicious options.
            </p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    priceRange: [0, 10000],
                    categories: [],
                    cookingTime: "",
                    dietary: [],
                    location: "",
                  });
                }}
              >
                Clear All Filters
              </Button>
              {user?.userType === "cook" && (
                <Link href="/dishes/new">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your Dish
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

// Dish Card Component
const DishCard = ({ item, viewMode }: { item: any; viewMode: "grid" | "list" }) => {
  console.log("Rendering DishCard for:", item);
  const [isLiked, setIsLiked] = useState(item.isLiked || false);
  const [likeCount, setLikeCount] = useState(item.likes || Math.floor(Math.random() * 50));

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount((prev: number) => (isLiked ? prev - 1 : prev + 1));
  };

  // Extract dish data - handle both old and new structure
  const dishData = {
    id: item.dish?.id || item.id || 1,
    name: item.dish?.name || item.title || "Delicious Nigerian Dish",
    description:
      item.dish?.description ||
      item.caption ||
      "Authentic Nigerian cuisine made with local ingredients.",
    imageUrl:
      item.dish?.imageUrl ||
      item.image ||
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=480&auto=format&fit=crop",
    price: item.dish?.price || parseInt((item.price || "₦2500").replace(/[₦,]/g, "")) || 2500,
    rating: item.dish?.rating || item.rating || 4.5,
    prepTime: item.dish?.prepTime || "30min",
    isPopular: item.dish?.isPopular || false,
  };

  const cookData = {
    fullName: item.cook?.fullName || item.cookName || "Nigerian Cook",
    profileImage: item.cook?.profileImage || item.cookImage || undefined,
  };

  if (viewMode === "list") {
    return (
      <Link href={`/dishes/${dishData.id}`}>
        <Card className="overflow-hidden border border-orange-100 bg-white transition-all hover:border-orange-200 hover:shadow-lg">
          <div className="flex">
            <div className="relative h-32 w-48 flex-shrink-0">
              <img
                src={dishData.imageUrl}
                alt={dishData.name}
                className="h-full w-full object-cover"
              />
              {dishData.isPopular && (
                <Badge className="absolute left-2 top-2 bg-orange-500 text-white">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Popular
                </Badge>
              )}
            </div>

            <CardContent className="flex-1 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-1 line-clamp-1 text-lg">{dishData.name}</CardTitle>

                  <div className="mb-2 flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={cookData.profileImage} />
                      <AvatarFallback className="bg-orange-100 text-xs text-orange-600">
                        {cookData.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{cookData.fullName}</span>
                  </div>

                  <CardDescription className="mb-3 line-clamp-2">
                    {dishData.description}
                  </CardDescription>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center text-amber-500">
                      <Star className="mr-1 h-4 w-4 fill-current" />
                      <span>{dishData.rating}</span>
                    </div>

                    <div className="flex items-center text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{dishData.prepTime}</span>
                    </div>

                    <div className="flex items-center text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      <span>{Math.floor(Math.random() * 100) + 10} orders</span>
                    </div>
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className="mb-2 text-xl font-bold text-orange-600">
                    ₦{dishData.price.toLocaleString("en-NG")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={handleLike} className="p-1">
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                        )}
                      />
                      <span className="ml-1 text-xs">{likeCount}</span>
                    </Button>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/dishes/${dishData.id}`}>
      <Card className="h-full overflow-hidden border border-orange-100 bg-white transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl">
        <div className="relative aspect-[4/3]">
          <img src={dishData.imageUrl} alt={dishData.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {dishData.isPopular && (
            <Badge className="absolute left-3 top-3 bg-orange-500 text-white shadow-lg">
              <TrendingUp className="mr-1 h-3 w-3" />
              Popular
            </Badge>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={handleLike}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-lg hover:bg-white"
          >
            <Heart
              className={cn("h-4 w-4", isLiked ? "fill-red-500 text-red-500" : "text-gray-600")}
            />
          </Button>

          {/* Live cooking indicator */}
          {Math.random() > 0.8 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-red-500 px-2 py-1 text-xs font-medium text-white">
              <Play className="h-3 w-3" />
              LIVE
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <CardTitle className="mb-2 line-clamp-1 text-lg">{dishData.name}</CardTitle>

          <div className="mb-3 flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={cookData.profileImage} />
              <AvatarFallback className="bg-orange-100 text-xs text-orange-600">
                {cookData.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="line-clamp-1 text-sm text-gray-600">{cookData.fullName}</span>
            {Math.random() > 0.7 && (
              <Badge variant="outline" className="border-green-200 text-xs text-green-600">
                <Zap className="mr-1 h-2 w-2" />
                Fast
              </Badge>
            )}
          </div>

          <CardDescription className="mb-4 line-clamp-2 h-10">
            {dishData.description}
          </CardDescription>

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center text-amber-500">
                <Star className="mr-1 h-4 w-4 fill-current" />
                <span className="font-medium">{dishData.rating}</span>
              </div>

              <div className="flex items-center text-gray-500">
                <Clock className="mr-1 h-4 w-4" />
                <span>{dishData.prepTime}</span>
              </div>
            </div>

            <div className="text-lg font-bold text-orange-600">
              ₦{dishData.price.toLocaleString("en-NG")}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <span>{likeCount} likes</span>
              <span className="mx-2">•</span>
              <span>{Math.floor(Math.random() * 100) + 10} orders</span>
            </div>

            <Button size="sm" className="bg-orange-500 shadow-lg hover:bg-orange-600">
              <ShoppingCart className="mr-1 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DishesPage;
