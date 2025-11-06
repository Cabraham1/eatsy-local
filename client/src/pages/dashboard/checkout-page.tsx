import React from "react";
import { useLocation } from "wouter";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, MapPin, Phone, User, ShoppingCart } from "lucide-react";

export function CheckoutPage() {
  const [, navigate] = useLocation();
  const { items, totalItems, totalAmount, clearCart } = useCartStore();

  const handlePlaceOrder = () => {
    // Here you would typically send the order to your backend
    console.log("Placing order:", { items, totalAmount });

    // Clear cart after successful order
    clearCart();

    // Navigate to order confirmation
    navigate("/orders");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/cart")} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>

          <Card className="py-12 text-center">
            <CardContent>
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
              <p className="mb-6 text-gray-500">Add some items to your cart before checking out.</p>
              <Button
                onClick={() => navigate("/dishes")}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Browse Dishes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigate("/cart")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Order Summary ({totalItems} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₦500</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₦{(totalAmount + 500).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input placeholder="Enter your full name" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input placeholder="Enter your phone number" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Textarea
                      placeholder="Enter your delivery address"
                      className="pl-10"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" className="font-mono" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Expiry Date</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVV</label>
                    <Input placeholder="123" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Special Instructions</label>
                  <Textarea placeholder="Any special delivery instructions?" rows={2} />
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  Place Order - ₦{(totalAmount + 500).toLocaleString()}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
