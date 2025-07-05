# SmartNotes Setup Guide

## 🚀 Quick Start with MongoDB Atlas

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the free tier)

### Step 2: Get Database Connection String
1. In your Atlas dashboard, click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `smartnotesapp`

### Step 3: Create Environment File
Create a file named `.env.local` in your project root with:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/smartnotesapp?retryWrites=true&w=majority
JWT_SECRET=smartnotes-super-secret-jwt-key-2024
```

### Step 4: Start the Application
```bash
npm run dev
```

## 🔧 Alternative: Local MongoDB

If you prefer local MongoDB:

1. Install MongoDB Community Server
2. Start MongoDB service
3. Create `.env.local` with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/smartnotesapp
   JWT_SECRET=smartnotes-super-secret-jwt-key-2024
   ```

## ✅ Verification

After setup, you should be able to:
- Register a new user account
- Login with your credentials
- Upload notes
- Browse notes
- View your dashboard

## 🆘 Troubleshooting

If you still get connection errors:
1. Check your `.env.local` file exists
2. Verify your MongoDB connection string
3. Ensure your IP is whitelisted in Atlas (if using Atlas)
4. Check if MongoDB service is running (if using local) 