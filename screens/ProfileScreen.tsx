import React from 'react';
import { Settings, Edit2, Crown, Activity, Star } from 'lucide-react';
import { Button } from '../components/Button';

export const ProfileScreen: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center p-6 overflow-y-auto bg-black">
        <div className="relative mb-6 mt-8">
            <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600">
                <div className="w-full h-full rounded-full border-4 border-black overflow-hidden">
                    <img src="https://picsum.photos/seed/me_vibe/400/400" alt="My Profile" className="w-full h-full object-cover" />
                </div>
            </div>
            <button className="absolute bottom-1 right-1 bg-gray-900 p-2.5 rounded-full border border-gray-700 text-white hover:bg-gray-800">
                <Edit2 size={14} />
            </button>
        </div>

        <h2 className="text-3xl font-black text-white mb-1 tracking-tight">Alex, 24</h2>
        <div className="flex items-center gap-2 mb-8">
             <div className="px-2 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                 Chill Vibe
             </div>
             <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
             <p className="text-gray-400 text-sm">Looking for fun</p>
        </div>

        <div className="flex gap-4 mb-10 w-full max-w-sm">
            <div className="flex-1 bg-gray-900/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <Activity size={20} />
                </div>
                <span className="font-bold text-xl text-white">42</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Vibes</span>
            </div>
            <div className="flex-1 bg-gray-900/50 rounded-2xl p-4 flex flex-col items-center justify-center border border-white/5 backdrop-blur-sm relative overflow-hidden">
                 {/* Rating display */}
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(250,204,21,0.2)] z-10">
                    <Star size={20} fill="currentColor" />
                </div>
                <span className="font-bold text-xl text-white z-10">9.4</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold z-10">Rating</span>
            </div>
        </div>

        <div className="w-full max-w-sm space-y-4">
             <Button fullWidth variant="glass" className="justify-start px-6 bg-gray-900/50 border-white/5 h-14">
                <Settings className="mr-3 text-gray-400" size={20} />
                <span className="text-gray-200">Preferences</span>
             </Button>
             
             <div className="relative overflow-hidden p-6 rounded-3xl border border-blue-500/30 text-center group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-black opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                <div className="relative z-10">
                    <h3 className="font-black text-white text-lg mb-1 italic tracking-wider">VIBE <span className="text-blue-400">BLUE</span></h3>
                    <p className="text-xs text-blue-200 mb-4 max-w-[200px] mx-auto leading-relaxed">See who vibed with you, unlimited swipes, and advanced filters.</p>
                    <button className="bg-white text-black text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-lg shadow-white/10">
                        Upgrade
                    </button>
                </div>
             </div>
        </div>
        
        <div className="mt-auto pt-8 pb-24">
            <button className="text-xs text-gray-600 hover:text-white transition-colors uppercase font-bold tracking-widest">
                Log Out
            </button>
        </div>
    </div>
  );
};