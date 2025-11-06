import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import {
  Heart,
  Share,
  Bookmark,
  Play,
  MoreHorizontal,
  MessageCircle,
  Star,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FeedContent {
  id: string;
  type: "image" | "video" | "text";
  url?: string;
  content?: string;
  caption: string;
  cook: {
    id: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
  rating?: number;
  distance?: string;
  price?: number;
  isLiked: boolean;
  isSaved: boolean;
  createdAt: string;
}

interface FeedCardProps {
  content: FeedContent;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
  onShare: (id: string) => void;
  onComment: (id: string) => void;
  onAddToCart?: (id: string) => void;
  isInView: boolean;
}

export function FeedCard({
  content,
  onLike,
  onSave,
  onShare,
  onComment,
  onAddToCart,
  isInView,
}: FeedCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (content.type === "video" && videoRef.current) {
      if (isInView && !isPlaying) {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      } else if (!isInView && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isInView, content.type, isPlaying]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "now";
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  };

  const truncateCaption = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${content.cook.name}'s post on Eatsy`,
          text: content.caption,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Share cancelled");
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could show a toast notification here
      } catch (error) {
        console.error("Failed to copy to clipboard");
      }
    }
    onShare(content.id);
  };

  return (
    <div className="mx-auto max-w-sm overflow-hidden border-b-4 border-orange-100 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <Link href={`/cooks/${content.cook.id}`}>
          <div className="flex cursor-pointer items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={content.cook.avatar} alt={content.cook.name} />
                <AvatarFallback className="bg-orange-100 text-orange-600">
                  {content.cook.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {content.cook.isVerified && (
                <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 transition-colors hover:text-orange-500">
                {content.cook.name}
              </h3>
              <p className="text-xs text-gray-500">{formatTimeAgo(content.createdAt)}</p>
            </div>
          </div>
        </Link>
        <Button variant="ghost" size="sm" className="h-auto p-1">
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </Button>
      </div>

      {/* Content */}
      <div className="relative">
        {content.type === "image" && (
          <img
            src={content.url}
            alt="Post content"
            className="aspect-square w-full object-cover"
            loading="lazy"
          />
        )}

        {content.type === "video" && (
          <div className="relative aspect-square">
            <video
              ref={videoRef}
              src={content.url}
              className="h-full w-full cursor-pointer object-cover"
              loop
              muted
              playsInline
              onClick={togglePlayPause}
            />
            {!isPlaying && (
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 transition-opacity"
              >
                <Play className="h-16 w-16 text-white opacity-80" />
              </button>
            )}
          </div>
        )}

        {content.type === "text" && (
          <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 p-8">
            <p className="text-center text-lg font-medium leading-relaxed text-white">
              {content.content}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(content.id)}
              className={cn(
                "flex items-center space-x-1 transition-colors",
                content.isLiked ? "text-red-500" : "text-gray-700 hover:text-red-500"
              )}
            >
              <Heart className={cn("h-6 w-6", content.isLiked ? "fill-current" : "")} />
              <span className="text-sm font-medium">{formatCount(content.stats.likes)}</span>
            </button>

            <button
              onClick={() => onComment(content.id)}
              className="flex items-center space-x-1 text-gray-700 transition-colors hover:text-gray-900"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm font-medium">{formatCount(content.stats.comments)}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 text-gray-700 transition-colors hover:text-gray-900"
            >
              <Share className="h-6 w-6" />
              <span className="text-sm font-medium">{formatCount(content.stats.shares)}</span>
            </button>
          </div>

          <button
            onClick={() => onSave(content.id)}
            className={cn(
              "transition-colors",
              content.isSaved ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
            )}
          >
            <Bookmark className={cn("h-6 w-6", content.isSaved ? "fill-current" : "")} />
          </button>
        </div>

        {/* Additional Info Section */}
        <div className="mb-3 flex items-center justify-between border-t border-gray-100 py-2">
          <div className="flex items-center space-x-4">
            {/* Rating */}
            {content.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {content.rating.toFixed(1)}
                </span>
              </div>
            )}

            {/* Distance */}
            {content.distance && (
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{content.distance}</span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          {content.price && onAddToCart && (
            <Button
              onClick={() => onAddToCart(content.id)}
              size="sm"
              className="h-auto rounded-full bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600"
            >
              <ShoppingCart className="mr-1 h-3 w-3" />₦{content.price.toLocaleString()}
            </Button>
          )}
        </div>

        {/* Caption */}
        <div className="text-sm">
          <Link href={`/cooks/${content.cook.id}`}>
            <span className="cursor-pointer font-semibold text-gray-900 transition-colors hover:text-orange-500">
              {content.cook.name}
            </span>
          </Link>
          <span className="ml-2 text-gray-700">
            {showFullCaption || content.caption.length <= 100
              ? content.caption
              : truncateCaption(content.caption)}
            {content.caption.length > 100 && (
              <button
                onClick={() => setShowFullCaption(!showFullCaption)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                {showFullCaption ? " less" : "... more"}
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
