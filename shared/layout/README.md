# Layout Components

This directory contains all layout-related components for the روضة الحسین website.

## Components

### Header (`Header.tsx`)
- **Purpose**: Unified header component with logo, navigation, and actions (مطابق طرح Figma)
- **Features**:
  - Responsive design (desktop + mobile)
  - Logo with site title and subtitle
  - Integrated desktop navigation menu
  - Active state highlighting for navigation items
  - Search, bookmarks, and settings buttons
  - Language toggle
  - Mobile hamburger menu with collapsible navigation
  - Mobile actions in dropdown menu
  - Single unified component (Header + NavBar merged)

### Footer (`Footer.tsx`)
- **Purpose**: Site footer with links and information
- **Features**:
  - Logo and description
  - Quick links navigation
  - Category links
  - Contact information
  - Social media links
  - Copyright and legal links

### MobileNavBar (`MobileNavBar.tsx`)
- **Purpose**: Bottom navigation bar for mobile devices
- **Features**:
  - Fixed bottom positioning
  - Icon-based navigation
  - Active state highlighting
  - Only visible on mobile (md:hidden)

## Usage

### Basic Layout Structure
```tsx
import { Header, Footer, MobileNavBar } from '@/shared/layout';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileNavBar />
    </div>
  );
}
```

### Individual Components
```tsx
import { Header } from '@/shared/layout';

export function CustomLayout() {
  return (
    <div>
      <Header />
      {/* Your content */}
    </div>
  );
}
```

## Design System

### Colors
- **Background**: `bg-gray-900` (header), `bg-gray-800` (navbar, footer)
- **Text**: `text-white` (primary), `text-gray-300` (secondary), `text-gray-400` (muted)
- **Accent**: `text-figma-primary-teal` (active states)
- **Borders**: `border-gray-700`

### Typography
- **Headers**: `font-bold text-lg` (main title), `font-bold text-base` (section titles)
- **Navigation**: `text-sm font-medium`
- **Body**: `text-sm` (regular), `text-xs` (small)

### Spacing
- **Header Height**: `h-16` (64px) - unified header with integrated navigation
- **Mobile NavBar**: Fixed bottom with `py-2`
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Responsive Breakpoints
- **Mobile**: Default (< 768px)
- **Desktop**: `md:` (≥ 768px)

## Features

### Navigation
- **Active State Detection**: Uses `usePathname()` to highlight current page
- **Mobile-First**: Responsive design with mobile hamburger menu
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Mobile Experience
- **Bottom Navigation**: Fixed bottom bar for easy thumb navigation
- **Hamburger Menu**: Collapsible mobile menu in header
- **Touch-Friendly**: Adequate touch targets (44px minimum)

### Performance
- **Client Components**: All components are client-side for interactivity
- **Conditional Rendering**: Mobile/desktop components render conditionally
- **Optimized Icons**: FontAwesome Light icons for consistency

## Customization

### Adding New Navigation Items
```tsx
// In Header.tsx (unified navigation)
const navItems = [
  // ... existing items
  {
    href: '/new-page',
    label: 'صفحه جدید',
    isActive: pathname.startsWith('/new-page'),
  },
];
```

### Styling Modifications
- Follow project standards: **Tailwind CSS only**
- Use existing color classes from `globals.css`
- Maintain RTL support and responsive design

### Adding New Layout Components
1. Create component in `shared/layout/`
2. Add to `index.ts` exports
3. Import in main layout file
4. Update documentation

## Dependencies

- **@heroui/react**: Button components
- **next/link**: Navigation links
- **next/navigation**: `usePathname` hook
- **clsx**: Conditional class names
- **FontAwesome**: Icons (fa-light style)

## Browser Support

- Modern browsers with ES2020+ support
- RTL language support
- Responsive design for all screen sizes
- Touch device optimization

## Accessibility

- Proper ARIA labels for interactive elements
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast colors for readability

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintainer**: Front-Aviny Development Team