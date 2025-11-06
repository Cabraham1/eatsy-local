// Lightweight mock API layer to simulate backend endpoints during development
import type { Dish, User, Order, OrderItem } from "@shared/schema";
import { demoCooks, demoDishes, demoOrders, getOrderById } from "@/mocks/data";

const ok = (json: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify({ data: json, success: true }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
    ...init,
  });

const created = (json: unknown) => ok(json, { status: 201 });
const noContent = () => new Response(null, { status: 204 });
const err = (status: number, message: string) =>
  new Response(JSON.stringify({ success: false, message }), {
    headers: { "Content-Type": "application/json" },
    status,
  });

// Get stored user from localStorage
function getStoredUser(): User | null {
  const userStr = localStorage.getItem("eatsy_user");
  return userStr ? JSON.parse(userStr) : null;
}

// Set user in localStorage
function setStoredUser(user: User): void {
  localStorage.setItem("eatsy_user", JSON.stringify(user));
}

// Remove user from localStorage
function removeStoredUser(): void {
  localStorage.removeItem("eatsy_user");
}

let orderState: {
  order: Order | null;
  orderItems: { dish: Dish; orderItem: OrderItem }[] | null;
} = {
  order: {
    id: 1,
    customerId: 999,
    cookId: 1,
    status: "cart",
    totalAmount: 8300,
    deliveryFee: 1000,
    orderDate: new Date(),
  },
  orderItems: [
    {
      dish: {
        id: 1,
        name: demoDishes[0].title,
        description: demoDishes[0].caption,
        price: parseInt(demoDishes[0].price.replace(/[₦,]/g, "")) || 1500,
        originalPrice: null,
        imageUrl: demoDishes[0].image,
        prepTime: "25-35 min",
        isAvailable: true,
        isPopular: demoDishes[0].rating >= 4.7 || demoDishes[0].likes >= 150,
        hasVeganOption: false,
        rating: demoDishes[0].rating,
        ratingCount: demoDishes[0].likes + demoDishes[0].comments,
        tags: ["Nigerian", "Popular"],
        cookId: Number(demoDishes[0].cookId),
        createdAt: new Date(demoDishes[0].createdAt),
      },
      orderItem: { id: 1, orderId: 1, dishId: 1, quantity: 1, price: 4500 },
    },
    {
      dish: {
        id: 2,
        name: demoDishes[1].title,
        description: demoDishes[1].caption,
        price: parseInt(demoDishes[1].price.replace(/[₦,]/g, "")) || 800,
        originalPrice: null,
        imageUrl: demoDishes[1].image,
        prepTime: "15-20 min",
        isAvailable: true,
        isPopular: demoDishes[1].rating >= 4.7 || demoDishes[1].likes >= 150,
        hasVeganOption: false,
        rating: demoDishes[1].rating,
        ratingCount: demoDishes[1].likes + demoDishes[1].comments,
        tags: ["Dessert", "Sweet"],
        cookId: Number(demoDishes[1].cookId),
        createdAt: new Date(demoDishes[1].createdAt),
      },
      orderItem: { id: 2, orderId: 1, dishId: 2, quantity: 1, price: 3800 },
    },
  ],
};

function parseUrl(url: string) {
  const u = new URL(url, window.location.origin);
  return { pathname: u.pathname, searchParams: u.searchParams };
}

