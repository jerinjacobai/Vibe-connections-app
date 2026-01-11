import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { SwipeCard } from '../components/SwipeCard';
import { RefreshCw, Activity, X, Heart, Zap } from 'lucide-react';
import { generateProfiles } from '../services/geminiService';
import { NeonButton } from '../components/NeonButton';

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
  }, [userVibes, genderInterest]);

  const loadProfiles = async () => {
    setLoading(true);
    const newProfiles = await generateProfiles(5, userVibes, genderInterest);
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
        generateProfiles(3, userVibes, genderInterest).then(newP => setProfiles(prev => [...prev, ...newP]));
      }
    }, 200);
  };

  const swipeLeft = () => {
    // We trigger the swipe via a ref or imperative handle in a real app, 
    // but for this simple version we rely on the user dragging or we'd need a Ref on SwipeCard.
    // For now, let's just manually trigger the logic and assume the user drags.
    // To support button clicks moving the card, we'd need to pass a control prop to SwipeCard.
    // Since this is a redesign, let's keep it simple: Buttons are visual cues or we implement a refined ref later.
    // Actually, let's simulate it by force-swiping the logic:
    handleSwipe('left');
  };

  const swipeRight = () => {
    handleSwipe('right');
  };

  if (loading && profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neon-cyan relative bg-void font-outfit">
        <div className="relative">
          <div className="absolute inset-0 bg-neon-cyan blur-xl opacity-50 animate-pulse"></div>
          <Activity className="relative z-10 animate-spin-slow" size={64} />
        </div>
        <p className="text-white font-bold tracking-[0.3em] text-sm uppercase mt-8 animate-pulse">Scanning Frequencies</p>
        <p className="text-neon-cyan/50 font-bold tracking-widest text-[10px] uppercase mt-2">
          Target: {genderInterest}
        </p>
      </div>
    );
  }

  if (currentIndex >= profiles.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-void font-outfit">
        <div className="w-24 h-24 bg-midnight rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group">
          <div className="absolute inset-0 bg-neon-purple rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <Activity size={32} className="text-gray-500 group-hover:text-neon-purple transition-colors" />
        </div>
        <h2 className="text-3xl font-black text-white mb-2 italic tracking-tighter">SIGNAL LOST</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm font-light">We've exhausted the local spectrum. Broadcasting new signal...</p>

        <NeonButton variant="secondary" onClick={() => { setCurrentIndex(0); loadProfiles(); }}>
          <RefreshCw size={18} className="mr-2" />
          Rescan Sector
        </NeonButton>
      </div>
    );
  }

  const activeProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  return (
    <div className="relative w-full h-full bg-void overflow-hidden flex flex-col font-outfit">

      {/* Vibe Logo Header */}
      <div className="absolute top-6 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
          <Zap size={18} className="text-neon-cyan fill-neon-cyan/50" />
          <span className="font-bold tracking-tight text-xl text-white italic">vibe</span>
        </div>
      </div>

      {/* Card Container */}
      <div className="flex-1 relative w-full max-w-md mx-auto mt-4 px-2">
        {/* Background/Next Card */}
        {nextProfile && (
          <div className="absolute inset-2 top-2 bottom-28 z-0 transform scale-95 translate-y-4 opacity-40 pointer-events-none grayscale transition-all duration-300">
            <SwipeCard
              key={nextProfile.id}
              profile={nextProfile}
              active={false}
              onSwipe={() => { }}
              userVibes={userVibes}
            />
          </div>
        )}

        {/* Active Card */}
        {activeProfile && (
          <div className="absolute inset-2 top-0 bottom-28 z-10">
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
      <div className="h-24 w-full max-w-md mx-auto flex items-center justify-center gap-10 z-20 pb-6 px-4">
        <button
          onClick={swipeLeft}
          className="w-16 h-16 rounded-full bg-black/80 backdrop-blur-sm border border-white/10 text-red-500 flex items-center justify-center shadow-lg hover:bg-black hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-110 transition-all active:scale-95 group"
        >
          <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <button
          onClick={swipeRight}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-blue text-white flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-110 transition-all active:scale-95 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 blur-lg animate-pulse"></div>
          <Heart size={36} fill="currentColor" className="relative z-10" />
        </button>

        <button
          className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-neon-purple flex items-center justify-center hover:bg-black hover:border-neon-purple/50 transition-all active:scale-95"
        >
          <Zap size={20} />
        </button>
      </div>

    </div>
  );
};