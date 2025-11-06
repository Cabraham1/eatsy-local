# API Service Architecture

## 📋 Pattern Overview

All service files follow a consistent, clean pattern:

### Structure
```typescript
// 1. Types
export interface UpdateRequest { ... }

// 2. API Functions (pure, no side effects)
const apiFunction = (payload) => 
  api.method(endpoint, payload).then(res => res.data);

// 3. Service Export (for use in contexts/other services)
export const service = {
  apiFunction,
  ...
};

// 4. Hooks (export state for components)
export const useApiFunction = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ['service', 'action'],
    mutationFn: apiFunction,
  });

  return {
    isLoading: isPending,
    error,
    apiFunction: mutate,
    apiFunctionAsync: mutateAsync,
  };
};
```

---

## 🎯 Service Files

### 1. `auth.service.ts`
**Purpose**: Authentication operations

**API Functions**:
- `login(credentials)` - User login with JWT tokens
- `register(credentials)` - User registration
- `verifyLoginOtp(data)` - Verify login OTP
- `verifyRegistrationOtp(data)` - Verify registration OTP
- `resendOtp(data)` - Resend OTP code
- `logout()` - User logout
- `getCurrentUser()` - Fetch current user
- `resetPassword(data)` - Request password reset
- `resetPasswordConfirm(data)` - Confirm password reset with OTP

**Hooks**:
- `useLogin()` → `{ isLoading, error, login, loginAsync }`
- `useRegister()` → `{ isLoading, error, register, registerAsync }`
- `useVerifyLoginOtp()` → `{ isLoading, error, verifyOtp, verifyOtpAsync }`
- `useVerifyRegistrationOtp()` → `{ isLoading, error, verifyOtp, verifyOtpAsync }`
- `useResendOtp()` → `{ isLoading, error, resendOtp, resendOtpAsync }`
- `useLogout()` → `{ isLoading, error, logout, logoutAsync }`
- `useResetPassword()` → `{ isLoading, error, resetPassword, resetPasswordAsync }`
- `useResetPasswordConfirm()` → `{ isLoading, error, confirmReset, confirmResetAsync }`

**Usage Example**:
```typescript
import { useLogin } from "@/services/auth.service";

const { isLoading, login } = useLogin();

login(credentials, {
  onSuccess: (data) => {
    // Handle success
    toast({ title: "Login successful" });
  },
  onError: (error) => {
    // Handle error
    toast({ title: "Login failed", description: error.message });
  }
});
```

---

### 2. `user.service.ts`
**Purpose**: User profile and account operations

**API Functions**:
- `updateProfile(payload)` - Update user profile
- `changePassword(payload)` - Change password
- `deleteAccount()` - Delete user account

**Hooks**:
- `useUpdateProfile()` → `{ isLoading, error, updateProfile, updateProfileAsync }`
- `useChangePassword()` → `{ isLoading, error, changePassword, changePasswordAsync }`
- `useDeleteAccount()` → `{ isLoading, error, deleteAccount, deleteAccountAsync }`

**Usage Example**:
```typescript
import { useUpdateProfile } from "@/services/user.service";

const { isLoading, updateProfile } = useUpdateProfile();

updateProfile(data, {
  onSuccess: () => {
    queryClient.refetchQueries({ queryKey: ["auth", "me"] });
    toast({ variant: "success", title: "Profile updated" });
  },
  onError: (error) => {
    toast({ variant: "destructive", title: "Update failed" });
  }
});
```

---

## ✅ Benefits

### 1. **Clean Separation of Concerns**
- API logic in service
- UI logic in components
- No coupling

### 2. **Reusable**
- Use hooks anywhere
- Different toast messages per use case
- No hardcoded side effects

### 3. **Testable**
- Pure functions easy to test
- Mock hooks in tests
- No toast dependencies

### 4. **Type-Safe**
- Full TypeScript support
- Inferred types from mutations
- Type-safe payloads

### 5. **Consistent**
- Same pattern everywhere
- Easy to learn
- Easy to maintain

---

## 📝 Component Usage Pattern

### With Toast & Side Effects
```typescript
import { useUpdateProfile } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/constants/queryClient";

const { toast } = useToast();
const { isLoading, updateProfile } = useUpdateProfile();

updateProfile(
  payload,
  {
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["auth", "me"] });
      setIsEditing(false);
      toast({
        variant: "success",
        title: "Success",
        description: "Operation completed",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  }
);
```

### With Async/Await
```typescript
const { isLoading, loginAsync } = useLogin();

try {
  const result = await loginAsync(credentials);
  // Handle success
  toast({ title: "Login successful" });
  navigate("/dashboard");
} catch (error) {
  // Handle error
  toast({ title: "Login failed" });
}
```

---

## 🔧 Adding New Services

### Step 1: Create Service File
```typescript
// services/example.service.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/constants/api-client";
import { API_ENDPOINTS } from "@/lib/constants/config";

// Types
export interface ExampleRequest {
  data: string;
}

// API Function
const exampleAction = (payload: ExampleRequest) =>
  api.post(API_ENDPOINTS.example, payload).then((res) => res.data);

// Service Export
export const exampleService = {
  exampleAction,
};

// Hook
export const useExampleAction = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["example", "action"],
    mutationFn: exampleAction,
  });

  return {
    isLoading: isPending,
    error,
    exampleAction: mutate,
    exampleActionAsync: mutateAsync,
  };
};
```

### Step 2: Use in Component
```typescript
import { useExampleAction } from "@/services/example.service";

const { isLoading, exampleAction } = useExampleAction();

exampleAction(data, {
  onSuccess: () => toast({ title: "Success!" }),
  onError: (error) => toast({ title: "Error", description: error.message }),
});
```

---

## 🚨 Important Rules

1. ✅ **DO** keep services clean (no toast, no navigation)
2. ✅ **DO** handle toast/navigation in components
3. ✅ **DO** return loading states and errors
4. ✅ **DO** use mutation keys for caching
5. ❌ **DON'T** couple services to UI
6. ❌ **DON'T** hardcode success/error messages
7. ❌ **DON'T** include side effects in services

---

## 📚 Related Files

- `/client/src/services/` - All service files
- `/client/src/lib/constants/api-client.ts` - Axios instance
- `/client/src/lib/constants/config.ts` - API endpoints
- `/client/src/lib/constants/cache.ts` - Cache configuration
- `/client/src/hooks/use-auth.tsx` - Auth context provider

