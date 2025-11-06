import React from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ChefHat } from "lucide-react";
import { demoCooks } from "@/mocks/data";

interface CookProfileCardProps {
  id: number;
  name: string;
  avatar?: string;
  cuisine: string;
  location: string;
  rating: number;
  totalOrders: number;
  isVerified: boolean;
  isFeatured: boolean;
  isFollowing: boolean;
  onToggleFollow: (id: number) => void;
}

export function CookProfileCard({
  id,
  name,
  avatar,
  cuisine,
  location,
  rating,
  totalOrders,
  isVerified,
  isFeatured,
  isFollowing,
  onToggleFollow,
}: CookProfileCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-16 bg-orange-50">
        {isFeatured && (
          <div className="absolute right-2 top-2">
            <Badge className="bg-orange-500 text-white">Featured Cook</Badge>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 pt-0">
        <div className="-mt-8 mb-2 flex justify-center">
          <Avatar className="h-16 w-16 border-4 border-white">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="bg-orange-100 text-lg text-orange-800">
              {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="mb-3 text-center">
          <Link href={`/cooks/${id}`}>
            <h3 className="flex items-center justify-center gap-1 text-lg font-semibold">
              {name}
              {isVerified && (
                <span className="text-blue-500" title="Verified Cook">
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </h3>
          </Link>
          <p className="mb-1 text-sm text-gray-500">
            {cuisine} • {location}
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 text-yellow-500" fill="currentColor" />
              <span>{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <ChefHat className="mr-1 h-4 w-4" />
              <span>{totalOrders}+ orders</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onToggleFollow(id)}
          variant={isFollowing ? "outline" : "default"}
          className={
            isFollowing
              ? "w-full border-orange-500 text-orange-500 hover:bg-orange-50"
              : "w-full bg-orange-500 hover:bg-orange-600"
          }
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
}

export function FeaturedCooksSection() {
  const [followingState, setFollowingState] = React.useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
  });

  const handleToggleFollow = (cookId: number) => {
    setFollowingState((prev) => ({
      ...prev,
      [cookId]: !prev[cookId],
    }));
  };

  const featuredCooks = demoCooks
    .filter((cook) => cook.isFeaturedCook)
    .map((cook) => ({
      id: cook.id,
      name: cook.fullName ?? "",
      avatar: cook.profileImage,
      cuisine: cook.cuisine ?? "",
      location: cook.location ?? "",
      rating: 4.6 + Math.random() * 0.4, // Mock rating between 4.6-5.0
      totalOrders: Math.floor(Math.random() * 300) + 100, // Mock orders between 100-400
      isVerified: cook.isFeaturedCook ?? false,
      isFeatured: cook.isFeaturedCook ?? false,
    }));

  return (
    <div className="py-3">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Featured Cooks</h2>
        <Link href="/cooks" className="text-sm text-orange-500">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {featuredCooks.map((cook) => (
          <CookProfileCard
            key={cook.id}
            {...cook}
            isFollowing={followingState[cook.id] || false}
            onToggleFollow={handleToggleFollow}
          />
        ))}
      </div>
    </div>
  );
}
