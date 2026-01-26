# Component Usage Guide

## Shadcn UI Components

This project uses [Shadcn/ui](https://ui.shadcn.com) components built on Radix UI primitives and styled with Tailwind CSS.

---

## Button

**Location**: `src/components/ui/button.jsx`

**Usage:**
```jsx
import { Button } from '@/components/ui/button'

// Basic button
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon className="h-4 w-4" />
</Button>

// With Link (asChild)
import { Link } from 'react-router-dom'
<Button asChild>
  <Link to="/admin">Go to Admin</Link>
</Button>
```

**Variants:**
- `default` - Primary action
- `destructive` - Delete/danger actions
- `outline` - Secondary actions
- `ghost` - Subtle actions
- `link` - Text link style

---

## Card

**Location**: `src/components/ui/card.jsx`

**Usage:**
```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## Input

**Location**: `src/components/ui/input.jsx`

**Usage:**
```jsx
import { Input } from '@/components/ui/input'

<Input 
  type="text" 
  placeholder="Enter text..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**With Field Label:**
```jsx
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

<Field>
  <FieldLabel htmlFor="username">Username</FieldLabel>
  <Input id="username" type="text" />
</Field>
```

---

## Table

**Location**: `src/components/ui/table.jsx`

**Usage:**
```jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## Dialog / AlertDialog

**Location**: `src/components/ui/dialog.jsx` and `src/components/ui/alert-dialog.jsx`

**Dialog Usage:**
```jsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog description</DialogDescription>
    </DialogHeader>
    <p>Dialog content</p>
  </DialogContent>
</Dialog>
```

**AlertDialog Usage (for confirmations):**
```jsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirm}>
        Confirm
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Select

**Location**: `src/components/ui/select.jsx`

**Usage:**
```jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

## Popover

**Location**: `src/components/ui/popover.jsx`

**Usage:**
```jsx
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

<Popover>
  <PopoverTrigger asChild>
    <Button>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>
```

---

## Calendar

**Location**: `src/components/ui/calendar.jsx`

**Usage:**
```jsx
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'

const [date, setDate] = useState()

// Single date
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
/>

// Date range
const [dateRange, setDateRange] = useState()
<Calendar
  mode="range"
  selected={dateRange}
  onSelect={setDateRange}
  numberOfMonths={1}
/>
```

---

## Badge

**Location**: `src/components/ui/badge.jsx`

**Usage:**
```jsx
import { Badge } from '@/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## Skeleton

**Location**: `src/components/ui/skeleton.jsx`

**Usage:**
```jsx
import { Skeleton } from '@/components/ui/skeleton'

<Skeleton className="h-4 w-full" />
<Skeleton className="h-12 w-12 rounded-full" />
```

---

## Pagination

**Location**: `src/components/ui/pagination.jsx`

**Usage:**
```jsx
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

## Dropdown Menu

**Location**: `src/components/ui/dropdown-menu.jsx`

**Usage:**
```jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Toast Notifications (Sonner)

**Location**: `src/components/ui/sonner.jsx`

**Usage:**
```jsx
import { toast } from 'sonner'

// Success
toast.success('Success!', {
  description: 'Operation completed successfully.',
})

// Error
toast.error('Error!', {
  description: 'Something went wrong.',
})

// Info
toast.info('Info', {
  description: 'Here is some information.',
})

// Warning
toast.warning('Warning', {
  description: 'Please be careful.',
})
```

**Setup:**
The `<Toaster />` component is already included in `App.jsx`.

---

## Field Components

**Location**: `src/components/ui/field.jsx`

**Usage:**
```jsx
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

<Field>
  <FieldLabel htmlFor="email">Email Address</FieldLabel>
  <Input id="email" type="email" />
  <FieldDescription>We'll never share your email.</FieldDescription>
</Field>
```

---

## Custom Components

### Theme Toggle

**Location**: `src/components/ui/theme-toggle.jsx`

**Usage:**
```jsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

<ThemeToggle />
```

Automatically toggles between light and dark mode, persists in localStorage.

---

## Best Practices

1. **Always use Field + FieldLabel for form inputs**
   - Improves accessibility
   - Consistent styling

2. **Use AlertDialog for destructive actions**
   - Better UX than `window.confirm()`
   - Accessible and customizable

3. **Use toast for notifications**
   - Non-intrusive
   - Better than `alert()`

4. **Use Button asChild with Links**
   - Maintains button styling
   - Proper navigation

5. **Add ARIA attributes for accessibility**
   - `aria-label` for icon-only buttons
   - `aria-describedby` for form inputs
   - `aria-live` for dynamic content

---

## Component Customization

All components can be customized via:
- Tailwind CSS classes
- CSS variables (in `src/index.css`)
- Component props

Example:
```jsx
<Button className="custom-class">
  Custom Button
</Button>
```

---

## Accessibility

All Shadcn components are built on Radix UI primitives, which are:
- Keyboard accessible
- Screen reader friendly
- ARIA compliant
- Focus management built-in

---

## Dark Mode Support

All components automatically support dark mode when the `dark` class is applied to `document.documentElement`.

Toggle via `ThemeToggle` component or manually:
```jsx
document.documentElement.classList.toggle('dark')
```
