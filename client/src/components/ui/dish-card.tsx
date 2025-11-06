import React from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Clock, ChevronRight, Plus } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useToast } from "@/hooks/use-toast";
import { demoDishes } from "@/mocks/data";

interface DishCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  prepTime: string;
  tags: string[];
  cookId: number;
  cookName: string;
  cookImage?: string;
  isPopular?: boolean;
  isLiked?: boolean;
  onLike?: (id: number) => void;
  onAddToCart?: (id: number) => void;
}

export function DishCard({
  id,
  name,
  description,
  price,
  originalPrice,
  imageUrl,
  prepTime,
  tags,
  cookId,
  cookName,
  cookImage,
  isPopular = false,
  isLiked = false,
  onLike,
  onAddToCart,
}: DishCardProps) {
  const { addItem } = useCartStore();
  const { toast } = useToast();
  // const currentQuantity = getItemQuantity(id.toString());
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <Link href={`/dishes/${id}`}>
          <img src={imageUrl} alt={name} className="h-48 w-full object-cover" />
        </Link>

        {isPopular && (
          <Badge className="absolute left-2 top-2 bg-orange-500 text-white">Popular</Badge>
        )}

        <button
          onClick={() => onLike?.(id)}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md"
        >
          <Heart
            className={`h-4 w-4 ${isLiked ? "text-red-500" : "text-gray-500"}`}
            fill={isLiked ? "#ef4444" : "none"}
          />
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-2">
          <Badge className="flex items-center gap-1 bg-white text-gray-700">
            <Clock className="h-3 w-3" /> {prepTime}
          </Badge>

          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} className="bg-white/80 text-gray-700">
              {tag}
            </Badge>
          ))}

          {tags.length > 2 && (
            <Badge className="bg-white/80 text-gray-700">+{tags.length - 2}</Badge>
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="mb-2 flex items-center">
          <Link href={`/cooks/${cookId}`}>
            <Avatar className="mr-2 h-6 w-6 object-cover">
              <AvatarImage className="object-cover" src={cookImage} alt={cookName} />
              <AvatarFallback className="bg-orange-100 text-xs text-orange-800">
                {cookName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link href={`/cooks/${cookId}`}>
            <span className="text-sm text-gray-600 hover:text-orange-500">{cookName}</span>
          </Link>
        </div>

        <Link href={`/dishes/${id}`}>
          <h3 className="mb-1 font-bold hover:text-orange-500">{name}</h3>
        </Link>

        <p className="mb-2 line-clamp-2 text-sm text-gray-500">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <span className="font-semibold">₦{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₦{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <Button
            size="sm"
            className="h-8 w-8 rounded-full bg-orange-500 p-0 hover:bg-orange-600"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem({
                id: id.toString(),
                name,
                description,
                price,
                imageUrl,
                cookId: cookId.toString(),
                cookName,
                tags,
              });
              onAddToCart?.(id);
              toast({
                title: "Added to cart!",
                description: `${name} has been added to your cart.`,
              });
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PopularDishesSection() {
  const [likedState, setLikedState] = React.useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const handleToggleLike = (dishId: number) => {
    setLikedState((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = (dishId: number) => {
    const dish = demoDishes.find((d) => d.id === dishId.toString());
    if (dish) {
      addItem({
        id: dish.id,
        name: dish.title,
        description: dish.caption,
        price: parseInt(dish.price.replace(/[₦,]/g, "")) || 0,
        imageUrl: dish.image,
        cookId: dish.cookId,
        cookName: dish.cookName,
        tags: [], // We'll need to add tags to the new structure or derive them
      });
      toast({
        title: "Added to cart!",
        description: `${dish.title} has been added to your cart.`,
      });
    }
  };

  // Use data from demoDishes and filter for popular dishes (high rating or likes)
  const popularDishes = demoDishes
    .filter((dish) => dish.rating >= 4.7 || dish.likes >= 150)
    .slice(0, 4)
    .map((dish) => ({
      id: parseInt(dish.id),
      name: dish.title,
      description: dish.caption,
      price: parseInt(dish.price.replace(/[₦,]/g, "")) || 0,
      originalPrice: undefined,
      imageUrl: dish.image,
      prepTime: "25-35 min", // Default since this isn't in the new structure
      tags: [], // We'll need to add tags to the new structure or derive them
      cookId: parseInt(dish.cookId),
      cookName: dish.cookName,
      cookImage: dish.cookImage,
      isPopular: true,
    }));

  return (
    <div className="py-3">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Popular Dishes</h2>
        <Link href="/dishes" className="flex items-center text-sm text-orange-500">
          See all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-4">
        {popularDishes.map((dish) => (
          <DishCard
            key={dish.id}
            {...dish}
            isLiked={likedState[dish.id] || false}
            onLike={handleToggleLike}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
