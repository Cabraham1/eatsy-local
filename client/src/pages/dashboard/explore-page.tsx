import React from "react";
import { FeedList } from "@/components/ui/feed-list";
import { Search, Filter } from "lucide-react";

const ExplorePage = () => {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-amber-50/30 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-orange-100/50 bg-white/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Explore</h1>
          <div className="flex items-center space-x-3">
            <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="">
        <FeedList />
      </div>
    </div>
  );
};

export default ExplorePage;
