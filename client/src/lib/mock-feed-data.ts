import { FeedContent } from "../components/ui/feed-card";

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

// Convert demoDishes to FeedContent format
function convertDishToFeedContent(dish: (typeof demoDishes)[0]): FeedContent {
  return {
    id: dish.id,
    type: dish.type,
    url: dish.image,
    caption: dish.caption,
    cook: {
      id: dish.cookId,
      name: dish.cookName,
      avatar: dish.cookImage,
      isVerified: dish.isVerified,
    },
    stats: {
      likes: dish.likes,
      comments: dish.comments,
      shares: dish.shares,
    },
    rating: dish.rating,
    distance: dish.distance,
    price: parseInt(dish.price.replace(/[₦,]/g, "")) || 0,
    isLiked: dish.isLiked,
    isSaved: dish.isSaved,
    createdAt: dish.createdAt,
  };
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomStats() {
  return {
    likes: Math.floor(Math.random() * 1000) + 10,
    comments: Math.floor(Math.random() * 100) + 5,
    shares: Math.floor(Math.random() * 50) + 1,
  };
}

function generateRandomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 7);
  const hoursAgo = Math.floor(Math.random() * 24);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - hoursAgo * 60 * 60 * 1000);
  return date.toISOString();
}

export function generateMockFeedData(count: number, startIndex: number = 0): FeedContent[] {
  const feedData: FeedContent[] = [];

  // First, add all dishes from demoDishes
  const convertedDishes = demoDishes.map(convertDishToFeedContent);
  feedData.push(...convertedDishes);

  // If we need more items, generate additional ones based on existing dishes
  const remaining = count - feedData.length;
  if (remaining > 0) {
    for (let i = 0; i < remaining; i++) {
      const baseDish = getRandomElement(demoDishes);
      const randomizedDish: FeedContent = {
        id: `generated-${startIndex + feedData.length + i}`,
        type: "image",
        url: baseDish.image,
        caption: baseDish.caption,
        cook: {
          id: baseDish.cookId,
          name: baseDish.cookName,
          avatar: baseDish.cookImage,
          isVerified: Math.random() > 0.7,
        },
        stats: generateRandomStats(),
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
        distance: baseDish.distance,
        price: parseInt(baseDish.price.replace(/[₦,]/g, "")) + Math.floor(Math.random() * 1000),
        isLiked: Math.random() > 0.8,
        isSaved: Math.random() > 0.9,
        createdAt: generateRandomDate(),
      };
      feedData.push(randomizedDish);
    }
  }

  // Return the requested number of items starting from startIndex
  return feedData.slice(startIndex, startIndex + count);
}

// Simulate API delay
export function fetchMockFeedData(
  page: number = 0,
  pageSize: number = 10
): Promise<{
  data: FeedContent[];
  hasNextPage: boolean;
  nextPage: number;
}> {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const data = generateMockFeedData(pageSize, page * pageSize);
        resolve({
          data,
          hasNextPage: page < 10, // Simulate 10 pages max
          nextPage: page + 1,
        });
      },
      800 + Math.random() * 400
    ); // Random delay between 800-1200ms
  });
}

// Additional data exports for other parts of your app
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

export const ORDERS_DATA = {
  active: [
    {
      id: "1",
      status: "Preparing",
      totalAmount: "₦3,200",
      deliveryFee: "₦500",
      deliveryType: "Delivery",
      deliveryAddress: "12 Ayodele St, Yaba, Lagos",
      orderDate: "2023-11-10T15:30:00",
      items: [
        {
          id: "1",
          name: "Jollof Rice with Chicken",
          quantity: 2,
          price: "₦1,500",
          image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
          chefName: "Mama Folake",
          chefImage: "https://images.unsplash.com/photo-1733491762566-701553a88e7d?q=80",
        },
        {
          id: "2",
          name: "Moi Moi",
          quantity: 1,
          price: "₦500",
          image:
            "https://images.unsplash.com/photo-1625937712842-061738bb1e2a?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          chefName: "Chef Emeka",
          chefImage: "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80",
        },
        {
          id: "3",
          name: "Plantain (Fried)",
          quantity: 1,
          price: "₦300",
          image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
          chefName: "Auntie Bisi",
          chefImage: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
        },
      ],
    },
    {
      id: "2",
      status: "Preparing",
      totalAmount: "₦4,500",
      deliveryFee: "₦700",
      deliveryType: "Pickup",
      pickupAddress: "5 Ikorodu Rd, Ikeja, Lagos",
      orderDate: "2023-11-10T14:15:00",
      items: [
        {
          id: "1",
          name: "Egusi Soup with Pounded Yam",
          quantity: 1,
          price: "₦2,300",
          image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
          chefName: "Chef Emeka",
          chefImage: "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80",
        },
        {
          id: "2",
          name: "Okra Soup with Beef",
          quantity: 1,
          price: "₦1,500",
          image:
            "https://images.unsplash.com/photo-1625937712842-061738bb1e2a?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          chefName: "Mama Folake",
          chefImage: "https://images.unsplash.com/photo-1733491762566-701553a88e7d?q=80",
        },
        {
          id: "3",
          name: "Pepper Soup (Fish)",
          quantity: 1,
          price: "₦1,200",
          image:
            "https://images.unsplash.com/photo-1625937712842-061738bb1e2a?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          chefName: "Mallam Hassan",
          chefImage: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
        },
      ],
    },
  ],
  past: [
    {
      id: "3",
      status: "Delivered",
      totalAmount: "₦2,800",
      deliveryFee: "₦500",
      orderDate: "2023-11-08T12:45:00",
      items: [
        {
          id: "1",
          name: "Ofada Rice with Stew",
          quantity: 1,
          price: "₦1,800",
          image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
          chefName: "Auntie Bisi",
          chefImage: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
        },
        {
          id: "2",
          name: "Moi Moi",
          quantity: 1,
          price: "₦500",
          image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
          chefName: "Chef James",
          chefImage: "https://images.unsplash.com/photo-1592498546551-222538011a27?q=80",
        },
        {
          id: "3",
          name: "Fried Plantain",
          quantity: 1,
          price: "₦300",
          image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80",
          chefName: "Mama Folake",
          chefImage: "https://images.unsplash.com/photo-1733491762566-701553a88e7d?q=80",
        },
      ],
    },
  ],
};
