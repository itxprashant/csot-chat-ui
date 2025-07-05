# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Set up MongoDB Atlas (see MONGODB_ATLAS_SETUP.md)
3. Make sure your code is committed to Git

## Deployment Steps

### 1. Login to Vercel
```bash
vercel login
```

### 2. Deploy the Application
```bash
vercel --prod
```

### 3. Set Environment Variables
After deployment, you need to add these environment variables in your Vercel dashboard:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: Set to `production`

### 4. Update API URL
Update the `.env.production` file with your actual Vercel deployment URL:
```
REACT_APP_API_URL=https://your-app-name.vercel.app/api
```

### 5. Redeploy
After updating environment variables, redeploy:
```bash
vercel --prod
```

## Alternative: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your Git repository
4. Configure environment variables
5. Deploy

## Important Notes

- Your app will be available at: `https://your-app-name.vercel.app`
- API endpoints will be at: `https://your-app-name.vercel.app/api/*`
- Make sure to update Firebase rules if needed
- Test all functionality after deployment

## Testing Deployment

1. Register a new user
2. Login with the user
3. Try to chat with other users
4. Verify real-time messaging works
