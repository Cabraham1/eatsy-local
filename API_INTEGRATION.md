# API Integration Guide

This document explains the API integration setup for the Eatsy frontend application.

## Overview

The application is configured to work with the Eatsy API at `https://api.plattr.org`. The integration follows industry-standard practices including:

- Environment-based configuration
- Centralized API client
- Type-safe service layer
- React Query for data fetching and caching
- Proper error handling

## Environment Configuration

### Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
VITE_API_BASE_URL=https://api.plattr.org
```

### Environment Variables

- `VITE_API_BASE_URL`: The base URL for the API (required)

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

## Architecture

### File Structure

```
client/src/
├── lib/
│   ├── config.ts           # Environment configuration and API endpoints
│   ├── api-client.ts       # HTTP client with interceptors
│   └── queryClient.ts      # React Query configuration
├── services/
│   └── auth.service.ts     # Authentication API service
└── hooks/
    └── use-auth.tsx        # Authentication React hook
```

## Core Components

### 1. Configuration (`lib/config.ts`)

Centralizes all API endpoints and environment configuration:

```typescript
import { config } from '@/lib/config';
import { API_ENDPOINTS } from '@/lib/config';

// Access base URL
const baseUrl = config.apiBaseUrl;

// Access specific endpoints
const loginEndpoint = API_ENDPOINTS.auth.login;
```

### 2. API Client (`lib/api-client.ts`)

Provides a typed HTTP client with automatic token management:

```typescript
import { api } from '@/lib/api-client';

// GET request
const response = await api.get<User>('/api/v1/users/profile');

// POST request
const response = await api.post<LoginResponse>(
  '/api/v1/accounts/login',
  { username, password }
);

// Skip authentication for public endpoints
const response = await api.post(
  '/api/v1/accounts/register',
  data,
  { skipAuth: true }
);
```

#### Features

- **Automatic token injection**: Adds Bearer token to all authenticated requests
- **Error handling**: Custom `ApiClientError` with status codes and validation errors
- **Token cleanup**: Automatically removes invalid tokens on 401 responses
- **Type-safe**: Full TypeScript support with generic response types

### 3. Service Layer (`services/auth.service.ts`)

Encapsulates business logic for API interactions:

```typescript
import { authService } from '@/services/auth.service';

// Login
const { user, token } = await authService.login({ username, password });

// Register
const { user, token } = await authService.register(userData);

// Get current user
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

### 4. React Query Setup (`lib/queryClient.ts`)

Configured with optimal defaults:

- **Stale time**: 5 minutes
- **Cache time**: 10 minutes
- **Retry logic**: Smart retry that doesn't retry 401 errors
- **No refetch on window focus**: Prevents unnecessary API calls

### 5. Authentication Hook (`hooks/use-auth.tsx`)

React hook for authentication state management:

```typescript
const { user, isLoading, loginMutation, registerMutation, logoutMutation } = useAuth();

// Login
loginMutation.mutate({ username, password });

// Register
registerMutation.mutate({ username, email, password, phone, role });

// Logout
logoutMutation.mutate();
```

## Usage Examples

### Making Authenticated Requests

```typescript
import { api } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';

// Fetch user orders
const response = await api.get<Order[]>(API_ENDPOINTS.orders.list);
const orders = response.data;

// Create a new order
const response = await api.post<Order>(
  API_ENDPOINTS.orders.create,
  { items, deliveryAddress }
);
```

### Using React Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';

function OrdersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await api.get<Order[]>(API_ENDPOINTS.orders.list);
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render orders */}</div>;
}
```

### Creating New Services

Create service files in `client/src/services/`:

```typescript
// services/orders.service.ts
import { api } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/config';

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
}

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<Order[]>(API_ENDPOINTS.orders.list);
    return response.data!;
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get<Order>(API_ENDPOINTS.orders.details(id));
    return response.data!;
  },

  async createOrder(data: CreateOrderDto): Promise<Order> {
    const response = await api.post<Order>(API_ENDPOINTS.orders.create, data);
    return response.data!;
  },
};
```

## Error Handling

### ApiClientError

All API errors are wrapped in `ApiClientError`:

```typescript
import { ApiClientError } from '@/lib/api-client';

try {
  await api.post('/api/v1/orders', orderData);
} catch (error) {
  if (error instanceof ApiClientError) {
    // Access error details
    error.message;      // Human-readable error message
    error.statusCode;   // HTTP status code
    error.errors;       // Validation errors (if any)
  }
}
```

### Automatic 401 Handling

The API client automatically:
1. Removes invalid tokens on 401 responses
2. Returns `null` for user queries (doesn't throw)
3. Redirects to login via `ProtectedRoute`

## Token Management

Tokens are automatically managed by the API client and auth service:

```typescript
import { getAuthToken, setAuthToken, removeAuthToken } from '@/lib/api-client';

// Get current token
const token = getAuthToken();

// Manually set token (rarely needed)
setAuthToken('your-token-here');

// Remove token
removeAuthToken();
```

## Best Practices

1. **Always use service layer**: Don't call `api` directly from components
2. **Type your responses**: Use TypeScript generics for type safety
3. **Use React Query**: For data fetching and caching
4. **Handle errors gracefully**: Show user-friendly error messages
5. **Add new endpoints to config**: Keep `API_ENDPOINTS` up to date
6. **Don't commit `.env`**: Keep secrets out of version control

## API Response Format

The API follows this response structure:

```typescript
{
  "success": true,
  "data": { /* your data */ },
  "message": "Operation successful",
  "status_code": 200,
  "timestamp": "2025-10-28T11:36:23.003786+00:00",
  "request_id": "1b9c5d89-e818-4d2b-bb15-ab759509cf17"
}
```

## Changing the API URL

To change the API base URL:

1. Update `.env`:
```env
VITE_API_BASE_URL=https://your-new-api.com
```

2. Restart the development server:
```bash
npm run dev
```

## Troubleshooting

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Restart the dev server after changing `.env`
- Check `import.meta.env.VITE_API_BASE_URL` in console

### 401 Unauthorized Errors

- Check if token is valid
- Verify API endpoint requires authentication
- Check token format (should be `Bearer <token>`)

### CORS Issues

- Verify API server has CORS configured
- Check `credentials: 'include'` is set if using cookies
- Ensure API URL is correct

## Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Eatsy API Documentation](https://api.plattr.org/)

