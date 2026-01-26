# Admin User Guide

## Getting Started

### Login

1. Navigate to `/admin/login`
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Click "Login"

⚠️ **Important**: Change the default password after first login!

---

## Dashboard

The dashboard provides an overview of your pest control business.

### Statistics Cards

- **Total Bookings**: All bookings ever created
- **Pending Bookings**: Bookings awaiting confirmation
- **Total Customers**: Unique customers who made bookings
- **Total Services**: Available services

### Charts

- **Area Chart**: Shows booking trends over time
- **Pie Chart**: Bookings by status distribution
- **Bar Chart**: Bookings by service type

### Filters

Use the "Filters" button to:
- Select time range (Last 7 Days, 30 Days, 3 Months)
- Filter by status
- Filter by date range using calendar

### Recent Bookings

Shows the 5 most recent bookings with:
- Customer name
- Service
- Date and time
- Status badge

---

## Bookings Management

### Viewing Bookings

The bookings table shows:
- Booking ID
- Customer name
- Email
- Phone
- Service
- Preferred date and time
- Status

### Searching

Use the search bar to find bookings by:
- Customer name
- Email
- Phone number
- Service name
- Booking ID

### Filtering

Click the "Filters" button to filter by:
- **Status**: All, Pending, Confirmed, Completed, Cancelled
- **Service**: Filter by specific service
- **Date Range**: Select a date range using the calendar

### Quick Filters

- **Today**: Bookings for today
- **This Week**: Bookings this week
- **This Month**: Bookings this month
- **Last 30 Days**: Bookings in the last 30 days

### Updating Status

1. Click the "⋮" (three dots) menu on a booking row
2. Select the new status:
   - Set to Pending
   - Set to Confirmed
   - Set to Completed
   - Set to Cancelled

### Bulk Actions

1. Select bookings using checkboxes
2. Use the action bar at the bottom to:
   - Mark as Completed
   - Mark as Cancelled
   - Clear Selection

### Viewing Details

1. Click "View Details" from the actions menu
2. View complete booking information
3. Actions available:
   - Send Email (opens email client)
   - Print (prints booking details)
   - Close

### Exporting

Click "Export CSV" to download all bookings (respects current filters) as a CSV file.

### Pagination

- Use "Previous" and "Next" buttons
- Select items per page (10, 25, 50, 100)
- Use "Go to" to jump to a specific page

---

## Services Management

### Adding a Service

1. Click "Add New Service"
2. Fill in the form:
   - **Service Name** (required, min 3 characters)
   - **Description** (required, min 10 characters)
   - **Price** (required, must be positive number)
3. Click "Add Service"

### Editing a Service

1. Click "Edit" on a service card
2. Modify the fields
3. Click "Update Service"

**Note**: The notification will show what changed (e.g., "Price: ₱150.00 → ₱200.00")

### Deleting a Service

1. Click "Delete" on a service card
2. Confirm deletion in the dialog
3. Service will be permanently removed

---

## Customers Management

### Viewing Customers

The customers table shows:
- Customer ID
- Name
- Email
- Phone
- Address
- Total Bookings

### Searching

Use the search bar to find customers by:
- Name
- Email
- Phone number
- Address
- Customer ID

### Sorting

Click column headers to sort:
- Click once: Ascending
- Click again: Descending
- Arrow icon indicates sort direction

### Column Visibility

1. Click "Columns" dropdown
2. Toggle columns on/off
3. Hidden columns won't appear in the table

### Exporting

Click "Export CSV" to download customer data as a CSV file.

---

## Activity Log

View all admin actions:
- Service created/updated/deleted
- Booking status changes
- CSV exports
- Login/logout events

---

## Keyboard Shortcuts

- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons/links
- **Escape**: Close modals/dialogs
- **Arrow Keys**: Navigate table rows (when focused)

---

## Tips

1. **Use filters** to quickly find specific bookings
2. **Export data** regularly for backup
3. **Update booking status** promptly to keep records current
4. **Search is debounced** - wait 300ms after typing for results
5. **Dark mode** available via theme toggle in header

---

## Troubleshooting

### Can't see bookings?
- Check if filters are applied (look for filter count badge)
- Click "Clear Filters" to reset

### Search not working?
- Wait a moment after typing (debounced)
- Check spelling
- Try different search terms

### Can't update status?
- Ensure you're logged in
- Refresh the page
- Check browser console for errors

---

## Support

For technical issues, contact the development team or check the documentation.
