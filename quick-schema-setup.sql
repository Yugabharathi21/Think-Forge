-- Quick setup script for missing tables
-- Run this in your Supabase SQL Editor if you're getting 404 errors

-- Check if tables exist
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
