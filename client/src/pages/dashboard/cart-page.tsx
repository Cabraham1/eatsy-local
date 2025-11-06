import React from "react";
import { useLocation } from "wouter";
import { useCartStore } from "@/stores/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Trash2, ArrowLeft, ShoppingCart, Clock, User } from "lucide-react";

export function CartPage() {
  const [, navigate] = useLocation();
  const {
    items,
    totalItems,
    totalAmount,
    updateQuantity,
    removeItem,
    updateSpecialInstructions,
    clearCart,
  } = useCartStore();

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/dishes");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-6 flex items-center">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dishes")} className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>

          <Card className="py-12 text-center">
            <CardContent>
              <ShoppingCart className="mx-auto mb-4 h-16 w-16 text-gray-400" />
              <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
              <p className="mb-6 text-gray-500">
                Looks like you haven&apos;t added any dishes to your cart yet.
              </p>
              <Button
                onClick={handleContinueShopping}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8 pt-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between px-4">
          <div className="flex flex-col lg:flex-row lg:items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dishes")}
              className="mr-4 w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCart}
            className="text-red-500 hover:text-red-700"
          >
            Clear Cart
          </Button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Cart Items */}
          <div className="flex-grow">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl sm:text-2xl">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Cart Items ({totalItems})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border-y p-4 transition-shadow duration-200">
                    <div className="flex flex-col items-start gap-4 sm:flex-row">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-auto w-full rounded-lg border object-cover sm:h-24 sm:w-24"
                      />

                      <div className="flex-1">
                        <div className="flex flex-col items-start justify-between sm:flex-row">
                          <div className="mb-4 flex-1 sm:mb-0">
                            <h3 className="text-lg font-semibold sm:text-xl">{item.name}</h3>
                            <p className="mb-2 text-sm text-gray-600">{item.description}</p>

                            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{item.cookName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">30 min</span>
                              </div>
                            </div>

                            <div className="mb-3 flex items-center gap-2">
                              {item.tags?.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="mb-3">
                              <label className="mb-1 block text-sm font-medium text-gray-700">
                                Special Instructions
                              </label>
                              <Textarea
                                placeholder="Any special requests? (optional)"
                                value={item.specialInstructions || ""}
                                onChange={(e) => updateSpecialInstructions(item.id, e.target.value)}
                                className="text-sm"
                                rows={2}
                              />
                            </div>
                          </div>

                          <div className="w-full text-left sm:w-auto sm:text-right">
                            <p className="text-lg font-semibold">₦{item.price.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">
                              ₦{(item.price * item.quantity).toLocaleString()} total
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col items-center justify-between sm:flex-row">
                          <div className="mb-4 flex items-center gap-2 sm:mb-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <span className="w-12 text-center font-medium">{item.quantity}</span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="w-full text-red-500 hover:text-red-700 sm:w-auto"
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-80 xl:w-96">
            <Card className="sticky top-6 px-4">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
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

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                <Button variant="outline" onClick={handleContinueShopping} className="w-full">
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
