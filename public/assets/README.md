# SVG Assets for Plug App

This directory contains all SVG assets for the Plug app, organized by type.

## Directory Structure

```
public/assets/
├── icons/           # Icon SVGs (logos, badges, etc.)
├── illustrations/   # Illustration SVGs (empty states, etc.)
├── images/          # Logo
└── listings/        # Placeholder listing photos for demo mode
```

## Available Assets

### Icons (`/icons/`)
- `notification-badge.svg` - Red notification badge with exclamation mark
- `loading-spinner.svg` - Animated loading spinner

### Images (`/images/`)
- `logo.svg` - Plug mark (white ring and orange plug body; sits on the navy header)

### Listings (`/listings/`)
- Category placeholder photos used by the demo dataset (`electronics-phone.svg`, `tickets-game.svg`, ...)

### Illustrations (`/illustrations/`)
- `home_no_posts.svg` - Empty state for home page with no posts
- `messages_empty.svg` - Illustration for no messages/conversations
- `notifications_empty.svg` - Empty notifications state
- `search_empty.svg` - Empty search results
- `buying_empty.svg` - Empty buying/purchase history
- `selling_empty.svg` - Empty selling items
- `saved_empty.svg` - Empty saved items
- `live_empty.svg` - Empty live deals
- `success.svg` - Success/checkmark illustration

## How to Use

### Option 1: Direct Usage
```jsx
<img src="/assets/images/logo.svg" alt="Plug Logo" />
<img src="/assets/illustrations/empty-state.svg" alt="Empty state" />
```

### Option 2: Using the SVGIcon Component
```jsx
import { SVGIcon, EmptyStateIcon, LogoIcon } from '../components/SVGIcon';

// Generic usage
<SVGIcon name="logo" className="w-8 h-8" />

// Convenience components
<EmptyStateIcon className="w-24 h-24" />
<SavedEmptyIcon className="w-24 h-24" />
<SellingEmptyIcon className="w-24 h-24" />
<BuyingEmptyIcon className="w-24 h-24" />
<LiveEmptyIcon className="w-24 h-24" />
<LogoIcon className="w-32 h-12" />
```

### Option 3: Inline SVG (for customization)
```jsx
// Copy the SVG content directly into your component for full control
<svg width="120" height="40" viewBox="0 0 120 40" fill="none">
  <!-- SVG content -->
</svg>
```

## Adding New Assets

1. **Icons**: Add to `/icons/` directory
2. **Illustrations**: Add to `/illustrations/` directory
3. **Images**: Add to `/images/` directory
4. **Update the component**: Add the new asset to the `iconMap` in `src/components/SVGIcon.tsx`

## Brand Colors Used

- **Navy**: `#0E1F33`
- **Orange**: `#FF6B35`
- **Yellow**: `#FFD166`
- **Mint**: `#06D6A0`
- **Background**: `#F5F7FA`
- **Border**: `#E6E9EE`
- **Gray**: `#8A8A8A`

## Best Practices

1. **Optimize SVGs**: Use tools like SVGO to minimize file size
2. **Consistent sizing**: Use viewBox for responsive scaling
3. **Accessibility**: Always include alt text for images
4. **Performance**: Use the SVGIcon component for consistent loading
5. **Brand consistency**: Use the defined color palette
