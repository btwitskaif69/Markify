---
name: shadcn-ui
description: Best practices for shadcn/ui components including installation, customization, theming, composition patterns, and accessibility. Use when adding or customizing shadcn components.
---

# Shadcn UI Skill

Expert guidance for using and customizing shadcn/ui components in React projects.

## Core Philosophy

shadcn/ui is **NOT** a component library—it's a collection of reusable components you copy into your project.

**Key Principles:**
- **Ownership over abstraction**: You own the code, customize freely
- **Built on Radix UI**: Accessible primitives with no styling
- **Styled with Tailwind CSS**: Utility-first customization
- **Copy/paste model**: Components live in your codebase

---

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn primitives (DON'T MODIFY DIRECTLY)
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   └── ...
│   └── shared/       # Your composed components
│       ├── ConfirmDialog.jsx    # Uses ui/dialog
│       ├── PrimaryButton.jsx    # Uses ui/button
│       └── ...
└── lib/
    └── utils.js      # Contains cn() utility
```

---

## The `cn()` Utility

Always use `cn()` for conditional class merging:

```jsx
import { cn } from "@/lib/utils"

// Usage
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className  // Allow overrides
)} />
```

**Implementation:**
```js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
```

---

## Theming with CSS Variables

shadcn uses semantic CSS variables for consistent theming:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark variants */
}
```

**Usage in Tailwind:**
```jsx
<div className="bg-background text-foreground border-border" />
<button className="bg-primary text-primary-foreground" />
```

---

## Best Practices

### ✅ DO: Compose New Components

```jsx
// components/shared/ConfirmDialog.jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ConfirmDialog({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  description 
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### ❌ DON'T: Modify `components/ui/` Directly

Modifying base primitives:
- Breaks updates when regenerating with CLI
- Makes maintenance difficult
- Creates inconsistency across the app

---

## Common Components & Patterns

### Button Variants
```jsx
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>
```

### Form with Validation
```jsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  email: z.string().email(),
})

function MyForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

### Card Layout
```jsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## CLI Commands

```bash
# Initialize shadcn in a new project
npx shadcn-ui@latest init

# Add a component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card dialog form

# Add multiple components
npx shadcn-ui@latest add button card dialog

# List available components
npx shadcn-ui@latest add
```

---

## Accessibility

shadcn components inherit Radix UI's accessibility:

- ✅ Keyboard navigation
- ✅ Focus management
- ✅ ARIA attributes
- ✅ Screen reader support

**Always verify:**
- Tab order is logical
- Focus is visible
- Actions are keyboard-accessible
- Color contrast meets WCAG standards
