import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCartStore } from "@/stores/cart-store";
import {
  Clock,
  Star,
  Heart,
  Bookmark,
  ChevronLeft,
  MinusCircle,
  PlusCircle,
  ChefHat,
  Users,
  Info,
  AlertCircle,
} from "lucide-react";
import { queryClient } from "@/lib/constants/queryClient";
import { api } from "@/lib/constants/api-client";
import { Dish } from "@shared/schema";

const DishDetailsPage = () => {
  const { id } = useParams();
  const [, navigate] = useLocation();
  // const { user } = useAuth();
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Fetch dish details
  const {
    data: dishData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/dishes/${id}`],
    queryFn: () => api.get(`/api/dishes/${id}`),
    enabled: !!id,
  });

  console.log("dishData", dishData);
  console.log("dishData", id);

  // Toggle like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/api/dishes/${id}/toggle-like`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/dishes/${id}`] });
      toast({
        title: "Updated like status",
        duration: 2000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update like status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/api/dishes/${id}/toggle-save`);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/dishes/${id}`] });
      toast({
        title: "Updated save status",
        duration: 2000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update save status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!dishData) return;

    addItem({
      id: (dishData as unknown as { dish: { id: number } }).dish.id.toString(),
      name: (dishData as unknown as { dish: { name: string } }).dish.name,
      description: (dishData as unknown as { dish: { description: string } }).dish.description,
      price: (dishData as unknown as { dish: { price: number } }).dish.price,
      imageUrl: (dishData as unknown as { dish: { imageUrl: string } }).dish.imageUrl,
      cookId: (dishData as unknown as { cook: { id: number } }).cook.id.toString(),
      cookName: (dishData as unknown as { cook: { fullName: string } }).cook.fullName,
      tags: (dishData as unknown as { dish: { tags: string[] } }).dish.tags || [],
    });

    toast({
      title: "Added to cart",
      description: `${quantity} × ${
        (dishData as unknown as { dish: { name: string } }).dish.name
      } added to your cart`,
    });

    // Reset quantity
    setQuantity(1);
    setSpecialInstructions("");
  };

  const handleBack = () => {
    navigate("/dishes");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto flex min-h-[60vh] items-center justify-center py-6">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !dishData) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to dishes
        </Button>
        <Card className="p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-bold text-red-500">Dish Not Found</h2>
          <p className="mb-4 text-gray-500">
            The dish you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={handleBack}>Browse Other Dishes</Button>
        </Card>
      </div>
    );
  }

  const { dish, cook, likes, isLiked, isSaved } = dishData as unknown as {
    dish: Dish;
    cook: any;
    likes: number;
    comments: number;
    isLiked: boolean;
    isSaved: boolean;
  };

  // Calculate total price
  const totalPrice = dish.price * quantity;
  const hasDiscount = dish.originalPrice && dish.originalPrice > dish.price;

  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" onClick={handleBack} className="mb-4">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to dishes
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Image */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={dish.imageUrl}
              alt={dish.name}
              className="h-auto w-full rounded-lg object-cover"
            />
            {dish.isPopular && (
              <Badge className="absolute right-4 top-4" variant="secondary">
                Popular
              </Badge>
            )}
          </div>

          {/* Dish Information */}
          <div className="mt-6">
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold">{dish.name}</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => likeMutation.mutate()}>
                  <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>

                <Button variant="ghost" size="icon" onClick={() => saveMutation.mutate()}>
                  <Bookmark className={`h-6 w-6 ${isSaved ? "fill-primary text-primary" : ""}`} />
                </Button>
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={cook.profileImage} />
                <AvatarFallback className="bg-orange-100 text-orange-500">
                  {cook.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">
                By <span className="font-medium">{cook.fullName}</span>
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <Star className="mr-1 h-5 w-5 fill-amber-500 text-amber-500" />
                <span>{dish.rating || 4.5}</span>
                <span className="ml-1 text-sm text-gray-500">
                  ({dish.ratingCount || 0} ratings)
                </span>
              </div>

              <div className="flex items-center">
                <Clock className="mr-1 h-5 w-5 text-gray-500" />
                <span>{dish.prepTime} prep time</span>
              </div>

              <div className="flex items-center">
                <Heart className="mr-1 h-5 w-5 text-gray-500" />
                <span>{likes} likes</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="mb-2 text-xl font-semibold">About this dish</h2>
              <p className="mb-6 text-gray-700">{dish.description}</p>

              {dish.tags && dish.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {dish.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="mb-6 flex flex-wrap gap-6">
                {dish.isAvailable && (
                  <div className="flex items-center text-green-600">
                    <Info className="mr-1 h-5 w-5" />
                    <span>Available today</span>
                  </div>
                )}

                {dish.hasVeganOption && (
                  <div className="flex items-center text-green-600">
                    <Info className="mr-1 h-5 w-5" />
                    <span>Vegan option available</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h2 className="mb-4 text-xl font-semibold">About the cook</h2>
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={cook.profileImage} />
                  <AvatarFallback className="bg-orange-100 text-xl text-orange-500">
                    {cook.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-lg font-semibold">{cook.fullName}</h3>
                  <p className="text-sm text-gray-500">{cook.location || "New York, USA"}</p>

                  <div className="mt-2 flex gap-4">
                    <div className="flex items-center">
                      <ChefHat className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm">Cook since 2023</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4 text-gray-500" />
                      <span className="text-sm">245 orders</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => navigate(`/cooks/${cook.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Information */}
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h2 className="mb-1 text-2xl font-bold">₦{dish.price.toLocaleString()}</h2>

              {hasDiscount && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-gray-500 line-through">
                    ₦{dish.originalPrice?.toLocaleString()}
                  </span>
                  <Badge variant="outline" className="border-green-600 text-green-600">
                    {Math.round(((dish.originalPrice! - dish.price) / dish.originalPrice!) * 100)}%
                    OFF
                  </Badge>
                </div>
              )}

              <Separator className="my-4" />

              <div className="mb-6">
                <h3 className="mb-2 font-semibold">Quantity</h3>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 text-lg font-medium">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="mb-2 font-semibold">Special Instructions</h3>
                <textarea
                  className="h-24 w-full resize-none rounded-md border p-2 text-sm"
                  placeholder="Any specific preferences or dietary restrictions? Let the cook know here."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span>
                    Price ({quantity} {quantity === 1 ? "item" : "items"})
                  </span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Fee</span>
                  <span>₦500</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{(totalPrice + 500).toLocaleString()}</span>
                </div>
              </div>

              <>
                <Button className="w-full" onClick={handleAddToCart}>
                  Add to Cart
                </Button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  Your order will be delivered in 45-60 minutes
                </p>

                <Button
                  variant="link"
                  className="mt-2 w-full"
                  size="sm"
                  onClick={() => navigate("/cart")}
                >
                  View cart & checkout
                </Button>
              </>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DishDetailsPage;
