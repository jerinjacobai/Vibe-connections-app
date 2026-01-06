import React, { useState } from 'react';
import { AppScreen, Match, UserProfile, MyProfileData } from './types';
import { LoginScreen } from './screens/LoginScreen';
import { SwipeScreen } from './screens/SwipeScreen';
import { MatchesScreen } from './screens/MatchesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { VibeCheckScreen } from './screens/VibeCheckScreen';
import { BottomNav } from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('auth');
  const [matches, setMatches] = useState<Match[]>([]);
  const [userVibes, setUserVibes] = useState<string[]>([]);
  
  // Current user profile state
  const [myProfile, setMyProfile] = useState<MyProfileData>({
      name: "Alex",
      age: 24,
      bio: "Looking for fun",
      mainImage: "https://picsum.photos/seed/me_vibe/400/400",
      gallery: [
           "https://picsum.photos/seed/gal1/400/600",
           "https://picsum.photos/seed/gal2/400/600",
      ]
  });

  const handleUpdateProfile = (data: Partial<MyProfileData>) => {
      setMyProfile(prev => ({ ...prev, ...data }));
  };

  // Simple authentication flow
  const handleLogin = () => {
    // In a real app, this would involve OAuth
    setCurrentScreen('vibe-check');
  };

  const handleVibesSelected = (selectedVibes: string[]) => {
      setUserVibes(selectedVibes);
      setCurrentScreen('swipe');
  };

  const handleEditPreferences = () => {
      setCurrentScreen('vibe-check');
  };

  const handleMatch = (profile: UserProfile) => {
    // 40% chance of immediate match for demo purposes
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
        return <LoginScreen onLogin={handleLogin} />;
      case 'vibe-check':
        return (
            <VibeCheckScreen 
                onContinue={handleVibesSelected} 
                initialVibes={userVibes} 
            />
        );
      case 'swipe':
        return <SwipeScreen onMatch={handleMatch} userVibes={userVibes} />;
      case 'matches':
      case 'chat':
        return <MatchesScreen matches={matches} />;
      case 'profile':
        return (
            <ProfileScreen 
                onEditPreferences={handleEditPreferences} 
                profile={myProfile}
                onUpdateProfile={handleUpdateProfile}
            />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden flex flex-col">
      <main className="flex-1 relative overflow-hidden">
        {renderScreen()}
      </main>
      
      {currentScreen !== 'auth' && currentScreen !== 'vibe-check' && (
        <BottomNav currentScreen={currentScreen} setScreen={setCurrentScreen} />
      )}
    </div>
  );
};

export default App;