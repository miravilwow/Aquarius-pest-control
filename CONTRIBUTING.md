# Contributing Guide

Thank you for your interest in contributing to Aquarius Pest Control!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit your changes: `git commit -m "Add: your feature description"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Code Style

### JavaScript/React

- Use functional components with hooks
- Use `const` and `let` (never `var`)
- Use arrow functions for callbacks
- Use template literals for strings
- Use meaningful variable and function names

### File Naming

- Components: `PascalCase.jsx` (e.g., `AdminDashboard.jsx`)
- Utilities: `camelCase.js` (e.g., `activityLog.js`)
- CSS: `kebab-case.css` (e.g., `AdminDashboard.css`)

### Import Order

1. React imports
2. Third-party libraries
3. Internal components (`@/components/...`)
4. Utilities (`@/utils/...`)
5. Styles (`./Component.css`)
6. Types (if using TypeScript)

### Example

```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { logActivity } from '@/utils/activityLog'
import './Component.css'
```

## Component Guidelines

### Functional Components

Always use functional components:

```jsx
// ✅ Good
function MyComponent({ prop1, prop2 }) {
  return <div>...</div>
}

// ❌ Bad
class MyComponent extends React.Component {
  // ...
}
```

### Hooks

- Use hooks at the top of components
- Use `useMemo` for expensive calculations
- Use `useCallback` for functions passed to children
- Use `React.memo` for expensive components

### Accessibility

- Always add `aria-label` for icon-only buttons
- Use semantic HTML (`<button>`, `<nav>`, etc.)
- Add `role` attributes where appropriate
- Ensure keyboard navigation works

### Performance

- Lazy load routes
- Debounce search inputs
- Memoize expensive calculations
- Avoid unnecessary re-renders

## Commit Messages

Use clear, descriptive commit messages:

```
Add: Search debouncing for bookings table
Fix: Calendar date format display
Update: Improve mobile responsive design
Refactor: Extract booking status logic to utility
```

## Pull Request Process

1. Ensure your code follows the style guide
2. Test your changes thoroughly
3. Update documentation if needed
4. Write a clear PR description
5. Reference any related issues

## Testing

Before submitting:
- Test on different browsers (Chrome, Firefox, Edge)
- Test on mobile devices
- Verify accessibility (keyboard navigation, screen readers)
- Check for console errors

## Questions?

Open an issue or contact the maintainers.

Thank you for contributing! 🎉
