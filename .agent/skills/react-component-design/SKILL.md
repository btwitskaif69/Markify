---
name: react-component-design
description: Expert guidance for building modern, accessible React components with premium aesthetics. Use when creating UI components, implementing design systems, or improving user experience.
---

# React Component Design Skill

This skill provides expert guidance for creating high-quality React components with modern aesthetics.

## Design Principles

### Visual Excellence
1. **Color Palettes**: Use curated, harmonious colors (HSL-based systems, not plain CSS colors)
2. **Typography**: Modern fonts like Inter, Outfit, or system font stacks
3. **Micro-animations**: Subtle transitions that bring interfaces to life
4. **Glassmorphism**: Backdrop blur, transparency, and depth effects
5. **Dark Mode**: Always consider both light and dark themes

### Component Architecture

**File Structure:**
```
src/
├── components/
│   ├── ui/          # Primitive UI components (Button, Input, Card)
│   ├── features/    # Feature-specific components
│   └── layouts/     # Layout components (Header, Footer, Sidebar)
```

**Component Template:**
```jsx
import React from 'react';
import { cn } from '@/lib/utils';

export const Component = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('base-styles', className)}
      {...props}
    />
  );
});
Component.displayName = 'Component';
```

### Accessibility Checklist
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] ARIA labels where needed
- [ ] Semantic HTML elements used

### Animation Patterns

**Hover Effects:**
```css
.interactive-element {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

**Entrance Animations (Framer Motion):**
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>
```

### Performance Optimization
1. Use `React.memo()` for pure components
2. Implement `useMemo` and `useCallback` strategically
3. Lazy load heavy components with `React.lazy()`
4. Avoid inline function definitions in JSX
5. Use CSS containment for isolated components
