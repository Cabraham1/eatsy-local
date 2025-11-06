import { useQuery, useMutation } from "@tanstack/react-query";
import { Dish, Order, OrderItem } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { queryClient } from "@/lib/constants/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { demoDishes } from "@/mocks/data";
import { api } from "@/lib/constants/api-client";

interface OrderItemViewProps {
  item: {
    dish: Dish;
    quantity: number;
  };
  onIncrement: (dishId: number) => void;
  onDecrement: (dishId: number) => void;
}

const OrderItemView = ({ item, onIncrement, onDecrement }: OrderItemViewProps) => {
  return (
    <div className="flex">
      <div
        className="mr-3 h-16 w-16 rounded-lg bg-cover bg-center"
        style={{ backgroundImage: `url('${item.dish.imageUrl}')` }}
      />
      <div className="flex-grow">
        <h4 className="font-medium">{item.dish.name}</h4>
        <p className="text-xs text-muted-foreground">From Cook #{item.dish.cookId}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-bold">₦{item.dish.price.toLocaleString()}</span>
          <div className="flex items-center rounded-lg border border-muted">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={() => onDecrement(item.dish.id)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-2 text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-primary"
              onClick={() => onIncrement(item.dish.id)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function OrderSummary() {
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // For demonstration, we're using mock data
  const MOCK_DEMO_DATA = true;

  const { data: fetchedOrder, isLoading: isLoadingOrder } = useQuery<{
    order: Order | null;
    orderItems:
      | {
          dish: Dish;
          orderItem: OrderItem;
        }[]
      | null;
  }>({
    queryKey: ["/api/orders/current"],
    enabled: !MOCK_DEMO_DATA,
  });

  // Mock data for preview purposes - Use centralized demoDishes data
  const mockOrder: {
    order: Order | null;
    orderItems:
      | {
          dish: Dish;
          orderItem: OrderItem;
        }[]
      | null;
  } = {
    order: {
      id: 1,
      customerId: 1,
      cookId: 1,
      status: "cart",
      totalAmount: 8300,
      deliveryFee: 1000,
      orderDate: new Date(),
    },
    orderItems: [
      {
        dish: demoDishes[0] as unknown as Dish,
        orderItem: {
          id: 1,
          orderId: 1,
          dishId: demoDishes[0] as unknown as number,
          quantity: 1,
          price: demoDishes[0] as unknown as number,
        },
      },
      {
        dish: demoDishes[1] as unknown as Dish,
        orderItem: {
          id: 2,
          orderId: 1,
          dishId: demoDishes[1] as unknown as number,
          quantity: 1,
          price: demoDishes[1] as unknown as number,
        },
      },
    ],
  };

  // Use mock data if enabled, otherwise use fetched data
  const currentOrder = MOCK_DEMO_DATA ? mockOrder : fetchedOrder;
  const isLoading = !MOCK_DEMO_DATA && isLoadingOrder;

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ dishId, quantity }: { dishId: number; quantity: number }) => {
      await api.post("/api/orders/update-item", { dishId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/orders/current`] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/orders/checkout", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/orders/current`] });
      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed.",
      });
      setIsCheckingOut(false);
    },
    onError: (error) => {
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive",
      });
      setIsCheckingOut(false);
    },
  });

  const handleIncrement = (dishId: number) => {
    const item = currentOrder?.orderItems?.find((item) => item.dish.id === dishId);
    if (item) {
      updateQuantityMutation.mutate({
        dishId,
        quantity: item.orderItem.quantity + 1,
      });
    }
  };

  const handleDecrement = (dishId: number) => {
    const item = currentOrder?.orderItems?.find((item) => item.dish.id === dishId);
    if (item) {
      if (item.orderItem.quantity === 1) {
        // Remove item if quantity would be 0
        updateQuantityMutation.mutate({
          dishId,
          quantity: 0,
        });
      } else {
        updateQuantityMutation.mutate({
          dishId,
          quantity: item.orderItem.quantity - 1,
        });
      }
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    checkoutMutation.mutate();
  };

  const isCartEmpty = !currentOrder?.orderItems || currentOrder.orderItems.length === 0;
  const deliveryFee = currentOrder?.order?.deliveryFee || 3.99;
  const subtotal =
    currentOrder?.orderItems?.reduce(
      (sum, item) => sum + item.dish.price * item.orderItem.quantity,
      0
    ) || 0;
  const total = subtotal + deliveryFee;

  if (isLoading) {
    return (
      <div className="mb-6 rounded-xl bg-white p-4 shadow-card">
        <h3 className="mb-4 text-lg font-medium">My Order</h3>
        <div className="space-y-4">
          <div className="flex">
            <Skeleton className="mr-3 h-16 w-16 rounded-lg" />
            <div className="flex-grow">
              <Skeleton className="mb-1 h-5 w-32" />
              <Skeleton className="mb-2 h-4 w-24" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
          <div className="flex">
            <Skeleton className="mr-3 h-16 w-16 rounded-lg" />
            <div className="flex-grow">
              <Skeleton className="mb-1 h-5 w-32" />
              <Skeleton className="mb-2 h-4 w-24" />
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
          <div className="mt-4 border-t border-muted pt-4">
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-4 h-5 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl bg-white p-4 shadow-card">
      <h3 className="mb-4 text-lg font-medium">My Order</h3>

      {isCartEmpty ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mb-3 text-sm text-muted-foreground">Your cart is empty</p>
          <Button variant="link" className="text-sm font-medium text-primary">
            Browse Food
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {currentOrder?.orderItems?.map((item) => (
              <OrderItemView
                key={item.dish.id}
                item={{
                  dish: item.dish,
                  quantity: item.orderItem.quantity,
                }}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
              />
            ))}
          </div>

          <div className="mt-4 border-t border-muted pt-4">
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="mt-3 flex justify-between font-medium">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>

            <Button
              className="mt-4 w-full rounded-lg bg-primary py-2 font-medium text-white"
              onClick={handleCheckout}
              disabled={isCheckingOut || checkoutMutation.isPending}
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
