---
name: ui-ux-design
description: Comprehensive UI/UX design principles including user-centric thinking, accessibility (WCAG), visual hierarchy, and interaction design. Use when designing interfaces, improving user experience, or reviewing UI decisions.
---

# UI/UX Design Skill

Expert guidance for creating user-centric, accessible, and visually compelling interfaces.

## Core Principles

### 1. User-Centricity
- **Know Your User**: Define user personas and their goals
- **User Journey**: Map the complete flow from entry to goal completion
- **Problem-First**: Every design decision should solve a user problem
- **Empathy**: Consider edge cases, frustration points, and cognitive load

### 2. Visual Hierarchy
Guide the user's eye to what matters most:

```
Importance  →  Visual Weight
─────────────────────────────
Primary     →  Largest, boldest, highest contrast
Secondary   →  Medium size, supporting information
Tertiary    →  Smallest, lowest contrast, metadata
```

**Tools for hierarchy:**
- Size and scale
- Color and contrast
- Whitespace and proximity
- Typography weight
- Position (F-pattern, Z-pattern)

### 3. Consistency
- **Visual**: Same colors, fonts, spacing throughout
- **Functional**: Same interactions produce same results
- **Voice**: Consistent tone in copy and microcopy

---

## Visual Design Checklist

### Typography
- [ ] Maximum 2-3 font families
- [ ] Clear type scale (e.g., 12, 14, 16, 20, 24, 32, 48)
- [ ] Line height: 1.4-1.6 for body text
- [ ] Maximum 65-75 characters per line
- [ ] Sufficient contrast (4.5:1 minimum for body text)

### Color
- [ ] Primary brand color defined
- [ ] Secondary/accent colors complement primary
- [ ] Semantic colors for success/warning/error states
- [ ] Dark mode colors are intentional, not just inverted
- [ ] Color alone doesn't convey meaning (accessibility)

### Spacing
- [ ] Consistent spacing scale (4, 8, 12, 16, 24, 32, 48, 64)
- [ ] Related items grouped with less space
- [ ] Unrelated items separated with more space
- [ ] Content has room to breathe

### Layout
- [ ] Grid system is consistent
- [ ] Alignment is intentional
- [ ] Responsive breakpoints considered
- [ ] Touch targets are 44x44px minimum (mobile)

---

## Accessibility (WCAG 2.1 AA)

### Perceivable
- Alt text for all meaningful images
- Video captions and audio descriptions
- Color contrast ratios met
- Content readable when zoomed 200%

### Operable
- All functionality keyboard accessible
- Skip links for navigation
- No keyboard traps
- Sufficient time to read/interact

### Understandable
- Consistent navigation
- Clear error messages with solutions
- Labels and instructions for inputs
- Predictable behavior

### Robust
- Valid HTML
- ARIA labels where needed
- Works with assistive technologies

---

## Interaction Design

### Feedback Patterns
Every action should have immediate feedback:

| Action | Feedback |
|--------|----------|
| Button click | Visual press state + action result |
| Form submit | Loading state → Success/Error |
| Hover | Cursor change + visual highlight |
| Drag | Item follows cursor, drop zones highlight |

### Micro-interactions
Subtle animations that improve UX:
- Button hover states
- Form field focus transitions
- Success checkmarks
- Loading spinners
- Toast notifications

### Error Prevention
- Disable submit until form is valid
- Confirm destructive actions
- Auto-save progress
- Clear constraints (character limits, file size)

---

## Mobile-First Design

### Touch Considerations
- Minimum touch target: 44x44px
- Thumb-friendly placement for primary actions
- Avoid hover-dependent interactions
- Consider one-handed use

### Responsive Patterns
- **Stack**: Side-by-side becomes vertical
- **Collapse**: Navigation becomes hamburger
- **Priority**: Show most important content first
- **Truncate**: Long text with "Read more"

---

## Common UI Patterns

### Call-to-Action (CTA)
- One primary CTA per view
- Clear, action-oriented text ("Get Started", not "Submit")
- High contrast and prominent placement
- Secondary actions visually subordinate

### Forms
- Labels above inputs (not inside)
- Logical grouping with fieldsets
- Inline validation
- Clear error messages near the field
- Progress indicator for multi-step forms

### Navigation
- Current location always visible
- Breadcrumbs for deep hierarchies
- Maximum 7 primary nav items
- Search for large content sites

### Empty States
- Explain why it's empty
- Suggest what to do next
- Friendly illustration (optional)
- Clear CTA to add content

---

## Design Review Questions

Before shipping any UI:

1. **Can a new user complete the task without instructions?**
2. **Is the most important action obvious?**
3. **What happens if something goes wrong?**
4. **Does it work with keyboard only?**
5. **Does it look good on mobile?**
6. **Is the loading state handled?**
7. **Is the empty state helpful?**
