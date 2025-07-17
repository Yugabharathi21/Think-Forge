# 🚨 Quick Fix for Database Issues

## Problem
You're seeing 404 errors when trying to create chat sessions:
```
XHRPOST https://dnicyhcuyjpmckpttmuf.supabase.co/rest/v1/chat_sessions?select=*
[HTTP/3 404 162ms]
```

## Solution
The `chat_sessions` and `chat_messages` tables might not exist in your Supabase database yet.

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project (dnicyhcuyjpmckpttmuf)
3. Go to "SQL Editor" in the left sidebar

### Step 2: Run the Quick Setup Script
Copy and paste this SQL script in the SQL Editor and click "Run":

```sql
-- Quick setup script for missing tables
DO $$
BEGIN
    -- Check if chat_sessions table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_sessions') THEN
        RAISE NOTICE 'Creating chat_sessions table...';
        
        CREATE TABLE public.chat_sessions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            subject TEXT NOT NULL,
            title TEXT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );

        -- Enable RLS
        ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view their own chat sessions" ON public.chat_sessions
            FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can insert their own chat sessions" ON public.chat_sessions
            FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Users can update their own chat sessions" ON public.chat_sessions
            FOR UPDATE USING (auth.uid() = user_id);

        CREATE POLICY "Users can delete their own chat sessions" ON public.chat_sessions
            FOR DELETE USING (auth.uid() = user_id);
    ELSE
        RAISE NOTICE 'chat_sessions table already exists';
    END IF;

    -- Check if chat_messages table exists
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'chat_messages') THEN
        RAISE NOTICE 'Creating chat_messages table...';
        
        CREATE TABLE public.chat_messages (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
        );

        -- Enable RLS
        ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

        -- Create policies
        CREATE POLICY "Users can view their own chat messages" ON public.chat_messages
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.chat_sessions 
                    WHERE chat_sessions.id = chat_messages.session_id 
                    AND chat_sessions.user_id = auth.uid()
                )
            );

        CREATE POLICY "Users can insert their own chat messages" ON public.chat_messages
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.chat_sessions 
                    WHERE chat_sessions.id = chat_messages.session_id 
                    AND chat_sessions.user_id = auth.uid()
                )
            );
    ELSE
        RAISE NOTICE 'chat_messages table already exists';
    END IF;
END $$;
```

### Step 3: Verify Tables Created
After running the script, you should see messages like:
- "Creating chat_sessions table..." or "chat_sessions table already exists"
- "Creating chat_messages table..." or "chat_messages table already exists"

### Step 4: Test the Application
1. Refresh your browser (http://localhost:8080)
2. Try selecting a subject and asking a question
3. Try asking for a flowchart: "Create a study plan for Machine Learning"

## Alternative: Run Full Schema
If you want to create ALL the tables at once, run the complete schema from `supabase-schema.sql`.

## Ollama Connection Fixed
I've also fixed the Ollama connection check to avoid JSON parsing errors. The system should now work properly with your local Ollama installation.

## Testing Flowchart Generation
Once the database is fixed, try these commands in the chat:
- "Create a flowchart for Python programming"
- "Generate a study plan for Data Science"
- "I need a mind map for React.js"
- "Show me a learning roadmap for Machine Learning"

The system will detect these requests and show a button to generate the visual flowchart!
