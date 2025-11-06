import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/constants/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/constants/queryClient";
import { api } from "@/lib/constants/api-client";
import { HireChefModal } from "@/components/ui/hire-chef-modal";
import { PreOrderModal } from "@/components/ui/pre-order-modal";
import { RECOMMENDED_DISHES } from "@/mocks/data";
import {
  Loader2,
  Heart,
  Clock,
  Star,
  Share2,
  MessageSquare,
  ChefHat,
  Calendar,
} from "lucide-react";

const CookProfilePage = () => {
  const [_activeTab, setActiveTab] = useState("dishes");
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [isPreOrderModalOpen, setIsPreOrderModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<{
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    cookId: number;
    description: string;
    prepTime: string;
    tags: string[];
  } | null>(null);
  const { id } = useParams();
  const cookId = parseInt(id || "1");
  const { toast } = useToast();

  const {
    data: profile,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`/api/cooks/${cookId}`],
    queryFn: getQueryFn(),
    enabled: !!cookId,
  });

  const handleFollow = async () => {
    // if (!user) {
    //   setLocation("/auth");
    //   return;
    // }

    try {
      const response = await api.post(`/api/cooks/${cookId}/follow`);
      const result = (await response) as unknown as {
        success: boolean;
        isFollowing: boolean;
      };

      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/cooks", cookId] });
        toast({
          title: (result as unknown as { isFollowing: boolean }).isFollowing
            ? "Following this cook"
            : "Unfollowed this cook",
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow/unfollow. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleHireChef = () => {
    setIsHireModalOpen(true);
  };

  const handlePreOrder = (dish: any) => {
    setSelectedDish(dish);
    setIsPreOrderModalOpen(true);
  };

  const handleHireComplete = () => {
    toast({
      title: "Chef Hiring Request Sent!",
      description: `Your request to hire ${
        (profile as unknown as { data: { cook: { fullName: string } } }).data.cook.fullName
      } has been submitted. They will contact you within 24 hours.`,
      duration: 5000,
    });
    setIsHireModalOpen(false);
  };

  const handlePreOrderComplete = () => {
    toast({
      title: "Pre-order Scheduled!",
      description: `Your pre-order for ${selectedDish?.name} has been scheduled successfully.`,
      duration: 5000,
    });
    setIsPreOrderModalOpen(false);
    setSelectedDish(null);
  };

  const handleShare = async () => {
    if (navigator.share && profile) {
      try {
        await navigator.share({
          title: `${
            (profile as unknown as { cook: { fullName: string } }).cook.fullName
          } - Chef on Eatsy`,
          text: `Check out ${
            (profile as unknown as { cook: { fullName: string } }).cook.fullName
          }'s delicious food on Eatsy!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing profile:", error);
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

  const handleMessage = () => {
    // if (!user) {
    //   setLocation("/auth");
    //   return;eve
    // }
    // Implement chat functionality
    toast({
      title: "Chat feature",
      description: "Chat feature coming soon!",
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <h2 className="mb-2 text-2xl font-bold">Error Loading Profile</h2>
        <p className="mb-4 text-gray-500">
          We couldn&apos;t load this cook&apos;s profile. Please try again.
        </p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/cooks", cookId] })}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-6">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div className="h-40 rounded-t-lg bg-gradient-to-r from-orange-500 to-orange-300" />

        <div className="absolute -bottom-16 left-8">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage
              src={
                (profile as unknown as { cook: { profileImage: string } }).cook.profileImage ||
                undefined
              }
            />
            <AvatarFallback className="bg-orange-100 text-2xl text-orange-500">
              {(profile as unknown as { cook: { fullName: string } }).cook.fullName
                ?.split(" ")
                .map((n: any) => n[0])
                .join("")
                .toUpperCase() || "C"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="mt-16 px-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {(profile as unknown as { cook: { fullName: string } }).cook.fullName}
            </h1>

            {(profile as unknown as { cook: { cuisine: string } }).cook.cuisine && (
              <p className="mt-1 text-orange-600">
                {(profile as unknown as { cook: { cuisine: string } }).cook.cuisine} Cuisine
              </p>
            )}

            {(profile as unknown as { cook: { location: string } }).cook.location && (
              <p className="mt-1 flex items-center text-gray-500">
                <span className="mr-1">📍</span>{" "}
                {(profile as unknown as { cook: { location: string } }).cook.location}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleHireChef}
              className="w-full bg-orange-600 hover:bg-orange-700 sm:w-auto"
            >
              <ChefHat className="mr-2 h-4 w-4" />
              Hire Chef
            </Button>

            <Button
              variant={
                (profile as unknown as { isFollowing: boolean }).isFollowing
                  ? "outline"
                  : "secondary"
              }
              onClick={handleFollow}
              className="w-full sm:w-auto"
            >
              {(profile as unknown as { isFollowing: boolean }).isFollowing
                ? "Following"
                : "Follow"}
            </Button>

            <Button variant="outline" onClick={handleMessage} className="w-full sm:w-auto">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>

            <Button variant="ghost" onClick={handleShare} className="w-full sm:w-auto">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-3 gap-4 border-y py-4">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {(profile as unknown as { stats: { followersCount: number } }).stats.followersCount}
            </p>
            <p className="text-gray-500">Followers</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">
              {(profile as unknown as { stats: { avgRating: number } }).stats.avgRating.toFixed(1)}
            </p>
            <p className="text-gray-500">Rating</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold">
              {(profile as unknown as { stats: { totalOrders: number } }).stats.totalOrders}
            </p>
            <p className="text-gray-500">Orders</p>
          </div>
        </div>

        {/* Bio Section */}
        {(profile as unknown as { cook: { bio: string } }).cook.bio && (
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold">About</h2>
            <p className="text-gray-700">
              {(profile as unknown as { cook: { bio: string } }).cook.bio}
            </p>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="dishes" className="mt-8" onValueChange={setActiveTab}>
          <TabsList className="mx-auto w-full max-w-md">
            <TabsTrigger value="dishes" className="flex-1">
              Dishes
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1">
              Reviews (
              {(profile as unknown as { stats: { ratingCount: number } }).stats.ratingCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dishes" className="mt-6">
            {/* Cook's Dishes Section */}
            {(profile as unknown as { dishes: any[] }).dishes.length > 0 ? (
              <>
                <h3 className="mb-4 text-xl font-semibold">
                  {(profile as unknown as { cook: { fullName: string } }).cook.fullName}
                  &apos;s Dishes
                </h3>
                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {(profile as unknown as { dishes: any[] }).dishes.map((item: any) => (
                    <Card key={item.dish.id} className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={item.dish.imageUrl}
                          alt={item.dish.name}
                          className="h-full w-full object-cover"
                        />
                        {item.dish.isPopular && (
                          <Badge className="absolute right-2 top-2" variant="secondary">
                            Popular
                          </Badge>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{item.dish.name}</CardTitle>
                          <div className="text-xl font-bold text-orange-600">
                            ₦{Math.round(item.dish.price / 100).toLocaleString()}
                          </div>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {item.dish.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center text-amber-500">
                              <Star className="mr-1 h-4 w-4 fill-current" />
                              <span>{item.dish.rating || 0}</span>
                            </div>

                            <div className="flex items-center text-gray-500">
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{item.dish.prepTime}</span>
                            </div>

                            <div className="flex items-center">
                              <Heart
                                className={`mr-1 h-4 w-4 ${
                                  item.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"
                                }`}
                              />
                              <span className="text-gray-500">{item.likes}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/dishes/${item.dish.id}`} className="flex-1">
                            <Button className="w-full">Order Now</Button>
                          </Link>
                          <Button
                            variant="outline"
                            onClick={() => handlePreOrder(item.dish)}
                            className="flex-1"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Pre-order
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : null}

            {/* Recommended Dishes Section */}
            <div>
              <h3 className="mb-4 text-xl font-semibold">Recommended Dishes</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {RECOMMENDED_DISHES.map((dish) => (
                  <Card key={dish.id} className="overflow-hidden">
                    <div className="relative aspect-video">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="h-full w-full object-cover"
                      />
                      <Badge className="absolute right-2 top-2 bg-green-500" variant="secondary">
                        Recommended
                      </Badge>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{dish.name}</CardTitle>
                        <div className="text-xl font-bold text-orange-600">{dish.price}</div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={dish.cookImage} />
                          <AvatarFallback className="text-xs">
                            {dish.cookName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">by {dish.cookName}</span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-amber-500">
                            <Star className="mr-1 h-4 w-4 fill-current" />
                            <span>{dish.rating}</span>
                          </div>

                          <div className="flex items-center text-gray-500">
                            <Clock className="mr-1 h-4 w-4" />
                            <span>25-35 min</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/dishes/${dish.id}`} className="flex-1">
                          <Button className="w-full">Order Now</Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handlePreOrder({
                              id: typeof dish.id === "number" ? dish.id : parseInt(dish.id),
                              name: dish.name,
                              price: parseInt(dish.price.replace(/[₦,]/g, "")) || 0,
                              imageUrl: dish.image,
                              cookId: cookId,
                              description: "",
                              prepTime: "25-35 min",
                              tags: [],
                            })
                          }
                          className="flex-1"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Pre-order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Show message if no dishes at all */}
            {(profile as unknown as { dishes: any[] }).dishes.length === 0 &&
              RECOMMENDED_DISHES.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No dishes available yet</p>
                </div>
              )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {/* Reviews Section */}
              {[
                {
                  id: 1,
                  user: {
                    name: "Chioma A.",
                    avatar:
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
                  },
                  rating: 5,
                  comment:
                    "Best jollof rice I've ever tasted! The smoky flavor is perfect and the rice was cooked to perfection. Mama really knows her way around the kitchen. Will definitely order again! 🔥",
                  date: "2 days ago",
                  dish: "Traditional Jollof Rice",
                },
                {
                  id: 2,
                  user: {
                    name: "Tunde O.",
                    avatar:
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                  },
                  rating: 5,
                  comment:
                    "The pepper soup was incredible! Perfect spice level and the meat was so tender. Reminded me of my grandmother's cooking. Fast delivery too. Highly recommended!",
                  date: "5 days ago",
                  dish: "Spicy Pepper Soup",
                },
                {
                  id: 3,
                  user: {
                    name: "Aisha M.",
                    avatar:
                      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
                  },
                  rating: 4,
                  comment:
                    "Amazing egusi soup! The pounded yam was fresh and soft. Only complaint is the portion could be a bit bigger for the price, but the taste makes up for it. Will order for my next party!",
                  date: "1 week ago",
                  dish: "Pounded Yam & Egusi",
                },
                {
                  id: 4,
                  user: {
                    name: "Emeka C.",
                    avatar:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  },
                  rating: 5,
                  comment:
                    "The suya was perfectly grilled! The yaji spice blend was spot on - not too spicy but very flavorful. Came with fresh vegetables and the meat was quality. This is authentic suya!",
                  date: "1 week ago",
                  dish: "Suya Platter",
                },
                {
                  id: 5,
                  user: {
                    name: "Fatima H.",
                    avatar:
                      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
                  },
                  rating: 5,
                  comment:
                    "Excellent food and service! Ordered for my family gathering and everyone loved it. The jollof rice had that perfect party rice taste. Chef really knows Nigerian cuisine. 10/10!",
                  date: "2 weeks ago",
                  dish: "Traditional Jollof Rice",
                },
                {
                  id: 6,
                  user: {
                    name: "Kemi A.",
                    avatar:
                      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                  },
                  rating: 4,
                  comment:
                    "Good food overall. The pepper soup was tasty and warming. Delivery was on time. Only suggestion would be to add more vegetables to the soup. Still a solid 4 stars!",
                  date: "2 weeks ago",
                  dish: "Spicy Pepper Soup",
                },
              ].map((review) => (
                <Card key={review.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.user.avatar} alt={review.user.name} />
                      <AvatarFallback className="bg-orange-100 text-orange-800">
                        {review.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold">{review.user.name}</h4>
                          <p className="text-xs text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-current text-amber-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <Badge variant="outline" className="mb-2 text-xs">
                        {review.dish}
                      </Badge>

                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Load More Reviews Button */}
              <div className="pt-4 text-center">
                <Button variant="outline" className="w-full sm:w-auto">
                  Load More Reviews
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <HireChefModal
        isOpen={isHireModalOpen}
        onClose={() => setIsHireModalOpen(false)}
        onComplete={handleHireComplete}
        cook={(profile as unknown as { cook: any }).cook}
      />

      {selectedDish && (
        <PreOrderModal
          isOpen={isPreOrderModalOpen}
          onClose={() => {
            setIsPreOrderModalOpen(false);
            setSelectedDish(null);
          }}
          onComplete={handlePreOrderComplete}
          dish={selectedDish}
          cook={(profile as unknown as { cook: any }).cook}
        />
      )}
    </div>
  );
};

export default CookProfilePage;
