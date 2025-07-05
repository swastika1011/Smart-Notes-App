# SmartNotes - Academic Note Sharing Platform

A full-stack web application built with Next.js and MongoDB that allows students to upload academic notes and earn points when their notes are viewed or downloaded by others.

## 🚀 Features

### 🔐 Authentication
- User registration and login with email/password
- JWT-based session authentication
- Protected routes for authenticated users

### 📤 Note Upload System
- PDF file upload with validation
- Comprehensive form with topic title, country, university, subject tag, and description
- AI-powered content validation (simulated Watsonx API)
- Automatic approval based on content quality

### 🤖 AI Validation (Simulated)
- Text extraction from PDF files
- Semantic similarity checking between topic and content
- Profanity and slang detection
- Content quality assessment

### 💾 Data Management
- MongoDB with Mongoose for data persistence
- User and Note schemas with proper relationships
- File storage simulation (ready for cloud integration)

### 🏆 Points System
- +10 points for accepted note uploads
- +2 points for each view of your notes
- +5 points for each download of your notes
- Real-time points tracking and display

### 🔍 Notes Browsing
- Public browsing page with search functionality
- Filter by country and university
- Sort by popularity, date, views, or downloads
- Responsive grid layout

### 👤 User Dashboard
- Personal note management
- Points and statistics overview
- Upload history and performance metrics

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens with bcryptjs
- **File Upload**: FormData with PDF validation
- **AI Integration**: Simulated Watsonx API (placeholder)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartnotesapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/smartnotesapp
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `smartnotesapp`
   - Update the `MONGODB_URI` in your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂 Project Structure

```
smartnotesapp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── notes/         # Notes management endpoints
│   │   │   └── user/          # User dashboard endpoints
│   │   ├── browse/            # Notes browsing page
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── upload/            # Note upload page
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions and configurations
│   ├── models/                # Mongoose schemas
│   └── middleware.ts          # Authentication middleware
├── public/                    # Static assets
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Notes Management
- `POST /api/notes/upload` - Upload new note (protected)
- `GET /api/notes` - Get all notes with filters
- `POST /api/notes/[id]/view` - Record note view
- `POST /api/notes/[id]/download` - Record note download

### User Dashboard
- `GET /api/user/dashboard` - Get user dashboard data (protected)

## 🎯 Usage Guide

### For Students

1. **Create an Account**
   - Visit the registration page
   - Provide your name, email, and password
   - You'll receive 0 initial points

2. **Upload Notes**
   - Navigate to the upload page
   - Fill in all required fields (PDF, topic, country, university)
   - Add optional subject tag and description
   - Submit for AI validation
   - Earn +10 points if approved

3. **Track Performance**
   - View your dashboard for statistics
   - Monitor views and downloads of your notes
   - Track your total points earned

### For Note Seekers

1. **Browse Notes**
   - Visit the browse page
   - Use search and filters to find relevant notes
   - Sort by popularity, date, or other criteria

2. **View and Download**
   - Click "View" to preview note details (+2 points to uploader)
   - Click "Download" to get the file (+5 points to uploader)

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- File type validation (PDF only)

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in environment variables

## 🔮 Future Enhancements

- Real Watsonx API integration
- Cloud file storage (AWS S3, Cloudinary)
- Advanced search with Elasticsearch
- Real-time notifications
- Social features (comments, ratings)
- Mobile app development
- Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.
