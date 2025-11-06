import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@shared/schema";

interface OrderHistory {
  active: any[];
  past: any[];
}

interface OrdersTabProps {
  userId: string;
}

export const OrdersTab = ({ userId }: OrdersTabProps) => {
  const [, navigate] = useLocation();

  const { data: orderHistory, isLoading: ordersLoading } = useQuery<OrderHistory>({
    queryKey: ["/api/orders"],
    enabled: !!userId,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View your past and active orders</CardDescription>
      </CardHeader>
      <CardContent>
        {ordersLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : !orderHistory || (!orderHistory.active?.length && !orderHistory.past?.length) ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>You don&apos;t have any orders yet.</p>
            <Button variant="link" className="mt-2" onClick={() => navigate("/dishes")}>
              Browse dishes to place your first order
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active orders */}
            {orderHistory.active && orderHistory.active.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium">Active Orders</h3>
                <div className="space-y-4">
                  {orderHistory.active.map((order: any) => (
                    <div
                      key={order.id}
                      className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.orderDate).toLocaleDateString("en-NG")}
                          </p>
                          <div className="mt-2">
                            <span
                              className={`inline-block rounded-full px-2 py-1 text-xs ${
                                order.status === "processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "preparing"
                                    ? "bg-amber-100 text-amber-800"
                                    : order.status === "delivering"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-green-100 text-green-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₦{order.totalAmount.toLocaleString("en-NG")}</p>
                          <p className="text-sm">{order?.items?.length} items</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past orders */}
            {orderHistory.past && orderHistory.past.length > 0 && (
              <div>
                <h3 className="mb-3 font-medium">Past Orders</h3>
                <div className="space-y-4">
                  {orderHistory.past.map((order: Order) => (
                    <div
                      key={order.id}
                      className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-gray-50"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.orderDate).toLocaleDateString("en-NG")}
                          </p>
                          <div className="mt-2">
                            <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                              Completed
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₦{order.totalAmount.toLocaleString("en-NG")}</p>
                          <p className="text-sm">{order?.items?.length} items</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
