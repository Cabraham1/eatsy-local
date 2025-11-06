import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type OrderSummary = {
  id: number;
  customerId: number;
  cookId: number;
  status: string;
  totalAmount: number;
  deliveryFee: number;
  orderDate: string | Date;
};

export default function OrdersPage() {
  const { data, isLoading, error } = useQuery<{
    active: OrderSummary[];
    past: OrderSummary[];
  }>({
    queryKey: ["/api/orders"],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center">Loading orders...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">Failed to load orders.</CardContent>
        </Card>
      </div>
    );
  }

  const formatNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

  const Section = ({ title, orders }: { title: string; orders: OrderSummary[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-sm text-muted-foreground">No orders</div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <div className="font-medium">Order #{o.id}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(o.orderDate).toLocaleDateString("en-NG")} • {o.status}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-semibold">{formatNaira(o.totalAmount)}</div>
                  <Link href={`/orders/${o.id}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto space-y-6 py-8">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <Section title="Active" orders={data.active} />
      <Section title="Past" orders={data.past} />
    </div>
  );
}
