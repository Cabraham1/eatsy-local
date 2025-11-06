import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const { data, isLoading, error } = useQuery<{
    id: number;
    order: any;
    items: any[];
  }>({
    queryKey: [`/api/orders/${orderId}`],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">Loading...</div>
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">Order not found.</CardContent>
        </Card>
      </div>
    );
  }

  const { order, items } = data;
  const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

  const subtotal = items.reduce((sum, it) => sum + it.orderItem.price * it.orderItem.quantity, 0);
  const total = subtotal + order.deliveryFee;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">
            {new Date(order.orderDate).toLocaleString("en-NG")} • {order.status}
          </div>

          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.dish.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={it.dish.imageUrl}
                    className="h-16 w-16 rounded object-cover"
                    alt={it.dish.name}
                  />
                  <div>
                    <div className="font-medium">{it.dish.name}</div>
                    <div className="text-sm text-muted-foreground">x{it.orderItem.quantity}</div>
                  </div>
                </div>
                <div className="font-medium">{formatNaira(it.orderItem.price)}</div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span>{formatNaira(order.deliveryFee)}</span>
            </div>
            <div className="mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatNaira(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
