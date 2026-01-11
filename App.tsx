import React, { useState, useEffect } from 'react';
import { AppScreen, Match, UserProfile, MyProfileData } from './types';
import { LoginScreen } from './screens/LoginScreen';
import { SwipeScreen } from './screens/SwipeScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { VibeCheckScreen } from './screens/VibeCheckScreen';
import { BottomNav } from './components/BottomNav';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('auth');
  const [session, setSession] = useState<any>(null);

  // State
  const [matches, setMatches] = useState<Match[]>([]);
  const [userVibes, setUserVibes] = useState<string[]>([]);
  const [genderInterest, setGenderInterest] = useState<string>('All');

  // Current user profile state
  const [myProfile, setMyProfile] = useState<MyProfileData>({
    name: "Alex",
    age: 24,
    bio: "Just vibing ✨",
    mainImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60",
    gallery: []
  });

  // Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) setCurrentScreen('vibe-check');
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && currentScreen === 'auth') {
        setCurrentScreen('vibe-check');
      } else if (!session) {
        setCurrentScreen('auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch Data on Login
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      // Fetch Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setMyProfile({
          name: profile.name,
          age: profile.age,
          bio: profile.bio,
          mainImage: profile.main_image,
          gallery: profile.gallery || []
        });
        // If profile exists, skip vibe check (optional: optimize flow later)
        setCurrentScreen('swipe');
      } else {
        // New user
        setCurrentScreen('vibe-check');
      }

      // Fetch Matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
                id,
                created_at,
                user1:profiles!user1_id(*),
                user2:profiles!user2_id(*)
            `)
        .or(`user1_id.eq.${session.user.id},user2_id.eq.${session.user.id}`);

      if (matchesData) {
        const formattedMatches: Match[] = matchesData.map((m: any) => {
          const isUser1 = m.user1.id === session.user.id;
          const otherUser = isUser1 ? m.user2 : m.user1;
          return {
            id: m.id,
            userId: otherUser.id,
            profile: {
              id: otherUser.id,
              name: otherUser.name,
              age: otherUser.age,
              bio: otherUser.bio,
              imageUrl: otherUser.main_image,
              vibes: [],
              interests: [],
              distance: 1,
              jobTitle: '', // compatibility
              mood: 'Chill',
              lookingFor: 'Chat',
              rating: 0,
              ratingCount: 0
            },
            lastMessage: "New Match!",
            timestamp: new Date(m.created_at).toLocaleTimeString(),
            unread: false
          };
        });
        setMatches(formattedMatches);
      }
    };

    fetchData();
  }, [session]);

  const handleUpdateProfile = (data: Partial<MyProfileData>) => {
    setMyProfile(prev => ({ ...prev, ...data }));
    // Update DB
    if (session) {
      supabase.from('profiles').update({
        name: data.name,
        bio: data.bio,
        main_image: data.mainImage,
        gallery: data.gallery
      }).eq('id', session.user.id).then();
    }
  };

  const handleUpdateMatch = (matchId: string, data: Partial<Match> | { profile: Partial<UserProfile> }) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== matchId) return m;

      // Handle nested profile updates if present
      if ('profile' in data) {
        return { ...m, ...data, profile: { ...m.profile, ...data.profile } };
      }

      return { ...m, ...data } as Match;
    }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentScreen('auth');
  };

  const handleVibesSelected = async (selectedVibes: string[], gender: string) => {
    setUserVibes(selectedVibes);
    setGenderInterest(gender);

    if (session) {
      // Create profile if not exists
      const { error } = await supabase.from('profiles').upsert({
        id: session.user.id,
        name: myProfile.name,
        age: myProfile.age,
        bio: myProfile.bio,
        main_image: myProfile.mainImage,
        gallery: myProfile.gallery
      });

      if (!error) setCurrentScreen('swipe');
    } else {
      setCurrentScreen('swipe');
    }
  };

  const handleEditPreferences = () => {
    setCurrentScreen('vibe-check');
  };

  const handleMatch = (profile: UserProfile) => {
    // Local-only match simulation for now, until we have real users in DB
    const isMatch = Math.random() > 0.6;

    if (isMatch) {
      const newMatch: Match = {
        id: Date.now().toString(),
        userId: profile.id,
        profile: profile,
        lastMessage: "",
        timestamp: new Date().toISOString(),
        unread: true
      };
      setMatches(prev => [newMatch, ...prev]);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <LoginScreen onLogin={() => { }} />;
      case 'vibe-check':
        return (
          <VibeCheckScreen
            onContinue={handleVibesSelected}
            initialVibes={userVibes}
            initialGender={genderInterest}
          />
        );
      case 'swipe':
        return <SwipeScreen onMatch={handleMatch} userVibes={userVibes} genderInterest={genderInterest} />;
      case 'matches':
      case 'chat':
        return <MatchesScreen matches={matches} onUpdateMatch={handleUpdateMatch} />;
      case 'profile':
        return (
          <ProfileScreen
            onEditPreferences={handleEditPreferences}
            profile={myProfile}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
          />
        );
      default:
        return <LoginScreen onLogin={() => { }} />;
    }
  };

  const unreadCount = matches.filter(m => m.unread).length;

  return (
    // Fixed positioning ensures we take up the visual viewport exactly, helping with mobile browser chrome
    <div className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col">
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {renderScreen()}
      </main>

      {currentScreen !== 'auth' && currentScreen !== 'vibe-check' && (
        <BottomNav
          currentScreen={currentScreen}
          setScreen={setCurrentScreen}
          hasUnread={unreadCount > 0}
        />
      )}
    </div>
  );
};

export default App;