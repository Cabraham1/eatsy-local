# Post Creation Feature Documentation

## Overview
This feature allows **cooks only** to create posts to share with their audience. The implementation follows Instagram-like functionality where cooks can upload multiple photos, videos, or write-ups with captions.

## Implementation Details

### Files Created/Modified

1. **`/client/src/lib/constants/config.ts`**
   - Added social post endpoints to `API_ENDPOINTS`

2. **`/client/src/types/post.ts`**
   - Defined post-related interfaces:
     - `ICreatePostRequest`: Request payload for creating posts
     - `IPost`: Post data structure
     - `IPostMedia`: Media attachment structure
     - `MediaFile`: Client-side media file representation

3. **`/client/src/services/post.service.ts`**
   - Created `postService` with `createPost` API function
   - Handles `multipart/form-data` for file uploads
   - Includes `useCreatePost` React Query hook
   - Automatically invalidates posts query on success

4. **`/client/src/components/ui/create-post-button.tsx`**
   - Floating Action Button (FAB) component
   - **Only visible to users with `role === "cook"`**
   - Positioned at bottom-right, above mobile navigation
   - Opens the create post modal on click

5. **`/client/src/components/ui/create-post-modal.tsx`**
   - Comprehensive modal for creating posts
   - Features:
     - Caption text area (2000 character limit)
     - Multiple image upload
     - Multiple video upload
     - Media preview with remove option
     - Optional fields: price, menu_id, availability
     - Location capture (GPS or manual entry)
     - Form validation
     - Loading states

6. **`/client/src/components/layouts/layout.tsx`**
   - Integrated `CreatePostButton` component
   - Button appears globally across the app for cooks

## Features

### Access Control
- ✅ Only visible to users with `role === "cook"`
- ✅ Regular users won't see the create post button
- ✅ Automatically hidden if user is not logged in or not a cook

### Media Upload
- ✅ **Multiple Images**: Upload multiple photos at once
- ✅ **Multiple Videos**: Upload multiple videos at once
- ✅ **File Validation**: 
  - Type checking (image/* or video/*)
  - Size limit: 50MB per file
- ✅ **Preview**: Visual preview of selected media
- ✅ **Remove**: Ability to remove individual media items
- ✅ **Memory Management**: Proper cleanup of object URLs

### Caption & Text
- ✅ Text area for captions
- ✅ Character counter (2000 character limit)
- ✅ Optional - can post with media only

### Optional Fields
- ✅ **Price**: Decimal input for dish pricing
- ✅ **Menu ID**: Link post to existing menu item
- ✅ **Availability Toggle**: Mark if dish is currently available
- ✅ **Location**: 
  - Manual address entry
  - Auto-capture GPS coordinates
  - Display captured coordinates

### User Experience
- ✅ Modern, responsive design
- ✅ Tabbed interface for basic info and location
- ✅ Scrollable content for mobile devices
- ✅ Loading states during submission
- ✅ Toast notifications for success/errors
- ✅ Form reset on successful submission
- ✅ Confirmation before closing with unsaved changes

## API Integration

### Endpoint
```
POST /api/v1/social/post/
```

### Request Format
`multipart/form-data` with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `caption` | string | No | Post caption/description |
| `media` | array<File> | No* | Direct file upload (recommended) |
| `media_ids` | array<integer> | No* | Media IDs from presigned URLs |
| `menu_id` | integer | No | Link to menu item |
| `price` | decimal string | No | Price for ordering |
| `is_available` | boolean | No | Availability status |
| `location_latitude` | decimal string | No | GPS latitude |
| `location_longitude` | decimal string | No | GPS longitude |
| `location_address` | string | No | Human-readable address |

*At least one of `media` or `caption` is required

### Example Usage

```typescript
import { useCreatePost } from '@/services/post.service';

function MyComponent() {
  const { createPostAsync, isLoading } = useCreatePost();
  
  const handleSubmit = async () => {
    await createPostAsync({
      caption: "Delicious homemade pasta!",
      media: [file1, file2], // File objects
      price: "12.99",
      is_available: true,
      location_address: "123 Main St, NYC"
    });
  };
}
```

## UI Components

### CreatePostButton
- **Position**: Fixed bottom-right corner
- **Mobile**: Positioned above mobile navigation (bottom-24)
- **Desktop**: Standard bottom-6 position
- **Style**: Circular FAB with gradient orange background
- **Icon**: Plus circle icon

### CreatePostModal
- **Layout**: Centered dialog with header, scrollable content, and footer
- **Max Height**: 90vh with scrollable content area
- **Tabs**: Basic Info & Location tabs
- **Responsive**: Grid layout for media previews (2 cols mobile, 3 cols desktop)

## Testing Checklist

- [ ] Test as a cook user - button should be visible
- [ ] Test as a regular user - button should be hidden
- [ ] Test uploading single image
- [ ] Test uploading multiple images
- [ ] Test uploading single video
- [ ] Test uploading multiple videos
- [ ] Test file size validation (>50MB)
- [ ] Test file type validation
- [ ] Test caption with 2000+ characters
- [ ] Test optional price field
- [ ] Test location capture
- [ ] Test form submission
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test on mobile devices
- [ ] Test on desktop browsers

## Future Enhancements

- [ ] Add image cropping/editing
- [ ] Add filters for images
- [ ] Video thumbnail generation
- [ ] Drag and drop file upload
- [ ] Reorder media items
- [ ] Save drafts
- [ ] Schedule posts
- [ ] Tag other users
- [ ] Add hashtags
- [ ] Rich text editor for captions
- [ ] Media compression before upload
- [ ] Progress indicator for large uploads

## Notes

1. **Role Checking**: The feature uses `user.role === Role.COOK` from the enum to determine visibility
2. **Authentication**: Uses existing auth context from `useAuth()` hook
3. **API Client**: Uses existing axios-based API client with automatic token management
4. **State Management**: Uses React Query for server state, local state for form
5. **Memory Management**: Properly cleans up object URLs to prevent memory leaks
6. **Form Reset**: All form fields and file previews are reset after successful submission

## Troubleshooting

### Button not showing for cook
- Verify user is logged in
- Check `user.role` value in auth context
- Ensure role is exactly "cook" (case-sensitive)

### Upload fails
- Check file size (<50MB)
- Verify file type (image/* or video/*)
- Check network connection
- Verify API endpoint is correct

### Location not captured
- Ensure browser supports geolocation
- Check browser permissions for location access
- User must grant location permission

## Dependencies

All dependencies are already installed in the project:
- `@tanstack/react-query` - Data fetching and caching
- `axios` - HTTP client
- `lucide-react` - Icons
- Shadcn UI components (Dialog, Button, Input, etc.)

