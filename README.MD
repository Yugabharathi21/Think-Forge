# 🧠 ThinkForge - AI-Powered Learning Platform

An intelligent learning companion that helps students improve their academic performance through AI-powered conversations and adaptive quizzing.

## ✨ Features

### 🤖 AI-Powered Chat System
- **Smart Conversations**: Context-aware educational discussions
- **Subject Selection**: Specialized assistance in Mathematics, Physics, Chemistry, Biology, Computer Science, History, Geography, Literature, and Economics
- **Session Persistence**: All conversations saved and retrievable
- **Ollama Integration**: Local AI with automatic fallback to curated responses

### 📝 Adaptive MCQ Practice
- **Dynamic Questions**: AI-generated questions when available
- **Mistake Analysis**: Detailed explanations for incorrect answers
- **Progress Tracking**: Performance analytics across subjects
- **Curated Question Bank**: High-quality fallback questions

### 👤 User Management
- **Supabase Authentication**: Secure email/password login
- **Profile Management**: User progress and preferences
- **Cross-Device Sync**: Access your data anywhere

### 📊 Progress Analytics
- **Subject-wise Performance**: Track improvement in each subject
- **Session History**: Review past conversations and quizzes
- **Score Trends**: Visualize learning progress over time

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **React Router** for navigation
- **React Query** for data fetching

### Backend & Database
- **Supabase** - Authentication, Database, Real-time
- **PostgreSQL** with Row Level Security
- **Real-time subscriptions** for live updates

### AI Integration
- **Ollama** - Local AI inference (Mistral model)
- **Intelligent Fallbacks** - Curated responses when AI unavailable
- **Context Management** - Conversation history and subject awareness

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or bun package manager
- (Optional) Ollama for local AI

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Think-Forge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Set up Supabase database**:
   - Create a new Supabase project
   - Run the SQL from `supabase-schema.sql` in your Supabase SQL editor
   - Update `.env` with your project credentials

5. **(Optional) Set up Ollama**:
   ```bash
   # Install Ollama
   winget install Ollama.Ollama
   
   # Install AI model
   ollama pull mistral
   
   # Start service
   ollama serve
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

## 📦 Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration
VITE_OLLAMA_URL=http://localhost:11434/api/generate
VITE_USE_MOCK_AI=false  # Set to true to use mock responses

# Development
VITE_ENV=development
```

## 🏭 Production Deployment

### Netlify Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Set environment variables in Netlify dashboard
   - Deploy from `dist/` directory

3. **Environment Variables for Production**:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_USE_MOCK_AI=true  # Use mock responses in production
   ```

## 🛠️ Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── chat/           # Chat-specific components
│   ├── layout/         # Layout components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (Auth)
├── features/           # Feature-specific logic
│   └── chat/          # Chat feature (constants, types, hooks)
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── supabase.ts    # Supabase client & types
│   ├── database.ts    # Database service functions
│   ├── ollama.ts      # AI integration
│   └── utils.ts       # General utilities
└── pages/             # Route components
```

### Key Files
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/database.ts` - Database service layer
- `src/lib/ollama.ts` - AI integration with fallbacks
- `src/contexts/AuthContext.tsx` - Authentication state management
- `supabase-schema.sql` - Database schema and policies

## 🔧 Backend Services

### Database Services
- **Authentication**: User signup, login, session management
- **Chat Management**: Session creation, message storage, history
- **Quiz System**: Result tracking, progress calculation
- **Analytics**: Performance metrics, learning insights

### AI Services
- **Conversation AI**: Context-aware educational responses
- **Question Generation**: Dynamic MCQ creation
- **Mistake Analysis**: Personalized feedback on wrong answers
- **Fallback System**: Curated responses when AI unavailable

## 🎯 Usage Examples

### Starting a Learning Session
1. Sign up or log in
2. Navigate to Chat
3. Select a subject (e.g., "Mathematics")
4. Ask questions like "Explain derivatives" or "Help me with trigonometry"

### Taking a Quiz
1. Go to MCQ Practice
2. Select subject and difficulty
3. Answer questions and get instant feedback
4. Review detailed explanations for mistakes

### Tracking Progress
1. Visit Progress page
2. View subject-wise performance
3. See score trends and improvement areas
4. Access previous chat sessions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For setup help and detailed backend configuration, see [BACKEND_SETUP.md](./BACKEND_SETUP.md).

## 🔗 Links

- [Live Demo](https://your-netlify-url.netlify.app)
- [Supabase Dashboard](https://supabase.com)
- [Ollama Documentation](https://ollama.ai/docs)

---

Built with ❤️ for better learning outcomes