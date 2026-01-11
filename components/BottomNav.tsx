import React from 'react';
import { Sparkles, MessageCircle, User } from 'lucide-react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  hasUnread?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setScreen, hasUnread = false }) => {
  const navItemClass = (screen: AppScreen) =>
    `relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${currentScreen === screen
      ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
      : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="flex items-center gap-8 px-8 py-4 glass rounded-full shadow-2xl bg-black/60 backdrop-blur-xl pointer-events-auto border border-white/10">

        <button className={navItemClass('swipe')} onClick={() => setScreen('swipe')}>
          <Sparkles size={24} className={currentScreen === 'swipe' ? 'text-cyan-400 fill-cyan-400/20' : ''} />
          {currentScreen === 'swipe' && (
            <span className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_5px_cyan]" />
          )}
        </button>

        <button className={navItemClass('matches')} onClick={() => setScreen('matches')}>
          <div className="relative">
            <MessageCircle size={24} className={currentScreen === 'matches' ? 'text-blue-400 fill-blue-400/20' : ''} />
            {/* Notification dot */}
            {hasUnread && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black animate-pulse"></span>
            )}
          </div>
        </button>

        <button className={navItemClass('profile')} onClick={() => setScreen('profile')}>
          <User size={24} className={currentScreen === 'profile' ? 'text-indigo-400 fill-indigo-400/20' : ''} />
        </button>
      </div>
    </div>
  );
};