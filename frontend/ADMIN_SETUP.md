# Admin Panel Setup Guide

## How to Set Up Your Admin Credentials

### Step 1: Create `.env` File

1. Navigate to the `frontend/` directory
2. Create a new file named `.env` (if it doesn't exist)
3. Add your credentials:

```env
# Your Admin Email
VITE_ADMIN_EMAIL=your-email@example.com

# Your Admin Password
VITE_ADMIN_PASSWORD=your-secure-password

# API Base URL (optional - defaults to http://localhost:3000/api)
VITE_API_BASE_URL=http://localhost:3000/api
```

### Step 2: Replace with Your Credentials

Replace `your-email@example.com` with your actual email and `your-secure-password` with your desired password.

### Step 3: Restart Frontend Server

After creating/updating the `.env` file, restart your frontend development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

## Demo Credentials

For testing or demo purposes, you can use these credentials (always available):

- **Email:** `admin@sherises.com`
- **Password:** `admin123`

These demo credentials are hardcoded in the Admin component and will always work, even without environment variables.

## Important Notes

- ⚠️ **NEVER commit your `.env` file to git** - it's already in `.gitignore`
- The `.env` file should be in the `frontend/` directory
- Environment variables must start with `VITE_` to be accessible in Vite
- After changing `.env`, you must restart the dev server

## Accessing Admin Panel

1. Go to `/admin` route in your application
2. Login with either:
   - Your custom credentials (from `.env` file)
   - Demo credentials (`admin@sherises.com` / `admin123`)

## Troubleshooting

### Credentials not working?
1. Make sure `.env` file is in `frontend/` directory
2. Check that variable names start with `VITE_`
3. Restart the frontend server after creating/updating `.env`
4. Verify there are no extra spaces in your `.env` file

### Demo credentials not working?
- Try clearing browser cache
- Make sure you're using exact credentials:
  - Email: `admin@sherises.com`
  - Password: `admin123`

