# Eatsy Web Frontend

A modern, production-ready frontend application for Eatsy - connecting food lovers with talented home cooks.

## Quick Start

1. **Install dependencies**

```bash
npm install
# or
yarn install
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

3. **Start development server**

```bash
npm run dev
# or
yarn start
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` / `yarn start` - Start Vite dev server
- `npm run build` / `yarn build` - Production build
- `npm run preview` / `yarn preview` - Preview production build
- `npm run check` / `yarn check` - Type check without emitting files

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.plattr.org
```

See `.env.example` for all available environment variables.

## API Integration

The application is integrated with the Eatsy API at `https://api.plattr.org`.

### Key Features:

- ✅ Environment-based configuration
- ✅ Centralized API client with automatic token management
- ✅ Type-safe service layer
- ✅ React Query for data fetching and caching
- ✅ Comprehensive error handling
- ✅ Automatic 401 handling and token cleanup

For detailed API integration documentation, see [API_INTEGRATION.md](./API_INTEGRATION.md)

## Project Structure

```
client/src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── lib/             # Core utilities and configuration
├── services/        # API service layer
├── stores/          # State management (Zustand)
├── styles/          # Global styles
└── routes.ts        # Route configuration
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: Zustand + React Query
- **UI Components**: Radix UI + Tailwind CSS
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Fetch API with custom wrapper
- **Build Tool**: Vite

## Key Features

- 🔐 Authentication & Authorization
- 🍽️ Browse and order from home cooks
- 🛒 Shopping cart management
- 📦 Order tracking
- 👨‍🍳 Cook profiles and dish listings
- 🔔 Real-time notifications
- 📱 Fully responsive design
- 🎨 Modern, accessible UI

## Development Guidelines

### Adding New API Endpoints

1. Add endpoint to `client/src/lib/config.ts`:

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  newFeature: {
    list: "/api/v1/new-feature",
    details: (id: string) => `/api/v1/new-feature/${id}`,
  },
};
```

2. Create service in `client/src/services/`:

```typescript
import { api } from "@/lib/api-client";
import { API_ENDPOINTS } from "@/lib/config";

export const newFeatureService = {
  async getAll() {
    const response = await api.get(API_ENDPOINTS.newFeature.list);
    return response.data;
  },
};
```

3. Use in components with React Query:

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["newFeature"],
  queryFn: () => newFeatureService.getAll(),
});
```

### Code Style

- Follow industry-standard TypeScript practices
- Use functional components with hooks
- Prefer composition over prop drilling
- Keep components focused and reusable
- Write self-documenting code with clear names

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT
