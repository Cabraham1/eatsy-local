import { useState } from "react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Share2, Users } from "lucide-react";
import { demoLiveStreams, demoLiveStreamComments } from "@/mocks/data";

interface LiveStreamProps {
  streamId: string;
  cookId: number;
  cookName: string;
  cookImage?: string;
  title: string;
  viewers: number;
  isLive: boolean;
  previewImage: string;
  onJoinStream?: (streamId: string) => void;
}

export function LiveStreamCard({
  streamId,
  cookId,
  cookName,
  cookImage,
  title,
  viewers,
  isLive,
  previewImage,
  onJoinStream,
}: LiveStreamProps) {
  return (
    <div className="relative grid rounded-lg border shadow-sm">
      <div className="relative h-40">
        <img src={previewImage} alt={title} className="absolute h-full w-full object-cover" />
        {isLive && <Badge className="absolute left-2 top-2 bg-red-500 text-white">LIVE</Badge>}
        <div className="absolute right-2 top-2 flex items-center space-x-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          <Users className="h-3 w-3" />
          <span>{viewers}</span>
        </div>
      </div>

      <div className="flex h-full flex-col justify-between p-3">
        <div className="">
          <div className="mb-2 flex items-center">
            <Link href={`/cooks/${cookId}`}>
              <Avatar className="mr-2 h-8 w-8 object-cover">
                <AvatarImage src={cookImage} className="object-cover" alt={cookName} />

                <AvatarFallback className="bg-orange-100 text-orange-800">
                  {cookName.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/cooks/${cookId}`}>
                <span className="text-sm font-medium hover:text-orange-500">{cookName}</span>
              </Link>
            </div>
          </div>

          <h3 className="mb-2 line-clamp-1 text-sm font-medium">{title}</h3>
        </div>
        <Button
          onClick={() => onJoinStream?.(streamId)}
          className="hover:bg~-orange-600 w-full bg-orange-500 text-white"
          size="sm"
        >
          {isLive ? "Join Stream" : "Watch Replay"}
        </Button>
      </div>
    </div>
  );
}

interface LiveStreamViewerProps {
  streamId: string;
  cookId: number;
  cookName: string;
  cookImage?: string;
  title: string;
  onClose: () => void;
}

export function LiveStreamViewer({ cookName, cookImage, title, onClose }: LiveStreamViewerProps) {
  const [comments, setComments] = useState(demoLiveStreamComments);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(24);
  const [viewerCount] = useState(103);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          user: "You",
          content: newComment,
          time: "Just now",
        },
      ]);
      setNewComment("");
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between bg-black px-4 py-3 text-white">
        <div className="flex items-center">
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage src={cookImage} alt={cookName} />
            <AvatarFallback className="bg-orange-500 text-white">
              {cookName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium">{cookName}</div>
            <div className="flex items-center text-xs text-gray-400">
              <Badge className="mr-2 h-4 bg-red-500 px-1 text-xs text-white">LIVE</Badge>
              {viewerCount} viewers
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white"
        >
          ✕
        </button>
      </div>

      {/* Video area */}
      <div className="relative flex flex-1 items-center justify-center bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1556911220-bda9f7f4fe9d?q=80&w=2340&auto=format&fit=crop"
          alt="Live Cooking Stream"
          className="max-h-full max-w-full object-contain"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2 className="font-medium text-white">{title}</h2>
        </div>
      </div>

      {/* Comments and actions */}
      <div className="flex h-80 flex-col bg-white">
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex space-x-4">
            <button
              className={`flex items-center space-x-1 ${
                isLiked ? "text-red-500" : "text-gray-500"
              }`}
              onClick={handleLike}
            >
              <Heart className="h-5 w-5" fill={isLiked ? "#ef4444" : "none"} />
              <span>{likeCount}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500">
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length}</span>
            </button>
          </div>
          <button className="flex items-center space-x-1 text-gray-500">
            <Share2 className="h-5 w-5" />
            <span>Share</span>
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex">
              <span className="mr-1 font-medium">{comment.user}:</span>
              <span className="flex-1">{comment.content}</span>
              <span className="text-xs text-gray-400">{comment.time}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center border-t p-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 rounded-full border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddComment();
              }
            }}
          />
          <Button
            onClick={handleAddComment}
            className="ml-2 bg-orange-500 hover:bg-orange-600"
            size="sm"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export function LiveCookingSection() {
  const [viewingStream, setViewingStream] = useState<string | null>(null);

  // Use centralized live streams data
  const liveStreams = demoLiveStreams;

  const currentStream = liveStreams.find((stream) => stream.streamId === viewingStream);

  return (
    <div className="py-3">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Live Cooking</h2>
        <Link href="/live-cooking" className="text-sm text-orange-500">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-3">
        {liveStreams.map((stream) => (
          <LiveStreamCard
            key={stream.streamId}
            {...stream}
            onJoinStream={() => setViewingStream(stream.streamId)}
          />
        ))}
      </div>

      {viewingStream && currentStream && (
        <LiveStreamViewer
          streamId={currentStream.streamId}
          cookId={currentStream.cookId}
          cookName={currentStream.cookName}
          cookImage={currentStream.cookImage}
          title={currentStream.title}
          onClose={() => setViewingStream(null)}
        />
      )}
    </div>
  );
}
