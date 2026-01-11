-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  name TEXT,
  age INTEGER,
  bio TEXT,
  main_image TEXT,
  gallery TEXT[], -- Array of image URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Create matches table
CREATE TABLE public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user1_id, user2_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Build policies for matches (users can see matches they are part of)
CREATE POLICY "Users can see their own matches"
ON public.matches FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create messages table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see messages for their matches"
ON public.messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.matches 
        WHERE id = messages.match_id 
        AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
);

CREATE POLICY "Users can insert messages to their matches"
ON public.messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.matches 
        WHERE id = messages.match_id 
        AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
);

-- Create Likes table
CREATE TABLE public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    liked_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, liked_user_id)
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own likes"
ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can see likes they created"
ON public.likes FOR SELECT USING (auth.uid() = user_id);

-- MATCHING LOGIC FUNCTION
-- This function runs when a new like is inserted. 
-- It checks if the liked_user has already liked the liker.
CREATE OR REPLACE FUNCTION check_match() RETURNS TRIGGER AS $$
BEGIN
    -- Check if the other user already liked this user
    IF EXISTS (
        SELECT 1 FROM public.likes 
        WHERE user_id = NEW.liked_user_id 
        AND liked_user_id = NEW.user_id
    ) THEN
        -- It's a match! Insert into matches table
        INSERT INTO public.matches (user1_id, user2_id)
        VALUES (LEAST(NEW.user_id, NEW.liked_user_id), GREATEST(NEW.user_id, NEW.liked_user_id))
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for matching
CREATE TRIGGER on_like_created
    AFTER INSERT ON public.likes
    FOR EACH ROW
    EXECUTE FUNCTION check_match();
