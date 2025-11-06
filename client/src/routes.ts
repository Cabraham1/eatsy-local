import { lazy } from "react";
import { CartPage } from "@/pages/dashboard/cart-page";
import { CheckoutPage } from "@/pages/dashboard/checkout-page";
import { ProfilePage } from "@/pages/dashboard/profile-page";
import NotFound from "@/pages/dashboard/not-found";

const AuthPage = lazy(() => import("@/pages/auth/auth-page"));
const CookProfilePage = lazy(() => import("@/pages/dashboard/cook-profile-page"));
const CooksPage = lazy(() => import("@/pages/dashboard/cooks-page"));
// const OrderPage = lazy(() => import("@/pages/dashboard/order-page"));
const OrdersPage = lazy(() => import("@/pages/dashboard/orders-page"));
const OrderDetailsPage = lazy(() => import("@/pages/dashboard/order-details-page"));
const DishesPage = lazy(() => import("@/pages/dashboard/dishes-page"));
const DishDetailsPage = lazy(() => import("@/pages/dashboard/dish-details-page"));
const LandingPage = lazy(() => import("@/pages/landing-page/landing-page"));
const ExplorePage = lazy(() => import("@/pages/dashboard/explore-page"));
const HomePage = lazy(() => import("@/pages/dashboard/home-page"));

export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  protected?: boolean;
  redirectIfAuthenticated?: boolean;
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    component: LandingPage,
    protected: false,
    redirectIfAuthenticated: true,
  },
  {
    path: "/auth",
    component: AuthPage,
    protected: false,
    redirectIfAuthenticated: true,
  },
  {
    path: "/for-you",
    component: ExplorePage,
    protected: true,
  },
  {
    path: "/home",
    component: HomePage,
    protected: true,
  },
  {
    path: "/cooks",
    component: CooksPage,
    protected: true,
  },
  {
    path: "/cooks/:id",
    component: CookProfilePage,
    protected: true,
  },
  {
    path: "/dishes",
    component: DishesPage,
    protected: true,
  },
  {
    path: "/dishes/:id",
    component: DishDetailsPage,
    protected: true,
  },
  {
    path: "/cart",
    component: CartPage,
    protected: true,
  },
  {
    path: "/checkout",
    component: CheckoutPage,
    protected: true,
  },
  {
    path: "/orders",
    component: OrdersPage,
    protected: true,
  },
  {
    path: "/orders/:id",
    component: OrderDetailsPage,
    protected: true,
  },
  {
    path: "/profile",
    component: ProfilePage,
    protected: true,
  },
];

export const notFoundRoute = {
  component: NotFound,
};
