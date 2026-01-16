---
name: markify-project
description: Project-specific knowledge for Markify bookmark manager including architecture, key files, deployment setup, and common patterns. Use when working on any Markify-related tasks.
---

# Markify Project Skill

This skill contains project-specific knowledge for the Markify bookmark manager application.

## Project Overview

**Markify** is a modern bookmark manager built with React, featuring:
- Smart bookmark organization with collections
- Lightning-fast search capabilities
- Chrome extension for one-click saves
- AI-powered features

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: CSS (with dark mode support)
- **UI Components**: shadcn/ui components in `src/components/ui/`
- **Backend**: Node.js (in `Markify-Backend/`)
- **Deployment**: Vercel
- **Database**: Prisma ORM (see `prisma/`)

## Key Directories

```
Markify/
├── src/
│   ├── components/     # React components
│   │   ├── ui/         # Base UI components (shadcn)
│   │   └── dashboard/  # Dashboard-specific components
│   ├── data/           # Static data (siteLinks.js, etc.)
│   ├── hooks/          # Custom React hooks
│   ├── context/        # React contexts (auth, theme)
│   └── lib/            # Utility functions
├── public/             # Static assets
├── Markify-Backend/    # Backend API
├── markify-extension/  # Chrome extension
├── vercel.json         # Vercel deployment config
└── vite.config.js      # Vite build config
```

## Important Files

### Navigation & Routing
- **`src/data/siteLinks.js`**: All navigation links (NAV_LINKS, PRODUCT_LINKS, etc.)
- **`src/components/Navbar.jsx`**: Main navigation bar component
- **`src/App.jsx`**: Main router configuration

### Configuration
- **`vercel.json`**: Vercel rewrites, redirects, headers
- **`vite.config.js`**: Build optimization, chunks, aliases

### Styling
- **`src/index.css`**: Global styles and CSS variables
- Theme toggle in `src/hooks/useThemeToggle.js`

## Common Patterns

### Adding a New Page
1. Create component in `src/components/`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/data/siteLinks.js`
4. Ensure SEO meta tags are set

### Component Structure
All UI components use `forwardRef` and accept a `className` prop:
```jsx
import { cn } from '@/lib/utils';

const Component = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('base-class', className)} {...props} />
));
```

### Dark Mode
Use CSS variables defined in `:root` and `.dark`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

## Deployment Notes

### Vercel Configuration
- SPA fallback configured in `vercel.json`
- Static files excluded from rewrites: assets, images, favicon, sitemaps
- All page routes handled by React Router

### Environment Variables
- `VITE_*` prefix for client-side variables
- Sensitive keys stored in Vercel environment settings

## Known Issues & Solutions

### Navbar Links 404 on Production
**Issue**: Direct URL access to `/features`, `/pricing`, etc. returns 404
**Solution**: Update `vercel.json` rewrite to only exclude static files, not page routes
