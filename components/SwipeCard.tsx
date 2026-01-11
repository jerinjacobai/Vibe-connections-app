import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { MapPin, Info, Star, Check, Activity, Zap } from 'lucide-react';

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

  const overlayColor = useTransform(x, [-200, 0, 200], [
    "rgba(0, 0, 0, 0.5)",
    "rgba(0,0,0,0)",
    "rgba(0, 240, 255, 0.2)"
  ]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      setExitX(500);
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      setExitX(-500);
      onSwipe('left');
    }
  };

  const matchingVibes = profile.vibes ? profile.vibes.filter(v => userVibes.includes(v)) : [];
  const hasMatch = matchingVibes.length > 0;

  return (
    <motion.div
      className="absolute inset-0 w-full h-full rounded-[2rem] overflow-hidden cursor-grab active:cursor-grabbing bg-midnight shadow-2xl border border-white/10"
      style={active ? { x, rotate, scale, opacity } : { scale: 0.95, opacity: 0.5 }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={exitX !== null ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >

      {/* Main Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out"
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/95 z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-80 z-10 pointer-events-none" />

      {/* Action Stamps */}
      <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 left-8 z-30">
        <div className="border-[6px] border-neon-cyan rounded-2xl px-4 py-2 bg-black/20 backdrop-blur-sm -rotate-12 shadow-[0_0_30px_rgba(0,240,255,0.5)]">
          <span className="text-neon-cyan font-black text-5xl tracking-tighter drop-shadow-lg">VIBE</span>
        </div>
      </motion.div>

      <motion.div style={{ opacity: nopeOpacity }} className="absolute top-12 right-8 z-30">
        <div className="border-[6px] border-red-500 rounded-2xl px-4 py-2 bg-black/20 backdrop-blur-sm rotate-12 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
          <span className="text-red-500 font-black text-5xl tracking-tighter drop-shadow-lg">PASS</span>
        </div>
      </motion.div>

      {/* Rating Badge */}
      <div className="absolute top-6 right-6 z-20 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white font-bold text-sm">{profile.rating}</span>
        </div>
      </div>

      {/* Info Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 pointer-events-auto">

        <div className="flex gap-2 mb-4">
          {/* Mood Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
            <Activity size={14} className="text-neon-pink" />
            <span className="text-xs font-bold uppercase tracking-wider text-pink-100">{profile.mood || "Chill"}</span>
          </div>

          {/* Match Badge */}
          {hasMatch && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-cyan/20 backdrop-blur-md border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse">
              <Zap size={14} className="text-neon-cyan fill-neon-cyan" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Match</span>
            </div>
          )}
        </div>


        <div className="flex flex-col gap-1">
          <div className="flex items-end gap-3 mb-1">
            <h2 className="text-5xl font-black tracking-tighter drop-shadow-2xl">{profile.name}</h2>
            <span className="text-3xl font-light text-white/60 mb-1">{profile.age}</span>
          </div>

          <div className="flex items-center gap-2 text-neon-cyan font-bold text-sm mb-4 uppercase tracking-widest pl-1">
            {profile.jobTitle || "Just Vibing"}
          </div>

          {/* Vibe Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {profile.vibes && profile.vibes.slice(0, 3).map((vibe, i) => {
              const isMatch = userVibes.includes(vibe);
              return (
                <span key={`vibe-${i}`} className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-colors ${isMatch
                    ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'bg-white/5 text-gray-300 border-white/10'
                  }`}>
                  {vibe}
                </span>
              );
            })}
          </div>

          {/* Details Expander */}
          <AnimatePresence>
            {showDetails ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-xl mb-2 mt-4 shadow-xl">
                  <p className="text-[10px] text-neon-cyan uppercase tracking-[0.2em] font-bold mb-2">Looking For</p>
                  <p className="text-white font-medium mb-4 text-sm">{profile.lookingFor || "Casual fun"}</p>

                  <p className="text-[10px] text-neon-cyan uppercase tracking-[0.2em] font-bold mb-2">Bio</p>
                  <p className="text-gray-300 text-sm leading-relaxed font-light italic">"{profile.bio}"</p>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-xs mt-2 pl-1 mb-6">
                  <MapPin size={12} />
                  {profile.distance} miles away
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-6 mt-2"
              // Placeholder to prevent jump
              />
            )}
          </AnimatePresence>

          <button
            onClick={(e) => { e.stopPropagation(); setShowDetails(!showDetails); }}
            className="absolute right-2 bottom-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/20 text-white hover:bg-neon-cyan/20 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all z-30 shadow-lg"
          >
            <Info size={22} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};