# MongoDB Atlas Setup Guide

## Steps to set up MongoDB Atlas for production:

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Create Cluster"
   - Choose the free tier (M0 Sandbox)
   - Select a region close to your users
   - Click "Create Cluster"

3. **Set up Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"
   - Add User

4. **Set up Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for Vercel)
   - Confirm

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., "mydatabase")

6. **Add to Vercel Environment Variables**
   - In your Vercel dashboard, go to your project settings
   - Add environment variable: `MONGODB_URI` with your connection string

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mydatabase?retryWrites=true&w=majority
```
