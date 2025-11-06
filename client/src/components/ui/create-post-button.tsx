import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Role } from "@/types/enum";
import { CreatePostModal } from "@/components/ui/create-post-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function CreatePostButton() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Only show button for cooks
  if (!user || user.role !== Role.COOK) {
    return null;
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="fixed bottom-24 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-0 shadow-lg transition-all hover:scale-110 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl md:bottom-28"
              aria-label="Create Post"
            >
              <PlusCircle className="h-7 w-7 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-gray-900 text-white">
            <p>Create Post</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
