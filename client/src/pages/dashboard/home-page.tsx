import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

// Import our custom components
import { StoriesRow } from "@/components/ui/story";
import { LiveCookingSection } from "@/components/ui/live-cooking";
import { FoodieGroupsSection } from "@/components/ui/foodie-groups";
import { PopularDishesSection } from "@/components/ui/dish-card";
import { demoCooks } from "@/mocks/data";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/20 px-8">
      {/* Header with search */}
      <header className="sticky top-0 z-10 border-b bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-orange-500">Search</span>
          </div>
          <div className="relative mx-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search dishes, cooks, or cuisines"
                className="h-10 w-full rounded-full border-gray-200 bg-gray-100 py-2 pl-9 pr-4 text-xs placeholder:text-xs focus-visible:ring-orange-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="pb-16">
        {/* Stories section */}
        <div className="border-b">
          <StoriesRow
            stories={[
              {
                id: 1,
                imageUrl:
                  "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2340&auto=format&fit=crop",
                title: "Nice bread",
                hasUnviewed: true,
              },
              {
                id: 2,
                imageUrl:
                  "https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2340&auto=format&fit=crop",
                title: "Suya Night",
                hasUnviewed: true,
              },
              {
                id: 3,
                imageUrl:
                  "https://images.unsplash.com/photo-1574653855064-d3e6c4b6b4b5?q=80&w=2340&auto=format&fit=crop",
                title: "Weekend Fufu",
                hasUnviewed: false,
              },
              {
                id: 4,
                imageUrl:
                  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=2340&auto=format&fit=crop",
                title: "cake",
                hasUnviewed: false,
              },
              {
                id: 5,
                imageUrl:
                  "https://images.unsplash.com/photo-1577003833619-76bbd7f82948?q=80&w=2340&auto=format&fit=crop",
                title: "red",
                hasUnviewed: false,
              },
              {
                id: 6,
                imageUrl:
                  "https://images.unsplash.com/photo-1571197179779-f61b94c65e3d?q=80&w=2340&auto=format&fit=crop",
                title: "just for me",
                hasUnviewed: false,
              },
              {
                id: 7,
                imageUrl:
                  "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=2340&auto=format&fit=crop",
                title: "so swet",
                hasUnviewed: false,
              },
              {
                id: 8,
                imageUrl:
                  "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2340&auto=format&fit=crop",
                title: "honey",
                hasUnviewed: false,
              },
            ]}
          />
        </div>

        {/* Main content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="sticky top-[72px] z-10 h-auto w-full rounded-none border-b bg-transparent bg-white p-0">
            <TabsTrigger
              value="trending"
              className="flex-1 rounded-none py-3 text-gray-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:shadow-none"
            >
              Trending
            </TabsTrigger>
            <TabsTrigger
              value="cuisine"
              className="flex-1 rounded-none py-3 text-gray-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:shadow-none"
            >
              Cuisine
            </TabsTrigger>
            <TabsTrigger
              value="communities"
              className="flex-1 rounded-none py-3 text-gray-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:shadow-none"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="flex-1 rounded-none py-3 text-gray-500 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:bg-transparent data-[state=active]:text-orange-500 data-[state=active]:shadow-none"
            >
              Live
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-0 pt-4">
            <PopularDishesSection />

            <div className="mt-4">
              <h3 className="mb-3 px-4 text-lg font-semibold">Trending Cooks</h3>
              <div className="hide-scrollbar flex gap-4 overflow-x-auto px-4 pb-2">
                {demoCooks.slice(0, 5).map((cook) => (
                  <Link key={cook.id} href={`/cooks/${cook.id}`}>
                    <div className="flex w-24 flex-col items-center">
                      <Avatar className="mb-2 h-24 w-24">
                        <AvatarImage src={cook.profileImage} alt={cook.fullName} />
                        <AvatarFallback className="bg-orange-100 text-orange-800">
                          {cook.fullName?.charAt(0) || "C"}
                        </AvatarFallback>
                      </Avatar>
                      <p className="line-clamp-1 text-center text-sm font-medium">
                        {cook.fullName}
                      </p>
                      <p className="text-center text-xs text-gray-500">
                        {`${cook.cuisine} Cuisine`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 px-4 text-lg font-semibold">Trending Tags</h3>
              <div className="flex flex-wrap gap-2 px-4">
                {[
                  "NigerianFood",
                  "JollofRice",
                  "AfricanCuisine",
                  "WestAfrican",
                  "HomeCooking",
                  "Suya",
                  "PoundedYam",
                  "EgusiSoup",
                  "PlantainLovers",
                  "SpicyFood",
                  "PepperSoup",
                  "TraditionalMeals",
                ].map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer bg-gray-50 px-3 py-1 text-sm hover:bg-orange-50"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cuisine" className="mt-0 pt-4">
            <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4">
              {[
                {
                  name: "Nigerian",
                  image:
                    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2340&auto=format&fit=crop",
                },
                {
                  name: "West African",
                  image:
                    "https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2340&auto=format&fit=crop",
                },
                {
                  name: "Ethiopian",
                  image:
                    "https://images.unsplash.com/photo-1544270445-bcd677bd8fcf?q=80&w=2340&auto=format&fit=crop",
                },
                {
                  name: "Moroccan",
                  image:
                    "https://images.unsplash.com/photo-1570197788417-0e82375c9371?q=80&w=2340&auto=format&fit=crop",
                },
                {
                  name: "South African",
                  image:
                    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=2340&auto=format&fit=crop",
                },
                {
                  name: "Kenyan",
                  image:
                    "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=2340&auto=format&fit=crop",
                },
                {
                  name: "Ghanaian",
                  image:
                    "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=2340&auto=format&fit=crop",
                },
                {
                  name: "Senegalese",
                  image:
                    "https://images.unsplash.com/photo-1574653855064-d3e6c4b6b4b5?q=80&w=2340&auto=format&fit=crop",
                },
              ].map((cuisine, index) => (
                <Link key={index} href={`/category/${cuisine.name.toLowerCase()}`}>
                  <div className="group relative h-32 overflow-hidden rounded-lg">
                    <img
                      src={cuisine.image}
                      alt={cuisine.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <h3 className="text-lg font-bold text-white">{cuisine.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="communities" className="mt-0 pt-4">
            <FoodieGroupsSection />
          </TabsContent>

          <TabsContent value="live" className="mt-0 pt-4">
            <LiveCookingSection />
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Hire a Chef Button */}
      <Link href="/cooks">
        <Button className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-white shadow-lg hover:bg-orange-600">
          <span>Hire a Chef</span>
        </Button>
      </Link>
    </div>
  );
};

export default HomePage;
