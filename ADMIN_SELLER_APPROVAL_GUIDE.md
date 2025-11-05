# Admin Seller Application Approval Guide

## Issue Fixed ✅

The seller application approval system now works with the backend MongoDB database.

## What Was Fixed

1. **Admin Authentication**: Admin panel now authenticates with backend API to get JWT token
2. **Application ID**: Fixed to use MongoDB `_id` instead of numeric `id`
3. **API Integration**: Approve/Reject buttons now properly call backend API
4. **Data Sync**: Approved applications are now saved to MongoDB and visible in backend

## Setup Instructions

### Step 1: Create Admin User in Database

Run this command to create an admin user in MongoDB:

```bash
cd backend
npm run create:admin
```

This will create an admin user with:
- Email: `admin@sherises.com` (or from `ADMIN_EMAIL` env var)
- Password: `admin123` (or from `ADMIN_PASSWORD` env var)

### Step 2: Configure Admin Credentials (Optional)

You can set custom admin credentials in `backend/.env`:

```env
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password
```

### Step 3: Login to Admin Panel

1. Go to `/admin` route
2. Login with:
   - **Backend Admin**: Email and password from Step 1 (recommended)
   - **Demo Credentials**: `admin@sherises.com` / `admin123` (if backend not available)

### Step 4: Approve Seller Applications

1. Go to "Seller Applications" tab in admin panel
2. You'll see all pending applications from MongoDB
3. Click "Approve" button to approve
4. Click "Reject" button to reject (with reason)
5. Approved applications are saved to MongoDB
6. User role is automatically updated to "seller" in database

## How It Works

### Application Submission
- User submits application via `BecomeSellerModal`
- Application is saved to MongoDB `sellerapplications` collection
- Status: `pending`

### Admin Approval
- Admin logs in (authenticates with backend)
- Admin sees all applications from MongoDB
- Admin clicks "Approve" → API call to `/api/seller-applications/:id/approve`
- Backend:
  - Updates application status to `approved`
  - Updates user role to `seller`
  - Saves to MongoDB

### Verification

Check MongoDB Compass:
1. `sellerapplications` collection - See all applications with status
2. `users` collection - See user role updated to `seller` after approval

## Troubleshooting

### "Authentication failed" error
- Make sure you created admin user: `npm run create:admin`
- Make sure backend is running: `npm run dev` in `backend/` directory
- Login with admin credentials from database

### Applications not showing
- Check backend is running
- Check MongoDB connection
- Check browser console for errors
- Verify admin has JWT token (check localStorage)

### Approval not working
- Check backend console for errors
- Verify admin user has `role: 'admin'` in database
- Check JWT token is valid
- Check application ID format (should be MongoDB `_id`)

### Applications not visible in MongoDB
- Make sure applications are submitted via API (not localStorage)
- Check `sellerapplications` collection in MongoDB Compass
- Verify backend route is working: `GET /api/seller-applications`

## Testing

1. **Submit Application**:
   - Login as regular user
   - Go to Marketplace
   - Click "Become a Seller"
   - Fill form and submit
   - Check MongoDB: Should see new document in `sellerapplications`

2. **Approve Application**:
   - Login as admin
   - Go to Admin → Seller Applications
   - Click "Approve" on pending application
   - Check MongoDB: 
     - `sellerapplications` → status should be `approved`
     - `users` → user role should be `seller`

## API Endpoints Used

- `POST /api/seller-applications` - Submit application
- `GET /api/seller-applications` - Get all applications (Admin only)
- `PATCH /api/seller-applications/:id/approve` - Approve application (Admin only)
- `PATCH /api/seller-applications/:id/reject` - Reject application (Admin only)

All endpoints require authentication except submission (which requires user auth).

