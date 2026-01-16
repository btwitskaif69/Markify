---
name: code-reviewer
description: Reviews code for bugs, security vulnerabilities, performance issues, and best practices. Use when reviewing PRs, checking code quality, or optimizing existing code.
---

# Code Reviewer Skill

This skill provides expert code review capabilities for JavaScript/React codebases.

## Review Checklist

### 1. Correctness
- [ ] Does the code do what it's supposed to?
- [ ] Are edge cases handled?
- [ ] Are error conditions caught and handled gracefully?
- [ ] Is the logic sound and complete?

### 2. Security
- [ ] No hardcoded secrets or API keys
- [ ] User input is sanitized
- [ ] No SQL/NoSQL injection vulnerabilities
- [ ] XSS prevention (proper escaping)
- [ ] CSRF protection in place
- [ ] Secure dependencies (no known vulnerabilities)

### 3. Performance
- [ ] No unnecessary re-renders (React)
- [ ] Expensive operations memoized
- [ ] No N+1 query patterns
- [ ] Lazy loading implemented where beneficial
- [ ] Bundle size considered

### 4. Maintainability
- [ ] Code is readable and self-documenting
- [ ] Functions are focused (single responsibility)
- [ ] No magic numbers; use named constants
- [ ] DRY principle followed (no redundant code)
- [ ] Consistent naming conventions

### 5. React-Specific Checks
- [ ] Dependencies in useEffect are complete
- [ ] No state mutations
- [ ] Keys are stable and unique in lists
- [ ] Event handlers don't cause memory leaks
- [ ] Cleanup functions in useEffect where needed

## Common Anti-Patterns

### React Anti-Patterns
```jsx
// BAD: Inline function in JSX (creates new reference every render)
<button onClick={() => handleClick(id)}>Click</button>

// GOOD: Memoized callback
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<button onClick={handleButtonClick}>Click</button>

// BAD: Object in dependency array
useEffect(() => { ... }, [{ user }]);

// GOOD: Primitive values in dependency array
useEffect(() => { ... }, [user.id]);
```

### JavaScript Anti-Patterns
```javascript
// BAD: == comparison
if (value == null) { }

// GOOD: === comparison
if (value === null || value === undefined) { }

// BAD: Mutating state
state.items.push(newItem);

// GOOD: Immutable update
const newItems = [...state.items, newItem];
```

## How to Provide Feedback

1. **Be specific**: Point to exact line numbers and code
2. **Explain why**: Don't just say "change this", explain the reason
3. **Suggest alternatives**: Provide a better approach when possible
4. **Prioritize issues**: Label as critical, major, or minor
5. **Acknowledge good code**: Positive feedback encourages best practices

## Severity Levels

- **🔴 Critical**: Security vulnerability, data loss, crash
- **🟠 Major**: Bug, performance issue, accessibility problem
- **🟡 Minor**: Code style, minor optimization, naming convention
- **🔵 Suggestion**: Alternative approach, nice-to-have improvement
