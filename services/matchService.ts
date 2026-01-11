import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

export const matchService = {
    // Record a like in the database
    async recordLike(params: { userId: string; targetUserId: string }) {
        const { userId, targetUserId } = params;

        // 1. Insert the like
        const { error: likeError } = await supabase
            .from('likes')
            .insert({ user_id: userId, liked_user_id: targetUserId });

        if (likeError) {
            // Ignore duplicate likes (unique constraint)
            if (likeError.code !== '23505') {
                console.error('Error recording like:', likeError);
            }
        }

        // 2. Check if a match was created by the database trigger
        // We check if a match exists between these two users now.
        const { data: matchData, error: matchError } = await supabase
            .from('matches')
            .select('*, user1:profiles!user1_id(*), user2:profiles!user2_id(*)')
            .or(`and(user1_id.eq.${userId},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${userId})`)
            .single();

        if (matchError && matchError.code !== 'PGRST116') { // PGRST116 is "no rows found"
            console.error('Error checking match:', matchError);
        }

        return matchData;
    },

    // Fetch profiles that are NOT the current user and have NOT been swiped on yet
    // (Simplified for this MVP: Just fetching random users not self)
    async getExploreProfiles(currentUserId: string): Promise<UserProfile[]> {
        // In a real app, we'd filter out already liked/passed users.
        // For now, let's just get everyone else.
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', currentUserId)
            .limit(20);

        if (error) {
            console.error('Error fetching profiles:', error);
            return [];
        }

        return data.map((p: any) => ({
            id: p.id,
            name: p.name,
            age: p.age,
            bio: p.bio,
            imageUrl: p.main_image,
            gallery: p.gallery || [],
            vibes: [], // We can add a 'vibes' column to profiles later for better matching
            distance: Math.floor(Math.random() * 10) + 1, // Mock distance
            rating: 0,
            ratingCount: 0,
            mood: 'Chill', // Default
            jobTitle: 'Viber',
            lookingFor: 'Connections'
        }));
    }
};
