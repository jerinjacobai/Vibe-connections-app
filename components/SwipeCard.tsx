import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { MapPin, Info, Zap, Activity, Star, Check } from 'lucide-react';

interface SwipeCardProps {
  profile: UserProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  active: boolean;
  userVibes?: string[];
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ profile, onSwipe, active, userVibes = [] }) => {
  const [exitX, setExitX] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const likeOpacity = useTransform(x, [50, 200], [0, 1]);
  const nopeOpacity = useTransform(x, [-50, -200], [0, 1]);
  
  // Custom overlay colors for Blue Vibe theme
  const overlayColor = useTransform(x, [-200, 0, 200], [
    "rgba(0, 0, 0, 0.5)", 
    "rgba(0,0,0,0)",
    "rgba(6, 182, 212, 0.3)" // Cyan tint for Like
  ]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      setExitX(500);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitX(-500);
      onSwipe('left');
    }
  };

  if (!active) return null;

  // Identify matching vibes
  const matchingVibes = profile.vibes ? profile.vibes.filter(v => userVibes.includes(v)) : [];
  const hasMatch = matchingVibes.length > 0;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-10"
      style={{ x, rotate, scale, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative w-full h-full bg-black overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border-x border-white/5">
        
        {/* Main Image */}
        <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out"
            style={{ 
                backgroundImage: `url(${profile.imageUrl})`,
                transform: showDetails ? 'scale(1.05)' : 'scale(1)'
            }}
        />
        
        {/* Gradient Overlay */}
        <motion.div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{ backgroundColor: overlayColor }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95 z-10 pointer-events-none" />

        {/* Action Stamps */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 left-8 z-30">
             <span className="text-cyan-400 font-black text-5xl tracking-tighter drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] transform -rotate-12 block">VIBE</span>
        </motion.div>

        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-12 right-8 z-30">
            <span className="text-gray-400 font-black text-5xl tracking-tighter drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] transform rotate-12 block">PASS</span>
        </motion.div>
        
        {/* Rating Badge - Top Right */}
        <div className="absolute top-6 right-6 z-20 pointer-events-none">
             <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                 <Star size={14} className="text-yellow-400 fill-yellow-400" />
                 <span className="text-white font-bold text-sm">{profile.rating}</span>
             </div>
        </div>

        {/* Info Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-28 text-white z-20 pointer-events-auto">
          
          <div className="flex gap-2 mb-3">
             {/* Mood Badge */}
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 backdrop-blur-md border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <Activity size={14} className="text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-100">{profile.mood || "Chill"}</span>
             </div>

             {/* Match Badge */}
             {hasMatch && (
                 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/30 backdrop-blur-md border border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)] animate-pulse">
                    <Check size={14} className="text-blue-200" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">{matchingVibes[0]} Match</span>
                 </div>
             )}
          </div>


          <div className="flex flex-col gap-1">
            <div className="flex items-end gap-3 mb-1">
                 <h2 className="text-4xl font-black tracking-tighter drop-shadow-lg">{profile.name}</h2>
                 <span className="text-2xl font-medium text-gray-400 mb-1">{profile.age}</span>
            </div>
            
            <div className="flex items-center gap-2 text-blue-400 font-medium text-sm mb-3 uppercase tracking-wide">
               {profile.jobTitle || "Just Vibing"} 
            </div>

            {/* Vibe Tags (Buddy Types) */}
            <div className="flex flex-wrap gap-2 mb-2">
                {profile.vibes && profile.vibes.map((vibe, i) => {
                    const isMatch = userVibes.includes(vibe);
                    return (
                        <span key={`vibe-${i}`} className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wide ${
                            isMatch 
                            ? 'bg-cyan-500 text-black border-cyan-400' 
                            : 'bg-white/10 text-white border-white/20'
                        }`}>
                            {vibe}
                        </span>
                    );
                })}
            </div>

            {/* General Interest Tags */}
            <div className="flex flex-wrap gap-2 mb-4 opacity-80">
               {profile.interests.slice(0, 3).map((tag, i) => (
                   <span key={i} className="px-2 py-1 rounded bg-black/40 border border-white/5 text-[10px] font-semibold text-gray-400">
                       #{tag.toLowerCase().replace(/\s/g, '')}
                   </span>
               ))}
            </div>

            {/* Expanded Bio / Details */}
            <AnimatePresence>
                {showDetails ? (
                     <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                     >
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm mb-2">
                             <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-1">Looking For</p>
                             <p className="text-white font-medium mb-3">{profile.lookingFor || "Casual fun"}</p>
                             
                             <p className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-1">Bio</p>
                             <p className="text-gray-300 text-sm leading-relaxed font-light">"{profile.bio}"</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                             <MapPin size={12} />
                             {profile.distance} miles away
                        </div>
                     </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer hover:text-cyan-400 transition-colors"
                        onClick={() => setShowDetails(true)}
                    >
                        <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                        <span className="italic opacity-70 truncate max-w-[80%]">{profile.lookingFor}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
                className="absolute right-6 bottom-28 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center backdrop-blur border border-white/10 text-white hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors"
            >
                <Info size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};