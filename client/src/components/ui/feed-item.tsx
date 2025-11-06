import { useState } from "react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/constants/queryClient";
import { Dish, User } from "@shared/schema";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Bookmark, Star, Clock, PanelTopOpen, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/constants/api-client";

interface FeedItemProps {
  dish: Dish;
  cook: User;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
}

export function FeedItem({
  dish,
  cook,
  likes,
  comments,
  isLiked: initialIsLiked,
  isSaved: initialIsSaved,
}: FeedItemProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likeCount, setLikeCount] = useState(likes);
  const { toast } = useToast();

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/api/dishes/${dish.id}/toggle-like`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/dishes/${dish.id}`] });
    },
    onError: (error) => {
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
      toast({
        title: "Error",
        description: `Failed to ${isLiked ? "unlike" : "like"} dish: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const toggleSaveMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/api/dishes/${dish.id}/toggle-save`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/dishes/${dish.id}`] });
    },
    onError: (error) => {
      // Revert optimistic update
      setIsSaved(!isSaved);
      toast({
        title: "Error",
        description: `Failed to ${isSaved ? "unsave" : "save"} dish: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    toggleLikeMutation.mutate();
  };

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    toggleSaveMutation.mutate();
  };

  const orderDishMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/orders/add-item", {
        dishId: dish.id,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/orders/current`] });
      toast({
        title: "Added to cart",
        description: `${dish.name} has been added to your order.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add dish to order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <article className="hover:shadow-cardHover mb-6 overflow-hidden rounded-xl bg-white shadow-card transition-all">
      {/* Cook Header */}
      <div className="flex items-center p-4">
        <Link href={`/cooks/${cook.id}`}>
          <div className="flex flex-grow cursor-pointer items-center">
            <Avatar className="mr-3 h-10 w-10">
              {cook.profileImage ? (
                <AvatarImage src={cook.profileImage} alt={cook.fullName} />
              ) : (
                <AvatarFallback>{cook?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">{cook.fullName}</h3>
                {cook.isFeaturedCook && (
                  <Badge
                    variant="outline"
                    className="ml-1 bg-primary bg-opacity-10 text-xs text-primary"
                  >
                    Top Cook
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {cook.cuisine} • {cook.location}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Food Image */}
      <div className="relative">
        <img src={dish.imageUrl} alt={dish.name} className="h-80 w-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-xl font-bold text-white">{dish.name}</h2>
          <p className="text-sm text-white text-opacity-90">{dish.description}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center p-0 ${
              isLiked ? "text-red-500" : "text-muted-foreground"
            }`}
            onClick={handleToggleLike}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
            <span className="ml-1 text-sm">{likeCount}</span>
          </Button>
          <Link href={`/dish/${dish.id}/comments`}>
            <div className="flex cursor-pointer items-center p-0 text-muted-foreground">
              <MessageSquare className="h-5 w-5" />
              <span className="ml-1 text-sm">{comments}</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center p-0 ${
              isSaved ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={handleToggleSave}
          >
            <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center">
          <div className="mr-3">
            <span className="font-bold">₦{dish.price.toLocaleString()}</span>
            {dish.originalPrice && (
              <span className="ml-1 text-sm text-muted-foreground line-through">
                ₦{dish.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <Button
            className="rounded-full bg-primary font-medium text-white"
            size="sm"
            onClick={() => orderDishMutation.mutate()}
            disabled={orderDishMutation.isPending}
          >
            Order Now
          </Button>
        </div>
      </div>

      {/* Food Details */}
      <div className="border-t border-muted px-4 pb-4 pt-3">
        <div className="mb-2 flex text-sm">
          <div className="mr-4 flex items-center">
            <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
            <span>{dish.prepTime}</span>
          </div>
          <div className="mr-4 flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span>
              {dish.rating?.toFixed(1) || "0.0"} ({dish.ratingCount || 0})
            </span>
          </div>
          {dish.isPopular && (
            <div className="flex items-center">
              <Flame className="mr-1 h-4 w-4 text-[#FF9F1C]" />
              <span>Popular</span>
            </div>
          )}
          {dish.hasVeganOption && (
            <div className="ml-4 flex items-center">
              <PanelTopOpen className="mr-1 h-4 w-4 text-[#2EC4B6]" />
              <span>Vegan option</span>
            </div>
          )}
        </div>

        <p className="mb-2 text-sm text-muted-foreground">{dish.description}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {dish.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="rounded-full bg-muted px-2 py-0.5 text-xs"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
    </article>
  );
}
