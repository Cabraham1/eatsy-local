export const API_ENDPOINTS = {
  auth: {
    login: "/api/v1/accounts/login/",
    register: "/api/v1/accounts/register/",
    logout: "/api/v1/accounts/logout/",
    me: "/api/v1/accounts/me/",
    verifyLoginOtp: "/api/v1/accounts/verify-login-otp/",
    verifyRegistrationOtp: "/api/v1/accounts/verify-registration-otp/",
    resendLoginOtp: "/api/v1/accounts/resend-login-otp/",
    resendRegistrationOtp: "/api/v1/accounts/resend-registration-otp/",
    resetPassword: "/api/v1/accounts/reset-password/",
    resetPasswordConfirm: "/api/v1/accounts/reset-password-confirm/",
  },
  users: {
    updateProfile: "/api/v1/accounts/me/",
    changePassword: "/api/v1/accounts/change-password/",
    deleteAccount: "/api/v1/users/account",
    roleChangeRequest: "/api/v1/accounts/role-change-request/",
  },
  cooks: {
    list: "/api/v1/cooks",
    details: (id: string) => `/api/v1/cooks/${id}`,
    onboard: "/api/v1/cooks/cooks/onboard/",
    onboardingStatus: "/api/v1/cooks/cooks/onboarding_status/",
  },
  dishes: {
    list: "/api/v1/dishes",
    details: (id: string) => `/api/v1/dishes/${id}`,
  },
  orders: {
    list: "/api/v1/orders",
    details: (id: string) => `/api/v1/orders/${id}`,
    create: "/api/v1/orders",
  },
  cart: {
    get: "/api/v1/cart",
    add: "/api/v1/cart/items",
    update: (id: string) => `/api/v1/cart/items/${id}`,
    remove: (id: string) => `/api/v1/cart/items/${id}`,
  },
  social: {
    createPost: "/api/v1/social/posts/",
    posts: "/api/v1/social/posts/",
    postDetails: (id: string) => `/api/v1/social/post/${id}/`,
  },
} as const;
