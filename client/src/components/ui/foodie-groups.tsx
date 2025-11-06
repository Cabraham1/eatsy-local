import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Users,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { demoFoodieGroups, demoGroupPosts, type FoodieGroup, type GroupPost } from "@/mocks/data";

export function FoodieGroupCard({
  group,
  onToggleJoin,
}: {
  group: FoodieGroup;
  onToggleJoin: (id: number) => void;
}) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-32">
        <img src={group.image} alt={group.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 text-white">
          <h3 className="text-lg font-bold">{group.name}</h3>
          <div className="flex items-center text-xs">
            <Users className="mr-1 h-3 w-3" />
            {group.memberCount} members
          </div>
        </div>
      </div>

      <CardContent className="p-3">
        <p className="mb-2 line-clamp-2 text-sm text-gray-600">{group.description}</p>

        <div className="mb-2 flex flex-wrap gap-1">
          {group.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50 text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {group.location && (
          <div className="mb-1 flex items-center text-xs text-gray-500">
            <MapPin className="mr-1 h-3 w-3" /> {group.location}
          </div>
        )}

        {group.lastActivity && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="mr-1 h-3 w-3" />
            Last active: {group.lastActivity}
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t px-3 py-2">
        <Button
          className={
            group.isJoined
              ? "w-full border-orange-500 text-orange-500 hover:bg-orange-50"
              : "w-full bg-orange-500 hover:bg-orange-600"
          }
          variant={group.isJoined ? "outline" : "default"}
          onClick={() => onToggleJoin(group.id)}
        >
          {group.isJoined ? "Joined" : "Join Group"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function GroupPost({
  post,
  onLike,
  onComment,
}: {
  post: GroupPost;
  onLike: (id: number) => void;
  onComment: (id: number) => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center">
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage src={post.author.image} />
            <AvatarFallback className="bg-orange-100 text-orange-800">
              {post.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-gray-500">{post.timestamp}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <p className="mb-3 text-sm">{post.content}</p>

        {post.image && (
          <img src={post.image} alt="Post content" className="mb-3 w-full rounded-md" />
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <button
            className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : ""}`}
            onClick={() => onLike(post.id)}
          >
            <Heart className="h-4 w-4" fill={post.isLiked ? "#ef4444" : "none"} />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center gap-1" onClick={() => onComment(post.id)}>
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </button>
          <button className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function FoodieGroupsSection() {
  const [joinedGroups, setJoinedGroups] = useState<Record<number, boolean>>({
    1: true,
    3: true,
  });

  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleJoin = (groupId: number) => {
    setJoinedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const handleLikePost = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleCommentPost = (postId: number) => {
    console.log(`Comment on post ${postId}`);
    // Implementation for commenting would go here
  };

  const [posts, setPosts] = useState<GroupPost[]>(demoGroupPosts);

  // Use centralized foodie groups data with local joined state
  const foodieGroups: FoodieGroup[] = demoFoodieGroups.map((group) => ({
    ...group,
    isJoined: joinedGroups[group.id] || false,
  }));

  // Filter groups based on search query
  const filteredGroups = searchQuery
    ? foodieGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : foodieGroups;

  // Filter groups for My Groups tab
  const myGroups = foodieGroups.filter((group) => joinedGroups[group.id] || false);

  // Filter posts for My Groups tab to only show posts from joined groups
  const myGroupsPosts = posts.filter((post) => joinedGroups[post.groupId] || false);

  return (
    <div className="py-3">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-lg font-semibold">Foodie Groups</h2>
        <Link href="/groups" className="flex items-center text-sm text-orange-500">
          See all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="px-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search for foodie groups..."
            className="h-10 w-full rounded-full border-gray-200 bg-gray-100 py-2 pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 h-auto rounded-none border-0 bg-transparent p-0">
            <TabsTrigger
              value="discover"
              className="flex-1 rounded-full px-4 py-1 text-gray-700 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow"
            >
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="my-groups"
              className="flex-1 rounded-full px-4 py-1 text-gray-700 data-[state=active]:bg-orange-500 data-[state=active]:text-white data-[state=active]:shadow"
            >
              My Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="mt-0 pt-0">
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <FoodieGroupCard key={group.id} group={group} onToggleJoin={handleToggleJoin} />
                ))
              ) : (
                <div className="col-span-2 py-6 text-center text-gray-500">
                  <p>No groups found matching your search.</p>
                  <p className="text-sm">Try different keywords or explore our popular groups.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-groups" className="mt-0 pt-0">
            {myGroups.length > 0 ? (
              <div>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {myGroups.map((group) => (
                    <FoodieGroupCard key={group.id} group={group} onToggleJoin={handleToggleJoin} />
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="mb-3 font-semibold">Recent Activity</h3>

                  {myGroupsPosts.length > 0 ? (
                    myGroupsPosts.map((post) => (
                      <GroupPost
                        key={post.id}
                        post={post}
                        onLike={handleLikePost}
                        onComment={handleCommentPost}
                      />
                    ))
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <p>No recent activity in your groups.</p>
                      <p className="text-sm">Join the conversation by posting or commenting!</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p className="mb-2">You haven&apos;t joined any groups yet.</p>
                <p className="mb-4 text-sm">
                  Join foodie groups to connect with like-minded food enthusiasts!
                </p>
                <Button
                  onClick={() => setActiveTab("discover")}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Discover Groups
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
