---
name: framer-motion
description: Creating performant, beautiful animations in React with Framer Motion. Covers motion components, variants, gestures, AnimatePresence, layout animations, and performance optimization. Use when adding animations or transitions.
---

# Framer Motion Skill

Expert guidance for creating fluid, performant animations in React applications.

## Core Concepts

### The `motion` Component

Wrap any HTML/SVG element to make it animatable:

```jsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### Key Props

| Prop | Purpose |
|------|---------|
| `initial` | Starting state |
| `animate` | Target state |
| `exit` | State when removed (requires AnimatePresence) |
| `transition` | Animation timing and physics |
| `whileHover` | State while hovered |
| `whileTap` | State while pressed |
| `whileFocus` | State while focused |

---

## Animation Patterns

### Fade In/Out
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
/>
```

### Slide Up
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>
```

### Scale on Hover
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
/>
```

### Stagger Children
```jsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.li key={i} variants={item}>
      {i}
    </motion.li>
  ))}
</motion.ul>
```

---

## Variants

Define reusable animation states:

```jsx
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
  }
}

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
/>
```

---

## AnimatePresence

Enable exit animations when components unmount:

```jsx
import { AnimatePresence, motion } from "framer-motion"

function Modal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="modal-content"
          >
            Modal content
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

**Important:** Always use a `key` prop when animating lists:
```jsx
<AnimatePresence mode="wait">
  <motion.div key={currentPage}>
    {content}
  </motion.div>
</AnimatePresence>
```

---

## Layout Animations

Animate layout changes smoothly:

```jsx
// Simple layout animation
<motion.div layout>
  {isExpanded ? "Full content" : "Summary"}
</motion.div>

// Shared element transition
<motion.div layoutId="shared-element">
  {/* Will animate smoothly between positions */}
</motion.div>
```

### Shared Layout Example
```jsx
function TabList({ selectedId, setSelectedId }) {
  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => setSelectedId(tab.id)}>
          {tab.label}
          {selectedId === tab.id && (
            <motion.div 
              layoutId="underline" 
              className="underline"
            />
          )}
        </button>
      ))}
    </div>
  )
}
```

---

## Gestures

### Drag
```jsx
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 200 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.1 }}
/>
```

### Scroll-Linked Animations
```jsx
import { useScroll, useTransform, motion } from "framer-motion"

function ParallaxHero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <motion.div style={{ y, opacity }}>
      Hero Content
    </motion.div>
  )
}
```

### In View
```jsx
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

function Section() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      Animate when scrolled into view
    </motion.div>
  )
}
```

---

## Performance Best Practices

### ✅ DO: Animate Transform Properties
These are GPU-accelerated:
- `x`, `y` (translate)
- `scale`, `scaleX`, `scaleY`
- `rotate`, `rotateX`, `rotateY`
- `opacity`

### ❌ AVOID: Animating Layout Properties
These trigger layout recalculation:
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `padding`, `margin`

**Instead, use the `layout` prop:**
```jsx
// ❌ Bad
<motion.div animate={{ height: isOpen ? 200 : 0 }} />

// ✅ Good
<motion.div layout>
  {isOpen && <Content />}
</motion.div>
```

### Other Performance Tips

```jsx
// Skip initial animation on mount
<motion.div initial={false} animate={{ x: 100 }} />

// Use LazyMotion for code splitting
import { LazyMotion, domAnimation, m } from "framer-motion"

<LazyMotion features={domAnimation}>
  <m.div animate={{ opacity: 1 }} />
</LazyMotion>

// Reduce motion for accessibility
import { useReducedMotion } from "framer-motion"

const prefersReducedMotion = useReducedMotion()
const animation = prefersReducedMotion 
  ? { opacity: 1 } 
  : { opacity: 1, y: 0 }
```

---

## Transition Types

### Spring (Recommended for UI)
```jsx
transition={{ 
  type: "spring", 
  stiffness: 300, 
  damping: 30 
}}
```

### Tween (Precise Duration)
```jsx
transition={{ 
  type: "tween", 
  duration: 0.3, 
  ease: "easeInOut" 
}}
```

### Easing Options
- `"linear"` - Constant speed
- `"easeIn"` - Start slow
- `"easeOut"` - End slow (most natural for UI)
- `"easeInOut"` - Both ends slow
- `"circOut"` - Sharp deceleration
- `[0.16, 1, 0.3, 1]` - Custom cubic bezier

---

## Common Animation Recipes

### Page Transition
```jsx
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
}

<motion.div
  initial="initial"
  animate="in"
  exit="out"
  variants={pageVariants}
  transition={pageTransition}
/>
```

### Notification Toast
```jsx
<motion.div
  initial={{ opacity: 0, y: 50, scale: 0.3 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 20, scale: 0.5 }}
  transition={{ type: "spring", stiffness: 500, damping: 40 }}
/>
```

### Button Press Effect
```jsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
/>
```
