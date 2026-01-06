import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { SwipeCard } from '../components/SwipeCard';
import { Button } from '../components/Button';
import { RefreshCw, Activity } from 'lucide-react';
import { generateProfiles } from '../services/geminiService';

interface SwipeScreenProps {
  onMatch: (profile: UserProfile) => void;
  userVibes?: string[];
}

export const SwipeScreen: React.FC<SwipeScreenProps> = ({ onMatch, userVibes = [] }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const newProfiles = await generateProfiles(5, userVibes);
    setProfiles(prev => [...prev, ...newProfiles]);
    setLoading(false);
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    setTimeout(() => {
        if (direction === 'right') {
            onMatch(currentProfile);
        }
        setCurrentIndex(prev => prev + 1);
        if (profiles.length - currentIndex < 3) {
            generateProfiles(3, userVibes).then(newP => setProfiles(prev => [...prev, ...newP]));
        }
    }, 200);
  };

  const swipeLeft = () => handleSwipe('left');
  const swipeRight = () => handleSwipe('right');

  if (loading && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-cyan-500 relative bg-black">
        <Activity className="animate-pulse mb-4 text-cyan-500" size={48} />
        <p className="text-white font-bold tracking-[0.2em] text-xs uppercase opacity-70">Tuning frequency...</p>
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

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 2).reverse();

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      
      {/* Vibe Simple Logo Header */}
      <div className="absolute top-8 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
            <Activity size={18} className="text-cyan-400" />
            <span className="font-bold tracking-tight text-lg text-white">vibe</span>
        </div>
      </div>

      <div className="absolute inset-0 bottom-0 z-0">
        {visibleProfiles.map((profile, index) => {
            const isTop = profile.id === profiles[currentIndex].id;
            return (
                <SwipeCard 
                    key={profile.id}
                    profile={profile}
                    active={isTop}
                    onSwipe={handleSwipe}
                    userVibes={userVibes}
                />
            );
        })}
      </div>
      
      {/* Hidden manual controls for accessibility / logic */}
      <div className="hidden">
         <button onClick={swipeLeft}></button>
         <button onClick={swipeRight}></button>
      </div>

    </div>
  );
};