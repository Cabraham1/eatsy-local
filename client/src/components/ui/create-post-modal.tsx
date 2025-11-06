import { useState, useRef, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCreatePost } from "@/services/post.service";
import { MediaFile } from "@/types/post";
import { ImagePlus, Video, X, Loader2, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const { toast } = useToast();
  const { createPostAsync, isLoading } = useCreatePost();

  // Form state
  const [caption, setCaption] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [locationAddress, setLocationAddress] = useState("");
  const [locationLatitude, setLocationLatitude] = useState("");
  const [locationLongitude, setLocationLongitude] = useState("");

  // Ref for file input
  const mediaInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: MediaFile[] = [];

    Array.from(files).forEach((file) => {
      // Determine file type
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: `${file.name} is not a valid image or video file`,
        });
        return;
      }

      // Validate file size (50MB max)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `${file.name} exceeds 50MB limit`,
        });
        return;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      const type: "image" | "video" = isImage ? "image" : "video";
      newFiles.push({ file, preview, type });
    });

    setMediaFiles((prev) => [...prev, ...newFiles]);

    // Reset input
    if (e.target) {
      e.target.value = "";
    }
  };

  // Remove media file
  const removeMedia = (index: number) => {
    setMediaFiles((prev) => {
      // Revoke the object URL to free memory
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationLatitude(position.coords.latitude.toFixed(6));
        setLocationLongitude(position.coords.longitude.toFixed(6));
        toast({
          variant: "success",
          title: "Location captured",
          description: "Your current location has been added",
        });
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Location error",
          description: error.message,
        });
      }
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (mediaFiles.length === 0 && !caption.trim()) {
      toast({
        variant: "destructive",
        title: "Content required",
        description: "Please add media or write a caption (at least one is required)",
      });
      return;
    }

    try {
      const files = mediaFiles.map((mf) => mf.file);

      const postData: {
        caption?: string;
        media?: File[];
        price?: string;
        is_available: boolean;
        location_address?: string;
        location_latitude?: string;
        location_longitude?: string;
      } = {
        is_available: isAvailable,
      };

      if (caption.trim()) {
        postData.caption = caption.trim();
      }

      if (files.length > 0) {
        postData.media = files;
      }

      if (price && price.trim()) {
        postData.price = price.trim();
      }

      if (locationAddress && locationAddress.trim()) {
        postData.location_address = locationAddress.trim();
      }

      if (locationLatitude && locationLatitude.trim()) {
        postData.location_latitude = locationLatitude.trim();
      }

      if (locationLongitude && locationLongitude.trim()) {
        postData.location_longitude = locationLongitude.trim();
      }

      await createPostAsync(postData);

      toast({
        variant: "success",
        title: "Post created",
        description: "Your post has been shared successfully",
      });

      // Reset form and close modal
      resetForm();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setCaption("");
    mediaFiles.forEach((mf) => URL.revokeObjectURL(mf.preview));
    setMediaFiles([]);
    setPrice("");
    setIsAvailable(true);
    setLocationAddress("");
    setLocationLatitude("");
    setLocationLongitude("");
  };

  // Handle modal close
  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[90vh] max-w-xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-xl font-semibold">Create Post</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-5 p-6">
            {/* Caption */}
            <Textarea
              placeholder="What's cooking? Share your dish..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="min-h-[120px] resize-none border-0 p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading}
            />

            {/* Media Upload Button */}
            {mediaFiles.length === 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => mediaInputRef.current?.click()}
                disabled={isLoading}
                className="w-full border-dashed border-orange-300 bg-orange-50/50 px-4 py-8 hover:border-orange-400 hover:bg-orange-50"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-base font-medium text-orange-700">
                    Add Photos or Videos
                  </span>
                  <span className="text-xs text-gray-500">Upload up to 50MB per file</span>
                </div>
              </Button>
            )}

            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Media Preview */}
            {mediaFiles.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {mediaFiles.map((media, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                    >
                      {media.type === "image" ? (
                        <img
                          src={media.preview}
                          alt={`Upload ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <video src={media.preview} className="h-full w-full object-cover" muted />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        disabled={isLoading}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-all hover:bg-black/80"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                      {media.type === "video" && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
                          <Video className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => mediaInputRef.current?.click()}
                  disabled={isLoading}
                  className="w-full text-orange-600 hover:bg-orange-50 hover:text-orange-700"
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Add More Media
                </Button>
              </div>
            )}

            {/* Optional Details Section */}
            <div className="space-y-3 border-t pt-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Optional Details
              </p>

              {/* Price */}
              <div className="flex items-center gap-3 rounded-lg border bg-gray-50/50 px-4 py-3 transition-colors focus-within:border-orange-300 focus-within:bg-white">
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Set price (₦)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={isLoading}
                    className="border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              {/* Location Address */}
              <div className="flex items-center gap-3 rounded-lg border bg-gray-50/50 px-4 py-3 transition-colors focus-within:border-orange-300 focus-within:bg-white">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <Input
                    placeholder="Add location"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    disabled={isLoading}
                    className="border-0 bg-transparent p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="h-7 px-2 text-xs text-orange-600 hover:bg-orange-100 hover:text-orange-700"
                >
                  Use GPS
                </Button>
              </div>

              {/* Location Info Display */}
              {(locationAddress || locationLatitude || locationLongitude) && (
                <div className="rounded-lg bg-green-50 p-3 text-sm">
                  <p className="font-medium text-green-900">✓ Location Set</p>
                  {locationAddress && (
                    <p className="mt-1 text-green-700">Address: {locationAddress}</p>
                  )}
                  {(locationLatitude || locationLongitude) && (
                    <p className="mt-0.5 text-xs text-green-600">
                      Coordinates: {locationLatitude || "N/A"}, {locationLongitude || "N/A"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="border-t bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              disabled={isLoading}
              className={`flex items-center gap-3 rounded-lg border-2 px-4 py-2.5 transition-all ${
                isAvailable
                  ? "border-green-200 bg-green-50 hover:border-green-300"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div
                className={`h-5 w-9 rounded-full transition-all ${
                  isAvailable ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                    isAvailable ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  isAvailable ? "text-green-700" : "text-gray-600"
                }`}
              >
                {isAvailable ? "Available for order" : "Not available"}
              </span>
            </button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || (mediaFiles.length === 0 && !caption.trim())}
                className="min-w-[100px] bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Share"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
