# ThinkForge Backend Integration Guide

## 🚀 Complete Backend Setup with Supabase + Ollama

Your ThinkForge application now has a fully integrated backend system with:

- **Supabase Database** - User authentication, chat sessions, quiz results, progress tracking
- **Ollama AI Integration** - Local AI responses with fallback to mock responses
- **Real-time Data** - All user interactions are saved and tracked

## 📋 Setup Instructions

### 1. Supabase Database Setup

1. **Create Database Schema**:
   - Go to your Supabase dashboard: https://dnicyhcuyjpmckpttmuf.supabase.co
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL commands to create all tables and policies

2. **Environment Variables**:
   ```bash
   VITE_SUPABASE_URL=https://dnicyhcuyjpmckpttmuf.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_OLLAMA_URL=http://localhost:11434/api/generate
   VITE_USE_MOCK_AI=false  # Set to true if Ollama isn't available
   ```

### 2. Ollama AI Setup (Optional)

1. **Install Ollama** (for local AI):
   ```bash
   # Windows
   winget install Ollama.Ollama
   
   # Or download from: https://ollama.ai
   ```

2. **Install AI Model**:
   ```bash
   ollama pull mistral
   ```

3. **Start Ollama Service**:
   ```bash
   ollama serve
   ```

### 3. Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Backend Architecture

### Database Schema

**Tables Created**:
- `chat_sessions` - User chat sessions with AI
- `chat_messages` - Individual messages in chat sessions  
- `quiz_sessions` - Quiz results and scores
- `user_progress` - Subject-wise learning progress

**Features**:
- Row Level Security (RLS) enabled
- User-specific data isolation
- Automatic timestamps
- Performance indexes

### AI Integration

**Ollama Integration**:
- Local AI responses using Mistral model
- Automatic fallback to mock responses
- Context-aware conversations
- Educational content generation

**Mock AI Responses**:
- Subject-specific responses for Math, Physics, Chemistry
- Educational explanations and examples
- Works without Ollama installation

### Authentication System

**Features**:
- Email/password authentication
- User session management
- Protected routes
- Profile management

## 🎯 Key Features Implemented

### 1. **Smart Chat System**
- AI-powered educational conversations
- Context-aware responses
- Session persistence
- Subject selection and tracking

### 2. **Enhanced MCQ System**
- AI-generated questions (when Ollama available)
- Fallback to curated question bank
- Detailed mistake analysis
- Progress tracking and scoring

### 3. **User Progress Tracking**
- Subject-wise performance metrics
- Session history
- Score trends and analytics
- Personalized learning insights

### 4. **Data Persistence**
- All conversations saved to database
- Quiz results and progress tracked
- User preferences remembered
- Cross-device synchronization

## 🚦 Testing the Integration

### 1. **Test Authentication**
- Sign up with email/password
- Verify email confirmation
- Login and logout functionality

### 2. **Test Chat System**
- Start a new chat session
- Select a subject (Math, Physics, etc.)
- Ask questions and verify AI responses
- Check if conversations are saved

### 3. **Test MCQ System**
- Take a quiz in different subjects
- Submit answers and view results
- Check progress tracking

### 4. **Test Data Persistence**
- Login, chat, then logout
- Login again and verify chat history
- Check if progress data is maintained

## 🔧 Environment Configuration

### Development (.env)
```bash
VITE_SUPABASE_URL=https://dnicyhcuyjpmckpttmuf.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_OLLAMA_URL=http://localhost:11434/api/generate
VITE_USE_MOCK_AI=false
VITE_ENV=development
```

### Production (Netlify Environment Variables)
```bash
VITE_SUPABASE_URL=https://dnicyhcuyjpmckpttmuf.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_OLLAMA_URL=https://your-ollama-service.com/api/generate
VITE_USE_MOCK_AI=true  # Use mock responses in production
VITE_ENV=production
```

## 🚀 Deployment to Netlify

### 1. **Build Configuration**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 2. **Environment Variables**
Add these in Netlify Dashboard → Site Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_USE_MOCK_AI=true`

### 3. **Deploy**
```bash
npm run build
# Upload dist/ folder to Netlify or connect GitHub repo
```

## 🔍 Troubleshooting

### Common Issues

1. **Ollama Connection Failed**:
   - Set `VITE_USE_MOCK_AI=true` in environment
   - Mock responses will be used automatically

2. **Supabase RLS Errors**:
   - Ensure user is authenticated
   - Check RLS policies in Supabase dashboard
   - Verify table permissions

3. **Build Errors**:
   - Check TypeScript types
   - Ensure all imports are correct
   - Verify environment variables

### Performance Optimization

1. **Database Queries**:
   - Indexes are already created
   - Limit query results appropriately
   - Use pagination for large datasets

2. **AI Responses**:
   - Implement response caching
   - Set appropriate timeouts
   - Use background processing for large requests

## 📊 Monitoring and Analytics

### Database Monitoring
- Monitor Supabase dashboard for query performance
- Track user growth and engagement
- Review error logs for issues

### AI Usage Tracking
- Monitor Ollama response times
- Track mock vs real AI usage
- Analyze conversation quality

## 🎉 Success!

Your ThinkForge application now has:

✅ **Complete Backend Infrastructure**
✅ **AI-Powered Chat System** 
✅ **User Authentication & Profiles**
✅ **Progress Tracking & Analytics**
✅ **Real-time Data Persistence**
✅ **Production-Ready Deployment**

The application will work seamlessly both locally (with Ollama) and in production (with mock AI responses) while maintaining all backend functionality through Supabase.

## 🔗 Useful Links

- [Supabase Dashboard](https://dnicyhcuyjpmckpttmuf.supabase.co)
- [Ollama Documentation](https://ollama.ai/docs)
- [Netlify Dashboard](https://app.netlify.com)
- [Project Repository](https://github.com/yourusername/thinkforge)
