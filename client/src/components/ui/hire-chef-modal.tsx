import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, ChefHat, Check } from "lucide-react";
import { User } from "@shared/schema";

interface HireChefModalProps {
  cook: User;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface EventDetails {
  date: string;
  guests: number;
  eventType: string;
  specialRequests: string;
}

interface PackageOption {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  includes: string[];
}

const packageOptions: PackageOption[] = [
  {
    id: "basic",
    name: "Basic Package",
    description: "Perfect for intimate gatherings",
    price: 15000,
    duration: "3 hours",
    includes: [
      "Chef services for 3 hours",
      "Menu consultation",
      "Ingredient shopping",
      "Food preparation & cooking",
      "Basic cleanup",
    ],
  },
  {
    id: "premium",
    name: "Premium Package",
    description: "Ideal for special occasions",
    price: 25000,
    duration: "5 hours",
    includes: [
      "Chef services for 5 hours",
      "Custom menu design",
      "Premium ingredients",
      "Professional plating",
      "Complete cleanup",
      "Serving assistance",
    ],
  },
  {
    id: "deluxe",
    name: "Deluxe Package",
    description: "Ultimate dining experience",
    price: 35000,
    duration: "8 hours",
    includes: [
      "Chef services for 8 hours",
      "Multi-course tasting menu",
      "Premium ingredients & equipment",
      "Professional table service",
      "Full event coordination",
      "Photography assistance",
    ],
  },
];

export function HireChefModal({ cook, isOpen, onClose, onComplete }: HireChefModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
    date: "",
    guests: 1,
    eventType: "",
    specialRequests: "",
  });
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  const handleEventDetailsChange = (field: keyof EventDetails, value: string | number) => {
    setEventDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Here you would typically send the hire request to your API
    onComplete();
    onClose();
    // Reset form
    setCurrentStep(1);
    setEventDetails({
      date: "",
      guests: 1,
      eventType: "",
      specialRequests: "",
    });
    setSelectedPackage("");
  };

  const selectedPackageData = packageOptions.find((p) => p.id === selectedPackage);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Hire {cook.fullName}</DialogTitle>
          <DialogDescription>
            Book a private cooking experience with {cook.fullName}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="mb-6 flex items-center justify-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
                  step === currentStep
                    ? "bg-orange-500 text-white"
                    : step < currentStep
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                } `}
              >
                {step < currentStep ? <Check className="h-5 w-5" /> : step}
              </div>
              {step < 3 && (
                <div className="mx-2 h-0.5 w-12 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mb-6 text-center">
          <div className="text-sm text-gray-600">
            {currentStep === 1 && "Event"}
            {currentStep === 2 && "Package"}
            {currentStep === 3 && "Confirm"}
          </div>
        </div>

        {/* Step 1: Event Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold">Event Details</h3>

            <div>
              <Label htmlFor="event-date">Event Date</Label>
              <Input
                id="event-date"
                type="date"
                value={eventDetails.date}
                onChange={(e) => handleEventDetailsChange("date", e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <Label htmlFor="guests">Number of Guests</Label>
              <Input
                id="guests"
                type="number"
                min="1"
                max="50"
                value={eventDetails.guests}
                onChange={(e) => handleEventDetailsChange("guests", parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <Label htmlFor="event-type">Event Type</Label>
              <Input
                id="event-type"
                placeholder="e.g., Birthday party, Anniversary dinner, Corporate event"
                value={eventDetails.eventType}
                onChange={(e) => handleEventDetailsChange("eventType", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="special-requests">Special Requests (Optional)</Label>
              <Textarea
                id="special-requests"
                placeholder="Any dietary restrictions, special dishes, or other requirements..."
                value={eventDetails.specialRequests}
                onChange={(e) => handleEventDetailsChange("specialRequests", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Package Selection */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold">Choose a Package</h3>

            <div className="space-y-4">
              {packageOptions.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? "border-orange-500 ring-2 ring-orange-200"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-600">
                          ₦{pkg.price.toLocaleString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-3 w-3" />
                          {pkg.duration}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {pkg.includes.map((item, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="mr-2 h-3 w-3 text-green-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold">Confirm Your Booking</h3>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="mr-2 h-5 w-5" />
                  {cook.fullName}
                </CardTitle>
                <p className="text-sm text-gray-600">{cook.cuisine} Cuisine</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {eventDetails.date
                      ? new Date(eventDetails.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Date not selected"}
                  </span>
                </div>

                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm">{eventDetails.guests} guests</span>
                </div>

                {eventDetails.eventType && (
                  <div className="flex items-center">
                    <Badge variant="outline">{eventDetails.eventType}</Badge>
                  </div>
                )}

                {selectedPackageData && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="font-medium">{selectedPackageData.name}</h4>
                    <p className="mb-2 text-sm text-gray-600">{selectedPackageData.description}</p>
                    <div className="text-lg font-bold text-orange-600">
                      ₦{selectedPackageData.price.toLocaleString()}
                    </div>
                  </div>
                )}

                {eventDetails.specialRequests && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="text-sm font-medium">Special Requests</h4>
                    <p className="text-sm text-gray-600">{eventDetails.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePrevStep}>
                Previous
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={handleNextStep}
                disabled={
                  (currentStep === 1 &&
                    (!eventDetails.date || !eventDetails.guests || !eventDetails.eventType)) ||
                  (currentStep === 2 && !selectedPackage)
                }
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} className="bg-orange-500 hover:bg-orange-600">
                Confirm Booking
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
