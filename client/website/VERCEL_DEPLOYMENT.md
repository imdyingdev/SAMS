# Vercel Deployment Checklist

## ✅ Code Changes Applied
- ✓ Updated `server.js` to export app for Vercel serverless
- ✓ Optimized database connection pool for serverless (max: 1 connection)
- ✓ Updated `vercel.json` with proper routing for static files and API
- ✓ Added debugging logs to API endpoints

## 🔧 Required: Set Environment Variables in Vercel

**CRITICAL:** Before your site will work, you MUST set these in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable Name | Value | Required |
|--------------|-------|----------|
| `DATABASE_URL` | Your PostgreSQL connection string | ✅ YES |
| `NODE_ENV` | `production` | ✅ YES |

### Get Your DATABASE_URL:
From your `.env` file (check `.env.example` for reference):
```
postgresql://postgres.dieyszynhfhlplalfawk:johngrafe104922@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
```

## 📤 Deployment Steps

### Option 1: Automatic (Git Integration)
If your Vercel project is connected to GitHub:
1. Push your changes (you've already done this ✓)
2. Vercel will automatically detect and deploy
3. Wait 1-2 minutes for deployment to complete
4. Check deployment logs in Vercel dashboard

### Option 2: Manual Deployment
```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Deploy from project directory
cd c:\Users\monde\Documents\SAMS\client\website
vercel --prod
```

## 🔍 Verify Deployment

After deployment completes:

1. **Check Deployment Logs** in Vercel dashboard for errors
2. **Test API endpoint directly**: Visit `https://your-site.vercel.app/api/announcements/latest`
   - Should return JSON array of announcements
   - If 404: Environment variables not set
   - If 500: Database connection issue

3. **Check browser console**: Clear cache (Ctrl+Shift+R) and reload

## 🐛 Troubleshooting

### Still getting 404?
- ✓ Verify environment variables are set in Vercel (Settings → Environment Variables)
- ✓ Check if deployment finished (Vercel dashboard)
- ✓ Clear browser cache (Ctrl+Shift+Delete)
- ✓ Wait 2-3 minutes for Vercel to propagate changes

### Getting 500 errors?
- Check Vercel function logs for database connection errors
- Verify `DATABASE_URL` is correct
- Ensure Supabase/PostgreSQL database is accessible from internet

### Deployment fails?
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify `vercel.json` syntax is valid

## 📝 Next Steps

After successful deployment:
1. Visit your live site
2. Check announcements section loads
3. Verify no console errors
4. Test on different browsers

## 🔗 Useful Links
- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Logs: Check "Functions" tab in your project
- Supabase Dashboard: https://supabase.com/dashboard