async function handleApi(url: string, init?: RequestInit): Promise<Response> {
  const { pathname, searchParams } = parseUrl(url);
  const method = (init?.method || "GET").toUpperCase();

  // Auth endpoints
  if (pathname === "/api/user" && method === "GET") {
    // Return stored user from localStorage
    const user = getStoredUser();
    return ok(user);
  }
  if (pathname === "/api/login" && method === "POST") {
    // Parse the request body to get credentials
    const body = init?.body ? JSON.parse(init.body as string) : {};

    // Simple mock login - accept any credentials
    const user = {
      id: 999,
      username: body.username || "demo",
      email: "demo@eatsy.app",
      fullName: "Demo User",
      userType: "customer",
    } as User;

    // Store user in localStorage
    setStoredUser(user);

    return ok({ user, token: "demo-token" });
  }
  if (pathname === "/api/register" && method === "POST") {
    // Parse the request body to get registration data
    const body = init?.body ? JSON.parse(init.body as string) : {};

    const user = {
      id: 1000,
      username: body.username || "newuser",
      email: body.email || "new@eatsy.app",
      fullName: body.fullName || "New User",
      userType: body.userType || "customer",
    } as User;

    // Store user in localStorage
    setStoredUser(user);

    return created({ user, token: "demo-token" });
  }
  if (pathname === "/api/logout" && method === "POST") {
    // Remove user from localStorage
    removeStoredUser();
    return noContent();
  }

  // Dishes list with basic filtering
  if (pathname === "/api/dishes" && method === "GET") {
    let data = demoDishes;
    const search = searchParams.get("search");
    if (search) {
      data = data.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));
    }
    return ok(data);
  }

  // Single dish details
  const dishMatch = pathname.match(/^\/api\/dishes\/(\d+)$/);
  if (dishMatch && method === "GET") {
    const id = Number(dishMatch[1]);
    const dish = demoDishes.find((d) => Number(d.id) === id);
    if (!dish) return err(404, "Dish not found");

    // Transform flat dish structure to expected format for the component
    const dishData = {
      dish: {
        id: Number(dish.id),
        name: dish.title,
        description: dish.caption,
        price: parseInt(dish.price.replace(/[₦,]/g, "")) || 0,
        originalPrice: null,
        imageUrl: dish.image,
        prepTime: "25-35 min", // Default since not in new structure
        isAvailable: true,
        isPopular: dish.rating >= 4.7 || dish.likes >= 150,
        hasVeganOption: false,
        rating: dish.rating,
        ratingCount: dish.likes + dish.comments,
        tags: ["Nigerian", "Popular"], // Default tags since not in new structure
        cookId: Number(dish.cookId),
        createdAt: new Date(dish.createdAt),
      },
      cook: {
        id: Number(dish.cookId),
        fullName: dish.cookName,
        profileImage: dish.cookImage,
        isVerified: dish.isVerified,
      },
      isLiked: dish.isLiked,
      isSaved: dish.isSaved,
      likes: dish.likes,
    };
    return ok(dishData);
  }

  // Toggle like/save
  const likeMatch = pathname.match(/^\/api\/dishes\/(\d+)\/toggle-like$/);
  if (likeMatch && method === "POST") {
    const id = Number(likeMatch[1]);
    const dish = demoDishes.find((d) => Number(d.id) === id);
    if (!dish) return err(404, "Dish not found");
    dish.isLiked = !dish.isLiked;
    dish.likes += dish.isLiked ? 1 : -1;
    return ok({ isLiked: dish.isLiked });
  }
  const saveMatch = pathname.match(/^\/api\/dishes\/(\d+)\/toggle-save$/);
  if (saveMatch && method === "POST") {
    const id = Number(saveMatch[1]);
    const dish = demoDishes.find((d) => Number(d.id) === id);
    if (!dish) return err(404, "Dish not found");
    dish.isSaved = !dish.isSaved;
    return ok({ isSaved: dish.isSaved });
  }

  // Cooks list
  if (pathname === "/api/cooks" && method === "GET") {
    let cooks = demoCooks;
    const search = searchParams.get("search");
    if (search) {
      cooks = cooks.filter((c) => c?.fullName?.toLowerCase().includes(search.toLowerCase()));
    }
    return ok(cooks);
  }

  // Cook profile
  const cookMatch = pathname.match(/^\/api\/cooks\/(\d+)$/);
  if (cookMatch && method === "GET") {
    const id = Number(cookMatch[1]);
    const cook = demoCooks.find((c) => c.id === id);
    if (!cook) return err(404, "Cook not found");

    // Filter dishes by cookId and transform to expected format
    const dishes = demoDishes
      .filter((d) => Number(d.cookId) === id)
      .map((dish) => ({
        dish: {
          id: Number(dish.id),
          name: dish.title,
          description: dish.caption,
          price: parseInt(dish.price.replace(/[₦,]/g, "")) * 100, // Convert to kobo for display
          originalPrice: null,
          imageUrl: dish.image,
          prepTime: "25-35 min",
          isAvailable: true,
          isPopular: dish.rating >= 4.7 || dish.likes >= 150,
          hasVeganOption: false,
          rating: dish.rating,
          ratingCount: dish.likes + dish.comments,
          tags: ["Nigerian", "Popular"],
          cookId: Number(dish.cookId),
          createdAt: new Date(dish.createdAt),
        },
        isLiked: dish.isLiked,
        isSaved: dish.isSaved,
        likes: dish.likes,
      }));

    return ok({
      cook,
      dishes,
      isFollowing: false,
      stats: {
        followersCount: 120,
        avgRating: 4.6,
        totalOrders: 245,
        ratingCount: 80,
      },
    });
  }

  // Follow cook
  const followMatch = pathname.match(/^\/api\/cooks\/(\d+)\/follow$/);
  if (followMatch && method === "POST") {
    return ok({ isFollowing: true });
  }

  // Orders
  if (pathname === "/api/orders/current" && method === "GET") {
    return ok(orderState);
  }
  if (pathname === "/api/orders/add-item" && method === "POST") {
    // Simplified add
    return ok({});
  }
  if (pathname === "/api/orders/update-item" && method === "POST") {
    // no-op in mock
    return ok({});
  }
  if (pathname === "/api/orders/checkout" && method === "POST") {
    orderState = { order: null, orderItems: null };
    return ok({});
  }

  // User endpoints
  if (pathname === "/api/orders" && method === "GET") {
    const active = demoOrders.filter((o) => o.order.status !== "completed");
    const past = demoOrders.filter((o) => o.order.status === "completed");
    return ok({
      active: active.map((o) => o.order),
      past: past.map((o) => o.order),
    });
  }
  const orderMatch = pathname.match(/^\/api\/orders\/(\d+)$/);
  if (orderMatch && method === "GET") {
    const id = Number(orderMatch[1]);
    const order = getOrderById(id);
    if (!order) return err(404, "Order not found");
    return ok(order);
  }
  if (pathname === "/api/user/profile" && (method === "PUT" || method === "PATCH")) {
    return ok({});
  }
  if (pathname === "/api/user/change-password" && method === "POST") {
    return ok({});
  }
  if (pathname === "/api/user/account" && method === "DELETE") {
    removeStoredUser();
    return ok({});
  }

  // Default: fall back to real fetch for any other assets
  return fetch(url, init);
}

export async function mockFetch(url: string, init?: RequestInit): Promise<Response> {
  if (url.startsWith("/api/")) {
    return handleApi(url, init);
  }
  return fetch(url, init);
}

export function installMockFetch() {
  // No global override; we wrap fetch via mockFetch in our API layer
}
