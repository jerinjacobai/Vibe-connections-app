import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { SwipeCard } from '../components/SwipeCard';
import { Button } from '../components/Button';
import { RefreshCw, Activity, X, Heart } from 'lucide-react';
import { generateProfiles } from '../services/geminiService';

interface SwipeScreenProps {
  onMatch: (profile: UserProfile) => void;
  userVibes?: string[];
  genderInterest?: string;
}

export const SwipeScreen: React.FC<SwipeScreenProps> = ({ onMatch, userVibes = [], genderInterest = 'All' }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProfiles([]);
    setCurrentIndex(0);
    loadProfiles();
  }, [userVibes, genderInterest]); // Reload if preferences change

  const loadProfiles = async () => {
    setLoading(true);
    const newProfiles = await generateProfiles(5, userVibes, genderInterest);
    setProfiles(prev => [...prev, ...newProfiles]);
    setLoading(false);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    // We update state immediately for the logic, but the visual animation is handled by SwipeCard
    setTimeout(() => {
        if (direction === 'right') {
            onMatch(currentProfile);
        }
        setCurrentIndex(prev => prev + 1);
        if (profiles.length - currentIndex < 3) {
            generateProfiles(3, userVibes, genderInterest).then(newP => setProfiles(prev => [...prev, ...newP]));
        }
    }, 200);
  };

  const swipeLeft = () => {
     handleSwipe('left');
  };

  const swipeRight = () => {
     handleSwipe('right');
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-cyan-500 relative bg-black">
        <Activity className="animate-pulse mb-4 text-cyan-500" size={48} />
        <p className="text-white font-bold tracking-[0.2em] text-xs uppercase opacity-70">Tuning frequency...</p>
        <p className="text-cyan-500/50 font-bold tracking-widest text-[10px] uppercase mt-2">
            Looking for: {genderInterest}
        </p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-black">
        <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800 shadow-[0_0_30px_rgba(50,50,50,0.3)]">
            <RefreshCw size={32} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Silence.</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">You've reached the end of the line for now.</p>
        <Button variant="glass" onClick={() => { setCurrentIndex(0); loadProfiles(); }}>Reload Grid</Button>
      </div>
    );
  }

  // Determine which profiles to show for the stack effect
  const activeProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex flex-col">
      
      {/* Vibe Simple Logo Header */}
      <div className="absolute top-6 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
            <Activity size={18} className="text-cyan-400" />
            <span className="font-bold tracking-tight text-lg text-white">vibe</span>
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 relative w-full max-w-md mx-auto mt-4">
        {/* Background/Next Card */}
        {nextProfile && (
            <div className="absolute inset-4 top-2 bottom-24 z-0 transform scale-95 translate-y-4 opacity-60 pointer-events-none transition-all duration-300">
                <SwipeCard 
                    key={nextProfile.id}
                    profile={nextProfile}
                    active={false}
                    onSwipe={() => {}}
                    userVibes={userVibes}
                />
            </div>
        )}

        {/* Active Card */}
        {activeProfile && (
            <div className="absolute inset-4 top-0 bottom-24 z-10">
                <SwipeCard 
                    key={activeProfile.id}
                    profile={activeProfile}
                    active={true}
                    onSwipe={handleSwipe}
                    userVibes={userVibes}
                />
            </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="h-24 w-full max-w-md mx-auto flex items-center justify-center gap-8 z-20 pb-4">
         <button 
            onClick={swipeLeft}
            className="w-16 h-16 rounded-full bg-black border border-gray-800 text-red-500 flex items-center justify-center shadow-lg hover:bg-gray-900 hover:scale-110 transition-all active:scale-95"
         >
            <X size={32} />
         </button>
         
         <button 
            onClick={swipeRight}
            className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-110 transition-all active:scale-95"
         >
            <Heart size={32} fill="currentColor" />
         </button>
      </div>

    </div>
  );
};