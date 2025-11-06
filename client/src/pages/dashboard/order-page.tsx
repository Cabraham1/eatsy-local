import React, { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/constants/queryClient";
import { api } from "@/lib/constants/api-client";
import {
  Loader2,
  Heart,
  Clock,
  Star,
  Share2,
  BookmarkPlus,
  ChevronLeft,
  Plus,
  Minus,
  Leaf,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const OrderPage = () => {
  const { id } = useParams();
  const dishId = parseInt(id || "1");
  const { toast } = useToast();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [_location, setLocation] = useLocation();

  const {
    data: dishDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["/api/dishes", dishId],
    enabled: !!dishId,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/cart/add", {
        dishId,
        quantity,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: `${quantity} ${quantity > 1 ? "items" : "item"} added to your cart`,
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const buyNowMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/cart/add", {
        dishId,
        quantity,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      // Navigate to checkout
      setLocation("/checkout");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("POST", `/api/dishes/${dishId}/toggle-like`);
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dishes", dishId] });
      toast({
        title: data.isLiked ? "Added to favorites" : "Removed from favorites",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleSaveMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("POST", `/api/dishes/${dishId}/toggle-save`);
      return response;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/dishes", dishId] });
      toast({
        title: data.isSaved ? "Dish saved" : "Dish unsaved",
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save dish. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    toggleLikeMutation.mutate();
  };

  const handleSave = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    toggleSaveMutation.mutate();
  };

  const handleShare = async () => {
    if (!dishDetails) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${(dishDetails as unknown as { dish: any }).dish.name} on Eatsy`,
          text: `Check out this delicious ${
            (dishDetails as unknown as { dish: any }).dish.name
          } by ${(dishDetails as unknown as { cook: any }).cook.fullName} on Eatsy!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing dish:", error);
      }
    } else {
      // Fallback for browsers that don't support share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        duration: 3000,
      });
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    addToCartMutation.mutate();
  };

  const handleBuyNow = () => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    buyNowMutation.mutate();
  };

  const calculateTotalPrice = () => {
    if (!dishDetails) return 0;
    return ((dishDetails as unknown as { dish: any }).dish.price as unknown as number) * quantity;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !dishDetails) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h2 className="mb-2 text-2xl font-bold">Error Loading Dish</h2>
        <p className="mb-4 text-gray-500">
          We couldn&apos;t load this dish&apos;s details. Please try again.
        </p>
        <Button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/dishes", dishId] })}
        >
          Try Again
        </Button>
      </div>
    );
  }

  const { dish, cook, isLiked, isSaved } = dishDetails as unknown as {
    dish: any;
    cook: any;
    isLiked: boolean;
    isSaved: boolean;
  };

  return (
    <div className="container mx-auto pb-20">
      {/* Header Image */}
      <div className="relative">
        <div className="h-64 w-full overflow-hidden md:h-96">
          <img src={dish.imageUrl} alt={dish.name} className="h-full w-full object-cover" />
        </div>

        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
            onClick={() => window.history.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className={`rounded-full ${
                isLiked
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/80 backdrop-blur-sm hover:bg-white/90"
              }`}
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-white text-white" : ""}`} />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className={`rounded-full ${
                isSaved
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-white/80 backdrop-blur-sm hover:bg-white/90"
              }`}
              onClick={handleSave}
            >
              <BookmarkPlus className={`h-5 w-5 ${isSaved ? "text-white" : ""}`} />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dish Info */}
      <div className="mt-6 px-4 md:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{dish.name}</h1>

            <div className="mt-2 flex items-center gap-4">
              <div className="flex items-center text-amber-500">
                <Star className="mr-1 h-4 w-4 fill-current" />
                <span>{dish.rating || "4.5"}</span>
                <span className="ml-1 text-gray-500">({dish.ratingCount || 0})</span>
              </div>

              <div className="flex items-center text-gray-500">
                <Clock className="mr-1 h-4 w-4" />
                <span>{dish.prepTime}</span>
              </div>

              {dish.hasVeganOption && (
                <div className="flex items-center text-green-600">
                  <Leaf className="mr-1 h-4 w-4" />
                  <span>Vegan Option</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-primary">
              ₦{Math.round(dish.price / 100).toLocaleString()}
            </div>

            {dish.originalPrice && dish.originalPrice > dish.price && (
              <div className="text-sm text-gray-500 line-through">
                ₦{Math.round(dish.originalPrice / 100).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Cook info link */}
        <Link href={`/cooks/${cook.id}`}>
          <div className="mt-6 flex cursor-pointer items-center rounded-lg border p-3 transition hover:bg-gray-50">
            <Avatar className="h-12 w-12">
              <AvatarImage src={cook.profileImage || undefined} />
              <AvatarFallback className="bg-orange-100 text-orange-500">
                {cook.fullName
                  ?.split(" ")
                  .map((n: any) => n[0])
                  .join("")
                  .toUpperCase() || "C"}
              </AvatarFallback>
            </Avatar>

            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-900">{cook.fullName}</p>
              <p className="text-sm text-gray-500">{cook.location || "New York, USA"}</p>
            </div>

            <div className="flex text-primary">View Profile</div>
          </div>
        </Link>

        {/* Description */}
        <div className="mt-6">
          <h2 className="mb-2 text-xl font-semibold">Description</h2>
          <p className="text-gray-700">{dish.description}</p>
        </div>

        {/* Tags */}
        {dish.tags && dish.tags.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2 text-xl font-semibold">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {dish.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-8" />
      </div>

      {/* Bottom Order Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t bg-white p-4">
        <div className="flex items-center rounded-md border">
          <Button
            variant="ghost"
            size="icon"
            onClick={decreaseQuantity}
            disabled={quantity <= 1}
            className="h-10 w-10 rounded-none border-r"
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="flex h-10 min-w-[40px] items-center justify-center px-4">{quantity}</div>

          <Button
            variant="ghost"
            size="icon"
            onClick={increaseQuantity}
            className="h-10 w-10 rounded-none border-l"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-4 flex flex-1 gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Add to Cart
          </Button>

          <Button className="flex-1" onClick={handleBuyNow} disabled={buyNowMutation.isPending}>
            {buyNowMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Buy Now • ₦{Math.round(calculateTotalPrice() / 100).toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
