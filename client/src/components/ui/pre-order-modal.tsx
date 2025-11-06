import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Calendar, Clock, MapPin } from "lucide-react";
import { Dish, User } from "@shared/schema";

interface PreOrderModalProps {
  dish: Dish;
  cook: User;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface PreOrderDetails {
  quantity: number;
  date: string;
  time: string;
  deliveryAddress: string;
  specialInstructions: string;
  isDelivery: boolean;
}

export function PreOrderModal({ dish, cook, isOpen, onClose, onComplete }: PreOrderModalProps) {
  const [orderDetails, setOrderDetails] = useState<PreOrderDetails>({
    quantity: 1,
    date: "",
    time: "",
    deliveryAddress: "",
    specialInstructions: "",
    isDelivery: true,
  });

  const handleQuantityChange = (increment: boolean) => {
    setOrderDetails((prev) => ({
      ...prev,
      quantity: increment ? Math.min(prev.quantity + 1, 20) : Math.max(prev.quantity - 1, 1),
    }));
  };

  const handleInputChange = (field: keyof PreOrderDetails, value: string | boolean) => {
    setOrderDetails((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const subtotal = dish.price * orderDetails.quantity;
    const deliveryFee = orderDetails.isDelivery ? 1000 : 0;
    return subtotal + deliveryFee;
  };

  const handleSubmit = () => {
    // Here you would typically send the pre-order to your API
    onComplete();
    onClose();

    // Reset form
    setOrderDetails({
      quantity: 1,
      date: "",
      time: "",
      deliveryAddress: "",
      specialInstructions: "",
      isDelivery: true,
    });
  };

  const isFormValid = () => {
    return (
      orderDetails.date &&
      orderDetails.time &&
      (orderDetails.isDelivery ? orderDetails.deliveryAddress : true)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pre-Order</DialogTitle>
          <DialogDescription>Schedule your order for later delivery or pickup</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Dish Information */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-3">
                <img
                  src={dish.imageUrl}
                  alt={dish.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{dish.name}</h3>
                  <p className="line-clamp-2 text-sm text-gray-600">{dish.description}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold text-orange-600">
                      ₦{dish.price.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 h-3 w-3" />
                      {dish.prepTime}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cook Information */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>By</span>
            <span className="font-medium text-gray-900">{cook.fullName}</span>
            <span>•</span>
            <span>{cook.cuisine}</span>
          </div>

          {/* Quantity Selection */}
          <div>
            <Label>Quantity</Label>
            <div className="mt-2 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(false)}
                disabled={orderDetails.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-lg font-medium">{orderDetails.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(true)}
                disabled={orderDetails.quantity >= 20}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order-date">Delivery Date</Label>
              <Input
                id="order-date"
                type="date"
                value={orderDetails.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="order-time">Preferred Time</Label>
              <Input
                id="order-time"
                type="time"
                value={orderDetails.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
          </div>

          {/* Delivery Options */}
          <div>
            <Label>Fulfillment Method</Label>
            <div className="mt-2 flex gap-2">
              <Button
                variant={orderDetails.isDelivery ? "default" : "outline"}
                onClick={() => handleInputChange("isDelivery", true)}
                className="flex-1"
              >
                Delivery
              </Button>
              <Button
                variant={!orderDetails.isDelivery ? "default" : "outline"}
                onClick={() => handleInputChange("isDelivery", false)}
                className="flex-1"
              >
                Pickup
              </Button>
            </div>
          </div>

          {/* Delivery Address */}
          {orderDetails.isDelivery && (
            <div>
              <Label htmlFor="delivery-address">
                <MapPin className="mr-1 inline h-4 w-4" />
                Delivery Address
              </Label>
              <Textarea
                id="delivery-address"
                placeholder="Enter your full delivery address..."
                value={orderDetails.deliveryAddress}
                onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
              />
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <Label htmlFor="special-instructions">Special Instructions (Optional)</Label>
            <Textarea
              id="special-instructions"
              placeholder="Any special requests, dietary restrictions, or cooking preferences..."
              value={orderDetails.specialInstructions}
              onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
            />
          </div>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>
                  {dish.name} × {orderDetails.quantity}
                </span>
                <span>₦{(dish.price * orderDetails.quantity).toLocaleString()}</span>
              </div>

              {orderDetails.isDelivery && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₦1,000</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-orange-600">₦{calculateTotal().toLocaleString()}</span>
              </div>

              {orderDetails.date && orderDetails.time && (
                <>
                  <Separator />
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(orderDetails.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{orderDetails.time}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Confirm Pre-Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
