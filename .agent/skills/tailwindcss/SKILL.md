---
name: tailwindcss
description: Advanced Tailwind CSS patterns including utility-first methodology, responsive design, dark mode, custom configuration, and performance optimization. Use when styling with Tailwind or configuring the design system.
---

# Tailwind CSS Skill

Expert guidance for building maintainable, performant interfaces with Tailwind CSS.

## Core Methodology

### Utility-First Approach

Build directly in markup with single-purpose classes:

```jsx
// Instead of writing custom CSS
<button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 transition-colors">
  Save Changes
</button>
```

**Benefits:**
- No context switching to CSS files
- Dead code elimination is automatic
- Consistent design tokens
- Rapid prototyping

---

## Responsive Design

Mobile-first with breakpoint prefixes:

```jsx
<div className="
  grid grid-cols-1      /* Mobile: single column */
  md:grid-cols-2        /* Tablet: 2 columns */
  lg:grid-cols-3        /* Desktop: 3 columns */
  xl:grid-cols-4        /* Large: 4 columns */
  gap-4 md:gap-6 lg:gap-8
">
```

**Breakpoints:**
| Prefix | Min Width | Target |
|--------|-----------|--------|
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

---

## Dark Mode

Use the `dark:` variant:

```jsx
<div className="bg-white dark:bg-gray-900 
                text-gray-900 dark:text-gray-100
                border-gray-200 dark:border-gray-700">
```

**Configuration (tailwind.config.js):**
```js
module.exports = {
  darkMode: 'class', // or 'media' for system preference
}
```

---

## State Variants

```jsx
<button className="
  bg-blue-600
  hover:bg-blue-700      /* Hover state */
  focus:ring-2           /* Focus state */
  active:bg-blue-800     /* Active/pressed */
  disabled:opacity-50    /* Disabled state */
  disabled:cursor-not-allowed
">
```

**Common variants:**
- `hover:` - Mouse over
- `focus:` - Keyboard focus
- `focus-visible:` - Keyboard focus only (not click)
- `active:` - Being pressed
- `disabled:` - Disabled state
- `group-hover:` - When parent has hover
- `peer-focus:` - When sibling has focus

---

## Layout Utilities

### Flexbox
```jsx
<div className="flex items-center justify-between gap-4">
  <div className="flex-shrink-0">Logo</div>
  <div className="flex-1">Content</div>
  <div className="flex-shrink-0">Actions</div>
</div>
```

### Grid
```jsx
<div className="grid grid-cols-12 gap-4">
  <aside className="col-span-3">Sidebar</aside>
  <main className="col-span-9">Content</main>
</div>
```

### Common Patterns
```jsx
/* Center everything */
<div className="flex items-center justify-center min-h-screen">

/* Sticky header */
<header className="sticky top-0 z-50 bg-white/80 backdrop-blur">

/* Full bleed with max-width content */
<section className="w-full bg-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

---

## Spacing Scale

Tailwind uses a consistent 4px base unit:

| Class | Value |
|-------|-------|
| `p-1` | 4px |
| `p-2` | 8px |
| `p-3` | 12px |
| `p-4` | 16px |
| `p-6` | 24px |
| `p-8` | 32px |
| `p-12` | 48px |
| `p-16` | 64px |

**Usage:**
```jsx
<div className="p-4 m-2 space-y-4 gap-6">
```

---

## Typography

```jsx
<h1 className="text-4xl font-bold tracking-tight text-gray-900">
<p className="text-base text-gray-600 leading-relaxed">
<span className="text-sm text-gray-500 uppercase tracking-wide">
```

**Font sizes:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`...`text-9xl`

**Font weights:** `font-thin`, `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`

---

## Custom Configuration

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

---

## Performance Best Practices

### 1. Content Configuration
Ensure unused CSS is purged:
```js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
}
```

### 2. Avoid Arbitrary Values
```jsx
// ❌ Arbitrary (can't be purged consistently)
<div className="top-[117px] w-[calc(100%-20px)]">

// ✅ Use theme values
<div className="top-28 w-full px-5">
```

### 3. Extract Components, Not Classes

```jsx
// ❌ Don't use @apply for everything
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded;
}

// ✅ Create React components
function PrimaryButton({ children, ...props }) {
  return (
    <button 
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  )
}
```

---

## Common Class Combinations

```jsx
// Card
"bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"

// Input field
"w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

// Badge/Pill
"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"

// Section container
"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"

// Gradient background
"bg-gradient-to-r from-blue-600 to-purple-600"

// Glass effect
"bg-white/80 backdrop-blur-md border border-white/20"
```

---

## Class Ordering Convention

For consistency, order classes:

1. Layout (display, position)
2. Box model (width, padding, margin)
3. Typography (font, text)
4. Visual (colors, borders, shadows)
5. Misc (transitions, transforms)

```jsx
className="
  flex items-center justify-between          /* Layout */
  w-full max-w-md p-4 m-2                    /* Box Model */
  text-sm font-medium                         /* Typography */
  bg-white border border-gray-200 rounded-lg  /* Visual */
  transition-colors hover:bg-gray-50          /* Misc */
"
```
