# Test Website for Database Connection

This is a simple test website to debug Vercel deployment and database connection issues.

## Features

1. **API Status Check** (`/api/status`) - Verifies API is running and shows environment variables
2. **Database Count** (`/api/count`) - Connects to PostgreSQL and counts announcements

## Deployment Steps

1. **Deploy to Vercel:**
   ```bash
   npx vercel
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - `DATABASE_URL` - Your PostgreSQL connection string

3. **Test the endpoints:**
   - Visit your deployed site
   - Click "Test API Status" - Should show OK
   - Click "Test Database" - Should show announcement count

## Local Testing

```bash
npm install
npx vercel dev
```

## Troubleshooting

- **404 on API routes**: Check if `/api` folder exists and has `.js` files
- **Database connection failed**: Verify DATABASE_URL is set in Vercel
- **No announcements**: The `/api/count` endpoint will create a test announcement if none exist
