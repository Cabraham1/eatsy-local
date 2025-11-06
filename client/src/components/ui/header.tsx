import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, User } from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [location] = useLocation();

  // const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="font-heading cursor-pointer text-2xl font-bold text-primary">
                Eatsy<span className="text-[#FF9F1C]">.</span>
              </h1>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden w-1/3 items-center rounded-full bg-muted px-3 py-1 md:flex">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search dishes, cooks, or cuisines"
              className="focus:rounded-4xl w-full border-none bg-transparent py-1 text-sm focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Nav Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <Link href={"/auth"}>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="flex items-center justify-center bg-muted">
                  <User className="h-4 w-4 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
