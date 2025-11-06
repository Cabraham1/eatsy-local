import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Edit, Trash2, Clock, Tag } from "lucide-react";

const dishFormSchema = z.object({
  name: z.string().min(3, "Dish name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.coerce.number().optional(),
  prepTime: z.string().min(1, "Preparation time is required"),
  imageUrl: z.string().url("Must be a valid URL"),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  isAvailable: z.boolean().default(true),
  hasVeganOption: z.boolean().default(false),
});

type DishFormValues = z.infer<typeof dishFormSchema>;

interface MenuDish {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  prepTime: string;
  tags: string[];
  isAvailable: boolean;
  hasVeganOption: boolean;
}

export function CookMenuManager() {
  const [dishes, setDishes] = useState<MenuDish[]>([
    // Demo dishes for the cook menu manager - could be populated from demoDishes
    {
      id: 1,
      name: "Jollof Rice Special",
      description: "Our signature jollof rice with tender chicken and traditional Nigerian spices.",
      price: 4500,
      originalPrice: 5000,
      imageUrl:
        "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2235&auto=format&fit=crop",
      prepTime: "30 min",
      tags: ["Nigerian", "Rice", "Popular"],
      isAvailable: true,
      hasVeganOption: false,
    },
    {
      id: 2,
      name: "Pepper Soup",
      description: "Spicy Nigerian pepper soup with assorted meat and traditional herbs.",
      price: 3800,
      imageUrl:
        "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2374&auto=format&fit=crop",
      prepTime: "25 min",
      tags: ["Nigerian", "Soup", "Spicy"],
      isAvailable: true,
      hasVeganOption: false,
    },
  ]);

  const [editingDish, setEditingDish] = useState<MenuDish | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("available");
  const [tagInput, setTagInput] = useState("");

  const form = useForm<DishFormValues>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      prepTime: "",
      imageUrl: "",
      tags: [],
      isAvailable: true,
      hasVeganOption: false,
    },
  });

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      prepTime: "",
      imageUrl: "",
      tags: [],
      isAvailable: true,
      hasVeganOption: false,
    });
    setTagInput("");
  };

  const handleOpenDialog = (dish?: MenuDish) => {
    if (dish) {
      // Edit mode
      form.reset({
        name: dish.name,
        description: dish.description,
        price: dish.price,
        originalPrice: dish.originalPrice,
        prepTime: dish.prepTime,
        imageUrl: dish.imageUrl,
        tags: dish.tags,
        isAvailable: dish.isAvailable,
        hasVeganOption: dish.hasVeganOption,
      });
      setEditingDish(dish);
    } else {
      // Add mode
      resetForm();
      setEditingDish(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues().tags.includes(tagInput.trim())) {
      form.setValue("tags", [...form.getValues().tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      form.getValues().tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = (values: DishFormValues) => {
    if (editingDish) {
      // Update existing dish
      setDishes(
        dishes.map((dish) => (dish.id === editingDish.id ? { ...values, id: dish.id } : dish))
      );
    } else {
      // Add new dish
      const newDish = {
        ...values,
        id: Math.max(0, ...dishes.map((d) => d.id)) + 1,
      };
      setDishes([...dishes, newDish]);
    }
    handleCloseDialog();
  };

  const handleToggleAvailability = (id: number) => {
    setDishes(
      dishes.map((dish) => (dish.id === id ? { ...dish, isAvailable: !dish.isAvailable } : dish))
    );
  };

  const handleDeleteDish = (id: number) => {
    setDishes(dishes.filter((dish) => dish.id !== id));
  };

  // Filter dishes based on active tab
  const filteredDishes = dishes.filter((dish) =>
    activeTab === "available" ? dish.isAvailable : !dish.isAvailable
  );

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Menu</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="mr-1 h-4 w-4" /> Add Dish
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{editingDish ? "Edit Dish" : "Add New Dish"}</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dish Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Add a URL to an image of your dish</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dish Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Homemade Lasagna" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prepTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prep Time</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select prep time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="15 min">15 minutes</SelectItem>
                            <SelectItem value="30 min">30 minutes</SelectItem>
                            <SelectItem value="45 min">45 minutes</SelectItem>
                            <SelectItem value="1 hour">1 hour</SelectItem>
                            <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                            <SelectItem value="2+ hours">2+ hours</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your dish..."
                          {...field}
                          className="min-h-24"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" min="0" placeholder="15.99" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price ($) (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="18.99"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>For discounted items</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="mb-2 flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleAddTag} variant="outline">
                          Add
                        </Button>
                      </div>

                      <div className="mb-1 flex flex-wrap gap-2">
                        {form.getValues().tags.map((tag, index) => (
                          <Badge
                            key={index}
                            className="flex items-center gap-1 bg-orange-100 text-orange-800 hover:bg-orange-200"
                          >
                            {tag}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleRemoveTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <FormDescription>
                        Add tags like cuisine type, dietary restrictions, etc.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Available</FormLabel>
                          <FormDescription>Make this dish available for ordering</FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-5 w-5 accent-orange-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasVeganOption"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Vegan Option</FormLabel>
                          <FormDescription>This dish can be made vegan</FormDescription>
                        </div>
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-5 w-5 accent-orange-500"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
                    {editingDish ? "Update Dish" : "Add Dish"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="available">Available Dishes</TabsTrigger>
          <TabsTrigger value="unavailable">Unavailable Dishes</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-0 pt-0">
          <div className="space-y-3">
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish) => (
                <div key={dish.id} className="flex overflow-hidden rounded-lg border">
                  <img src={dish.imageUrl} alt={dish.name} className="h-28 w-28 object-cover" />
                  <div className="flex-1 p-3">
                    <h3 className="font-medium">{dish.name}</h3>
                    <p className="line-clamp-2 text-sm text-gray-500">{dish.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" /> {dish.prepTime}
                      </span>
                      <span className="flex items-center">
                        <Tag className="mr-1 h-3 w-3" /> {dish.tags.join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-3">
                    <div className="text-right">
                      <div className="font-semibold">₦{dish.price.toLocaleString()}</div>
                      {dish.originalPrice && (
                        <div className="text-xs text-gray-400 line-through">
                          ₦{dish.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-1"
                        onClick={() => handleOpenDialog(dish)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 border-amber-200 p-1 text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                        onClick={() => handleToggleAvailability(dish.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 border-red-200 p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteDish(dish.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No available dishes to display</p>
                <Button
                  className="mt-2 bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleOpenDialog()}
                >
                  Add Your First Dish
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="unavailable" className="mt-0 pt-0">
          <div className="space-y-3">
            {filteredDishes.length > 0 ? (
              filteredDishes.map((dish) => (
                <div key={dish.id} className="flex overflow-hidden rounded-lg border bg-gray-50">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="h-28 w-28 object-cover opacity-70"
                  />
                  <div className="flex-1 p-3">
                    <h3 className="font-medium text-gray-600">{dish.name}</h3>
                    <p className="line-clamp-2 text-sm text-gray-400">{dish.description}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" /> {dish.prepTime}
                      </span>
                      <span className="flex items-center">
                        <Tag className="mr-1 h-3 w-3" /> {dish.tags.join(", ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-3">
                    <div className="text-right text-gray-600">
                      <div className="font-semibold">₦{dish.price.toLocaleString()}</div>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-1"
                        onClick={() => handleOpenDialog(dish)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 border-green-200 p-1 text-green-500 hover:bg-green-50 hover:text-green-600"
                        onClick={() => handleToggleAvailability(dish.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 border-red-200 p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteDish(dish.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No unavailable dishes to display</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
