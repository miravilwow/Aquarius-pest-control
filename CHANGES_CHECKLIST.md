# Checklist: Files na dapat makita sa GitHub Desktop

## 🆕 NEW FILES (Dapat makita as "Untracked" or "New"):
1. `src/components/ui/theme-toggle.jsx` - Theme toggle component
2. `server/database/setup-tables.js` - Database setup script
3. `server/database/reset-admin.js` - Admin password reset script

## ✏️ MODIFIED FILES (Dapat makita as "Modified"):

### Landing Page / Carousel:
- `src/pages/client/Home.jsx` - Custom carousel, pagination, auto-slide, modal
- `src/pages/client/Home.css` - Carousel styles, transitions

### Admin Pages:
- `src/pages/admin/AdminDashboard.jsx` - Area chart, filters popover, calendar, skeleton loading
- `src/pages/admin/AdminDashboard.css` - Filter styles, calendar sizing
- `src/pages/admin/AdminBookings.jsx` - Pagination, action bar, bulk selection
- `src/pages/admin/AdminBookings.css` - Action bar styles
- `src/pages/admin/AdminCustomers.jsx` - Pagination, skeleton loading
- `src/pages/admin/AdminServices.jsx` - FieldLabel, Dialog for delete confirmation
- `src/pages/admin/AdminLogin.jsx` - Logo, Field/Input components, Button asChild

### Admin Layout:
- `src/layouts/AdminLayout.jsx` - Theme toggle, logo, Button asChild for navigation

### Server Files:
- `server/database/schema.sql` - INSERT statement fix (WHERE NOT EXISTS)
- `server/controllers/BookingController.js` - Error response with detail
- `server/controllers/CustomerController.js` - Error response with detail
- `server/controllers/ServiceController.js` - Error response with detail

---

## 📋 How to Check in GitHub Desktop:

1. **Open GitHub Desktop**
2. **Look sa left sidebar** - dapat may makita ka na:
   - "X changed files" (kung may uncommitted changes)
   - O "No local changes" (kung lahat naka-commit na)

3. **Click "Changes" tab** - dapat makita mo lahat ng files listed above

4. **Kung wala kang makita:**
   - Check kung naka-commit na lahat (look sa "History" tab)
   - Check kung naka-push na (look sa "Push" button kung may pending)

5. **Kung may makita ka pero hindi lahat:**
   - I-commit mo yung mga missing files
   - Then push to GitHub

---

## ✅ Quick Test:
I-check mo kung may ganitong files sa GitHub Desktop:
- `theme-toggle.jsx` - NEW file
- `setup-tables.js` - NEW file  
- `Home.jsx` - MODIFIED (carousel changes)
- `AdminDashboard.jsx` - MODIFIED (filters, calendar)

Kung makita mo lahat, ibig sabihin naka-track na ng Git. Kung may missing, kailangan mo i-add/commit.
