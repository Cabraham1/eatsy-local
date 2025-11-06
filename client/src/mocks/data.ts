import type { Dish, User, Order, OrderItem, Story } from "@shared/schema";

// Additional interfaces for components
export interface FoodieGroup {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  image: string;
  tags: string[];
  isJoined: boolean;
  location?: string;
  lastActivity?: string;
}

export interface GroupPost {
  id: number;
  groupId: number;
  author: {
    id: number;
    name: string;
    image?: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

export interface LiveStream {
  streamId: string;
  cookId: number;
  cookName: string;
  cookImage?: string;
  title: string;
  viewers: number;
  isLive: boolean;
  previewImage: string;
}

export interface StoryContent {
  imageUrl: string;
  title: string;
  content: string;
}

export interface Comment {
  id: number;
  user: string;
  content: string;
  time: string;
}

export const demoCooks: User[] = [
  {
    id: 1,
    username: "chioma",
    email: "chioma@example.com",
    fullName: "Chioma Adebayo",
    userType: "cook",
    bio: "Yoruba cuisine expert specializing in traditional Asun and Efo Riro",
    profileImage:
      "https://images.unsplash.com/photo-1698827623494-c4e1196ba0ca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Lagos, Nigeria",
    cuisine: "Yoruba",
    isFeaturedCook: true,
  },
  {
    id: 2,
    username: "aisha",
    email: "aisha@example.com",
    fullName: "Aisha Ibrahim",
    userType: "cook",
    bio: "Northern Nigerian cuisine specialist",
    profileImage:
      "https://images.unsplash.com/photo-1657271515459-b6e3421ae9ae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Kano, Nigeria",
    cuisine: "Hausa",
    isFeaturedCook: true,
  },
  {
    id: 3,
    username: "chef_amara",
    email: "amara@example.com",
    fullName: "Chef Amara",
    userType: "cook",
    bio: "Specialized in grilling and street food, especially suya",
    profileImage:
      "https://plus.unsplash.com/premium_photo-1683134185917-e242befe4358?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Port Harcourt, Nigeria",
    cuisine: "Street Food",
    isFeaturedCook: false,
  },
  {
    id: 4,
    username: "chef_kemi",
    email: "kemi@example.com",
    fullName: "Chef Kemi Adebayo",
    userType: "cook",
    bio: "Traditional jollof rice specialist with smoky flavors",
    profileImage:
      "https://images.unsplash.com/photo-1648340670053-8c96d3b64aa3?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Ibadan, Nigeria",
    cuisine: "Yoruba",
    isFeaturedCook: true,
  },
  {
    id: 5,
    username: "mama_fatima",
    email: "fatima@example.com",
    fullName: "Mama Fatima",
    userType: "cook",
    bio: "Expert in spicy pepper soup and pounded yam",
    profileImage:
      "https://images.unsplash.com/photo-1698827623494-c4e1196ba0ca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Kaduna, Nigeria",
    cuisine: "Hausa",
    isFeaturedCook: true,
  },
  {
    id: 6,
    username: "chef_emeka",
    email: "emeka@example.com",
    fullName: "Chef Emeka",
    userType: "cook",
    bio: "Igbo cuisine specialist with modern twists",
    profileImage:
      "https://images.unsplash.com/photo-1657271515459-b6e3421ae9ae?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Enugu, Nigeria",
    cuisine: "Igbo",
    isFeaturedCook: false,
  },
];

/**
 * Updated dish data for the feed
 */

export const demoDishes = [
  {
    id: "1",
    title: "Jollof Rice with Chicken",
    cookName: "Mama Folake",
    cookImage:
      "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1646809156467-6e825869b29f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦1,500",
    rating: 4.7,
    distance: "1.2km",
    likes: 132,
    comments: 24,
    caption: "A classic Nigerian dish, better than anyother jollof!",
    shares: 18,
    isLiked: false,
    isSaved: false,
    createdAt: "2025-08-30T10:30:00Z",
    type: "image" as const,
    cookId: "1",
    isVerified: true,
  },
  {
    id: "2",
    title: "Ice Cream Delight",
    cookName: "Chef James",
    cookImage:
      "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1722491714046-64ee4143d6cf?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦800",
    rating: 4.9,
    distance: "0.8km",
    likes: 201,
    comments: 46,
    caption: "Can Never Go Wrong With Ice Cream!",
    shares: 32,
    isLiked: true,
    isSaved: false,
    createdAt: "2025-08-31T14:15:00Z",
    type: "image" as const,
    cookId: "2",
    isVerified: true,
  },
  {
    id: "3",
    title: "Egusi Soup with Fufu",
    cookName: "Chef James",
    cookImage:
      "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦2,000",
    rating: 4.9,
    distance: "0.8km",
    likes: 201,
    comments: 46,
    caption:
      "A hearty Nigerian soup made with melon seeds, will definately excite your taste buds.",
    shares: 28,
    isLiked: false,
    isSaved: true,
    createdAt: "2025-08-29T16:45:00Z",
    type: "image" as const,
    cookId: "2",
    isVerified: true,
  },
  {
    id: "4",
    title: "Tea Time",
    cookName: "Chef James",
    cookImage:
      "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1648340670053-8c96d3b64aa3?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦500",
    rating: 4.9,
    distance: "0.8km",
    likes: 201,
    comments: 46,
    caption: "Me And My Shayi",
    shares: 15,
    isLiked: true,
    isSaved: false,
    createdAt: "2025-08-31T09:20:00Z",
    type: "image" as const,
    cookId: "2",
    isVerified: true,
  },
  {
    id: "5",
    title: "Suya Platter",
    cookName: "Mallam Hassan",
    cookImage:
      "https://images.unsplash.com/photo-1588534434902-85fe43d860f3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1644364935906-792b2245a2c0?q=80&w=1168&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦1,800",
    rating: 4.5,
    distance: "2.3km",
    likes: 98,
    comments: 17,
    caption: "Grilled spicy meat skewers, a popular street food.",
    shares: 12,
    isLiked: false,
    isSaved: false,
    createdAt: "2025-08-30T18:30:00Z",
    type: "image" as const,
    cookId: "3",
    isVerified: false,
  },
  {
    id: "6",
    title: "Pepper Soup",
    cookName: "Auntie Joy",
    cookImage:
      "https://images.unsplash.com/photo-1632828167055-126c0c57ecff?q=80&w=1417&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1625937712842-061738bb1e2a?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦1,200",
    rating: 4.6,
    distance: "1.5km",
    likes: 85,
    comments: 12,
    caption: "A spicy and flavorful soup, perfect for any occasion.",
    shares: 8,
    isLiked: true,
    isSaved: true,
    createdAt: "2025-08-29T12:00:00Z",
    type: "image" as const,
    cookId: "4",
    isVerified: false,
  },
];

export const demoOrders: Array<{
  id: number;
  order: Order;
  items: { dish: Dish; orderItem: OrderItem }[];
}> = [
  {
    id: 101,
    order: {
      id: 101,
      customerId: 999,
      cookId: 1,
      status: "processing",
      totalAmount: 8300,
      deliveryFee: 1000,
      orderDate: new Date(),
    },
    items: [
      {
        dish: {
          id: 1,
          cookId: 1,
          name: demoDishes[0].title,
          description: demoDishes[0].caption,
          price: parseInt(demoDishes[0].price.replace(/[₦,]/g, "")) || 1500,
          originalPrice: null,
          imageUrl: demoDishes[0].image,
          prepTime: "25-35 min",
          isAvailable: true,
          isPopular: true,
          hasVeganOption: false,
          rating: demoDishes[0].rating,
          ratingCount: 142,
          tags: ["rice", "spicy", "chicken"],
          createdAt: new Date(),
        },
        orderItem: { id: 1, orderId: 101, dishId: 1, quantity: 1, price: 1500 },
      },
      {
        dish: {
          id: 2,
          cookId: 2,
          name: demoDishes[1].title,
          description: demoDishes[1].caption,
          price: parseInt(demoDishes[1].price.replace(/[₦,]/g, "")) || 800,
          originalPrice: null,
          imageUrl: demoDishes[1].image,
          prepTime: "10-15 min",
          isAvailable: true,
          isPopular: true,
          hasVeganOption: false,
          rating: demoDishes[1].rating,
          ratingCount: 89,
          tags: ["dessert", "ice-cream"],
          createdAt: new Date(),
        },
        orderItem: { id: 2, orderId: 101, dishId: 2, quantity: 1, price: 800 },
      },
    ],
  },
  {
    id: 102,
    order: {
      id: 102,
      customerId: 999,
      cookId: 2,
      status: "completed",
      totalAmount: 3800,
      deliveryFee: 1000,
      orderDate: new Date(Date.now() - 86400000),
    },
    items: [
      {
        dish: {
          id: 3,
          cookId: 2,
          name: demoDishes[2].title,
          description: demoDishes[2].caption,
          price: parseInt(demoDishes[2].price.replace(/[₦,]/g, "")) || 2000,
          originalPrice: null,
          imageUrl: demoDishes[2].image,
          prepTime: "30-40 min",
          isAvailable: true,
          isPopular: true,
          hasVeganOption: false,
          rating: demoDishes[2].rating,
          ratingCount: 67,
          tags: ["soup", "traditional"],
          createdAt: new Date(),
        },
        orderItem: { id: 3, orderId: 102, dishId: 3, quantity: 1, price: 2000 },
      },
    ],
  },
];

export function getOrderById(id: number) {
  return demoOrders.find((o) => o.id === id) || null;
}

export const demoStories: Story[] = [
  {
    id: 1,
    title: "Yoruba",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "cuisine",
    referenceId: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    title: "Igbo",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "cuisine",
    referenceId: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    title: "Jollof",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "category",
    referenceId: 3,
    createdAt: new Date(),
  },
  {
    id: 4,
    title: "Pepper Soup",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "category",
    referenceId: 4,
    createdAt: new Date(),
  },
  {
    id: 5,
    title: "Suya",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "category",
    referenceId: 5,
    createdAt: new Date(),
  },
  {
    id: 6,
    title: "Chioma",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "cook",
    referenceId: 1,
    createdAt: new Date(),
  },
];

// Foodie Groups
export const demoFoodieGroups: FoodieGroup[] = [
  {
    id: 1,
    name: "Nigerian Food Lovers",
    description:
      "Celebrating the rich flavors of Nigerian cuisine. From Jollof debates to perfect pepper soup recipes - we love it all!",
    memberCount: 3847,
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2074&auto=format&fit=crop",
    tags: ["Nigerian", "Jollof", "West African"],
    isJoined: false,
    location: "Lagos, Nigeria",
    lastActivity: "Today",
  },
  {
    id: 2,
    name: "African Home Cooking",
    description:
      "Traditional recipes passed down through generations. Learn authentic cooking techniques from grandmothers across Africa.",
    memberCount: 2156,
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2070&auto=format&fit=crop",
    tags: ["Traditional", "Home Cooking", "African"],
    isJoined: false,
    lastActivity: "Yesterday",
  },
  {
    id: 3,
    name: "Suya & Street Food",
    description:
      "For lovers of African street food! Share your favorite suya spots, puff puff recipes, and street food adventures.",
    memberCount: 1923,
    image:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=2070&auto=format&fit=crop",
    tags: ["Street Food", "Suya", "Nigerian Snacks"],
    isJoined: false,
    location: "Global",
    lastActivity: "2 days ago",
  },
  {
    id: 4,
    name: "Plantain Enthusiasts",
    description:
      "Everything plantain! From kelewele to dodo, bole to plantain chips. Share recipes and creative plantain dishes.",
    memberCount: 1456,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    tags: ["Street Food", "Food Trucks", "Global Cuisine"],
    isJoined: false,
    location: "Global",
    lastActivity: "3 days ago",
  },
];

// Group Posts
export const demoGroupPosts: GroupPost[] = [
  {
    id: 1,
    groupId: 1,
    author: {
      id: demoCooks[2].id,
      name: demoCooks[2].fullName ?? "",
      image: demoCooks[2].profileImage ?? "",
    },
    content:
      "Just perfected my Jollof rice recipe! The secret is in the perfect spice blend and letting it simmer slowly. My Ghanaian friends are finally impressed! 😂",
    image:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2235&auto=format&fit=crop",
    likes: 47,
    comments: 12,
    timestamp: "2 hours ago",
    isLiked: false,
  },
  {
    id: 2,
    groupId: 1,
    author: {
      id: demoCooks[3].id,
      name: demoCooks[3].fullName ?? "",
      image: demoCooks[3].profileImage ?? "",
    },
    content:
      "Has anyone tried making pounded yam with plantain flour? Looking for a healthier alternative that still gives that authentic texture!",
    likes: 23,
    comments: 18,
    timestamp: "5 hours ago",
    isLiked: true,
  },
  {
    id: 3,
    groupId: 3,
    author: {
      id: demoCooks[4].id,
      name: demoCooks[4].fullName ?? "",
      image: demoCooks[4].profileImage ?? "",
    },
    content:
      "Sunday prep complete! Pepper soup, egusi stew, and plantain porridge. My freezer is stocked for the week! Who else meal preps African dishes?",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2070&auto=format&fit=crop",
    likes: 65,
    comments: 9,
    timestamp: "Yesterday",
    isLiked: false,
  },
];

// Live Streams
export const demoLiveStreams: LiveStream[] = [
  {
    streamId: "stream1",
    cookId: 1,
    cookName: demoCooks[0].fullName ?? "",
    cookImage: demoCooks[0].profileImage ?? "",
    title: "Traditional Jollof Rice Recipe - Perfect Party Jollof with Smoky Base",
    viewers: 185,
    isLive: true,
    previewImage:
      "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=2340&auto=format&fit=crop",
  },
  {
    streamId: "stream2",
    cookId: 2,
    cookName: demoCooks[1].fullName ?? "",
    cookImage: demoCooks[1].profileImage ?? "",
    title: "Spicy Pepper Soup & Pounded Yam Masterclass",
    viewers: 127,
    isLive: true,
    previewImage:
      "https://images.unsplash.com/photo-1571197179779-f61b94c65e3d?q=80&w=2340&auto=format&fit=crop",
  },
  {
    streamId: "stream3",
    cookId: 3,
    cookName: demoCooks[2].fullName ?? "",
    cookImage: demoCooks[2].profileImage ?? "",
    title: "Weekend Suya Grilling Session",
    viewers: 92,
    isLive: false,
    previewImage:
      "https://images.unsplash.com/photo-1585937421612-70a008356c36?q=80&w=2340&auto=format&fit=crop",
  },
];

// Live Stream Comments for live cooking viewer
export const demoLiveStreamComments: Comment[] = [
  {
    id: 1,
    user: "Chioma A.",
    content: "This jollof looks perfect! 😍 That smoky base is everything!",
    time: "2m ago",
  },
  {
    id: 2,
    user: "Tunde O.",
    content: "Mama, wetin you put for the rice make am red like that?",
    time: "1m ago",
  },
  {
    id: 3,
    user: "Aisha M.",
    content: "Can I order this for my party next weekend? ₦5,000?",
    time: "Just now",
  },
];

// Favorite Cooks for sidebar (subset of demoCooks)
export const demoFavoriteCooks: User[] = demoCooks.slice(0, 3).map((cook) => ({
  ...cook,
  bio: cook.bio || "Experienced Nigerian cook specializing in traditional recipes",
}));

// Story Contents for story viewer
export const demoStoryContents: StoryContent[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=2340&auto=format&fit=crop",
    title: "Today's Special: Homemade Jollof Rice",
    content:
      "Fresh out of the oven! Made with the perfect blend of Nigerian spices and my grandmother's secret recipe.",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?q=80&w=2340&auto=format&fit=crop",
    title: "New Pepper Soup Recipe",
    content:
      "Just added to my menu! Authentic spicy pepper soup with fresh vegetables and your choice of protein.",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2340&auto=format&fit=crop",
    title: "Weekend Suya Special",
    content:
      "Taking orders for my famous suya! Limited quantities available for Saturday evening pickup.",
  },
];

// Recommended Dishes
export const RECOMMENDED_DISHES = [
  {
    id: "1",
    name: "Ofada Rice with Stew",
    cookName: "Mama Folake",
    cookImage:
      "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1733414717515-d997dafb7341?q=80&w=1908&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦1,700",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Fried Rice & Chicken",
    cookName: "Mallam Hassan",
    cookImage:
      "https://images.unsplash.com/photo-1588534434902-85fe43d860f3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1596560548464-f010549b84d7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦2,100",
    rating: 4.7,
  },
  {
    id: "3",
    name: "Peppersoup (Catfish)",
    cookName: "Chef James",
    cookImage:
      "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    image:
      "https://images.unsplash.com/photo-1625937712842-061738bb1e2a?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₦2,300",
    rating: 4.8,
  },
];
