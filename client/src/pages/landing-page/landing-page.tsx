import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/ui/header";
import {
  ChevronRight,
  Award,
  TrendingUp,
  Map,
  Star,
  Utensils,
  Clock,
  Phone,
  Users,
  Truck,
} from "lucide-react";

export default function LandingPage() {
  // const [, navigate] = useLocation();

  //just for demo purposes redirect to /home
  // navigate("/for-you");

  // Use a simpler approach without authentication logic
  // We'll handle authentication redirects elsewhere

  // Featured cooks data
  const featuredCooks = [
    {
      id: 1,
      name: "Maria Romano",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      specialty: "Italian Cuisine",
      rating: 4.9,
    },
    {
      id: 2,
      name: "David Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      specialty: "Asian Fusion",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Sophia Martinez",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
      specialty: "Mediterranean",
      rating: 4.7,
    },
  ];

  // Popular dishes data
  const popularDishes = [
    {
      id: 1,
      name: "Grilled Chicken with Rice",
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5",
      price: 2500,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Vegetable Curry with Flatbread",
      image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26",
      price: 3000,
      rating: 4.9,
    },
    {
      id: 3,
      name: "Spicy BBQ Platter",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
      price: 3500,
      rating: 4.7,
    },
  ];

  // Locations served
  const locations = [
    "New York",
    "London",
    "Tokyo",
    "Paris",
    "Sydney",
    "Toronto",
    "Dubai",
    "Singapore",
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-24 text-white">
        <div className="container mx-auto flex flex-col items-center lg:flex-row">
          <div className="mb-10 lg:mb-0 lg:w-1/2">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              Authentic Home Cuisine Delivered To Your Door
            </h1>
            <p className="mb-8 text-lg opacity-90 md:text-xl">
              Connect with local home cooks and enjoy delicious, homemade dishes from around the
              world. Order now and experience the taste of home.
            </p>
            <div className="flex gap-3">
              <Link href="/auth">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-white text-orange-600 hover:bg-orange-600 hover:text-white active:bg-orange-500 active:text-white"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/dishes">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-orange-600 text-white hover:bg-white hover:text-orange-600 active:bg-orange-500 active:text-white"
                >
                  Explore Dishes
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative lg:w-1/2">
            <div className="relative cursor-pointer overflow-hidden rounded-lg shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Delicious home-cooked cuisine"
                className="hover:animate-bounce-zoom h-[400px] w-full object-cover transition-transform"
              />
              <div className="absolute inset-0 rounded-lg bg-black/20"></div>
            </div>
            <div className="absolute -bottom-5 -left-5 rounded-lg bg-white p-4 shadow-lg">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-orange-500 p-2">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Time</p>
                  <p className="font-bold text-gray-900">30-45 min</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-5 -top-5 rounded-lg bg-white p-4 shadow-lg">
              <div className="flex items-center">
                <div className="mr-3 rounded-full bg-green-500 p-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Local Cooks</p>
                  <p className="font-bold text-gray-900">500+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">How Eatsy Works</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Our platform connects you with talented home cooks in your area, bringing authentic
              home cuisine straight to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Utensils className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">1. Choose Your Dish</h3>
              <p className="text-gray-600">
                Browse through a wide variety of authentic dishes prepared by skilled local cooks in
                your area.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">2. Select a Cook</h3>
              <p className="text-gray-600">
                Choose from our verified home cooks, each specializing in different cuisines from
                around the world.
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">3. Enjoy Delivery</h3>
              <p className="text-gray-600">
                We deliver your meal fresh and hot, straight from the cook&apos;s kitchen to your
                doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cooks Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Top Rated Cooks</h2>
            <Link href="/cooks">
              <Button variant="ghost" className="flex items-center">
                See All <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredCooks.map((cook) => (
              <div
                key={cook.id}
                className="overflow-hidden rounded-lg bg-white shadow-md hover:cursor-pointer"
              >
                <div className="h-48 overflow-hidden">
                  <img src={cook.image} alt={cook.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">{cook.name}</h3>
                  <p className="mb-4 text-gray-600">{cook.specialty}</p>
                  <div className="flex items-center">
                    <Star className="mr-1 h-5 w-5 fill-current text-yellow-400" />
                    <span className="font-medium">{cook.rating}</span>
                    <span className="ml-1 text-gray-500">(200+ ratings)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Popular Dishes</h2>
            <Link href="/dishes">
              <Button variant="ghost" className="flex items-center">
                Explore Menu <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {popularDishes.map((dish) => (
              <div key={dish.id} className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="h-48 overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold">{dish.name}</h3>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-orange-600">
                      ₦{Math.round(dish.price / 100).toLocaleString()}
                    </p>
                    <div className="flex items-center">
                      <Star className="mr-1 h-5 w-5 fill-current text-yellow-400" />
                      <span>{dish.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Why Choose Eatsy</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              We&apos;re not just a food delivery platform. We&apos;re a community that celebrates
              diverse cuisines and supports local cooks.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Quality Food</h3>
              <p className="text-gray-600">
                Authentic home-cooked meals prepared with fresh, local ingredients.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Map className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Local Cooks</h3>
              <p className="text-gray-600">
                Support local entrepreneurs and enjoy dishes from your community.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Fast Delivery</h3>
              <p className="text-gray-600">
                Hot, fresh meals delivered to your doorstep in 45 minutes or less.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <Phone className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Easy Ordering</h3>
              <p className="text-gray-600">
                Simple, intuitive platform for browsing and ordering your favorite dishes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Available in Major Cities Worldwide</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              We&apos;re rapidly expanding across the globe to bring delicious local cuisine to more
              cities.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="flex flex-wrap justify-center gap-4">
              {locations.map((location, index) => (
                <div key={index} className="rounded-full bg-white px-6 py-2 shadow-sm">
                  <span className="font-medium">{location}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-500 px-4 py-16 text-white">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Experience Authentic Home-Cooked Cuisine?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl opacity-90">
            Join Eatsy today and discover a world of delicious homemade dishes from talented local
            cooks.
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-12 text-white">
        <div className="container mx-auto">
          <div className="mb-8 flex flex-col justify-between md:flex-row">
            <div className="mb-8 md:mb-0">
              <h3 className="mb-4 text-2xl font-bold">Eatsy</h3>
              <p className="max-w-xs text-gray-400">
                Connecting food lovers with talented home cooks around the world.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h4 className="mb-4 text-lg font-semibold">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold">For Cooks</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Become a Cook
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Cook Resources
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Cook Login
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold">Support</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-white">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Eatsy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
