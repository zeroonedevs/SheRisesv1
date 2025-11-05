# How to Test Database Collections

## Problem
You're only seeing the `users` collection in MongoDB Compass because the frontend was using localStorage instead of the backend API.

## Solution Applied
✅ Updated all frontend pages to use the backend API instead of localStorage:
- Forum posts now save to MongoDB
- Orders now save to MongoDB
- Seller applications now save to MongoDB
- Products will load from MongoDB
- Cart will sync with MongoDB

## Testing Steps

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
You should see: `✅ Connected to MongoDB`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Each Feature

#### A. Create Forum Post (Community Page)
1. Go to `/community`
2. Login if needed
3. Click "Start Discussion"
4. Fill in title and content
5. Click "Post"
6. **Check MongoDB Compass**: You should see a new document in `forumposts` collection

#### B. Create Order
1. Go to `/marketplace`
2. Add products to cart
3. Go to checkout
4. Fill shipping info
5. Place order
6. **Check MongoDB Compass**: You should see a new document in `orders` collection

#### C. Submit Seller Application
1. Go to `/marketplace`
2. Click "Become a Seller"
3. Fill the form
4. Submit
5. **Check MongoDB Compass**: You should see a new document in `sellerapplications` collection

#### D. Register/Login User
1. Go to `/register` or `/login`
2. Create account or login
3. **Check MongoDB Compass**: You should see documents in `users` collection

### 4. Verify Collections in MongoDB Compass

After testing, you should see these collections:
- ✅ `users` - User accounts
- ✅ `forumposts` - Forum posts (after creating a post)
- ✅ `orders` - Orders (after placing an order)
- ✅ `sellerapplications` - Seller applications (after submitting)
- ✅ `products` - Products (if you create products via API)
- ✅ `messages` - Messages (if you send messages)
- ✅ `media` - Images (if you upload images)

## Troubleshooting

### If you still don't see data:

1. **Check Backend Console**:
   - Look for errors when creating posts/orders
   - Make sure MongoDB connection is successful

2. **Check Frontend Console**:
   - Open browser DevTools (F12)
   - Look for API errors in Console tab
   - Check Network tab to see if API calls are being made

3. **Verify API Endpoints**:
   - Backend should be running on `http://localhost:3000`
   - Frontend should be running on `http://localhost:5173`
   - Check if `VITE_API_BASE_URL` is set correctly in `frontend/.env`

4. **Test API Directly**:
   ```bash
   # Test forum posts endpoint
   curl http://localhost:3000/api/forum/posts
   
   # Test orders endpoint (requires auth token)
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/orders
   ```

5. **Check MongoDB Connection**:
   - Verify `.env` file in `backend/` has correct `MONGODB_URI`
   - Check MongoDB Atlas IP whitelist
   - Verify database name in connection string

## What Changed

### Before:
- Forum posts → localStorage
- Orders → localStorage
- Seller applications → localStorage
- Products → Mock data
- Messages → localStorage

### After:
- Forum posts → MongoDB `forumposts` collection ✅
- Orders → MongoDB `orders` collection ✅
- Seller applications → MongoDB `sellerapplications` collection ✅
- Products → MongoDB `products` collection ✅
- Messages → MongoDB `messages` collection ✅
- Media/Images → MongoDB `media` collection ✅

## Next Steps

1. Create some test data by using the frontend
2. Check MongoDB Compass to verify data is saved
3. If data is still not appearing, check the browser console and backend logs for errors

