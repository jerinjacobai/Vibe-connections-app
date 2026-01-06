import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Activity, Check, Plus, X } from 'lucide-react';

interface VibeCheckScreenProps {
  onContinue: (selectedVibes: string[]) => void;
  initialVibes?: string[];
}

const DEFAULT_VIBES = [
  "Smoke Buddy", "Pluck Buddy", "Tennis Buddy", 
  "Football Buddy", "FIFA Buddy", "CSGO Buddy", 
  "Gym Buddy", "Drinking Buddy", "Study Buddy", 
  "Travel Buddy", "Hiking Buddy", "Cuddle Buddy",
  "Gaming Buddy", "Rave Buddy", "FWB", "Hookup Buddy"
];

export const VibeCheckScreen: React.FC<VibeCheckScreenProps> = ({ onContinue, initialVibes = [] }) => {
  const [selected, setSelected] = useState<string[]>(initialVibes);
  const [customVibe, setCustomVibe] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
      setSelected(initialVibes);
  }, [initialVibes]);

  const toggleVibe = (vibe: string) => {
    if (selected.includes(vibe)) {
      setSelected(selected.filter(v => v !== vibe));
    } else {
      setSelected([...selected, vibe]);
    }
  };

  const addCustomVibe = () => {
    if (customVibe.trim()) {
        const newVibe = customVibe.trim();
        if (!selected.includes(newVibe)) {
            setSelected([...selected, newVibe]);
        }
        setCustomVibe('');
        setIsAdding(false);
    }
  };

  // Merge default vibes with any custom ones that might be in selected but not in default
  const allDisplayVibes = Array.from(new Set([...DEFAULT_VIBES, ...selected]));

  return (
    <div className="h-full flex flex-col p-6 bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 flex-1 flex flex-col">
            <div className="mt-8 mb-6 text-center">
                <div className="flex justify-center mb-4">
                     <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <Activity size={32} className="text-cyan-400" />
                     </div>
                </div>
                <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">VIBE CHECK</h1>
                <p className="text-gray-400 text-sm">What kind of energy are you looking for?</p>
            </div>

            {/* Selected Vibes Chips */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {selected.map(vibe => (
                        <button 
                            key={`selected-${vibe}`}
                            onClick={() => toggleVibe(vibe)}
                            className="flex items-center gap-1 pl-3 pr-2 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold"
                        >
                            {vibe} <X size={12} />
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar mb-4">
                <div className="grid grid-cols-2 gap-3">
                    {allDisplayVibes.map((vibe) => {
                        const isSelected = selected.includes(vibe);
                        return (
                            <button
                                key={vibe}
                                onClick={() => toggleVibe(vibe)}
                                className={`relative group overflow-hidden p-4 rounded-xl border transition-all duration-300 text-left flex items-center justify-between ${
                                    isSelected 
                                    ? 'bg-cyan-500 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                                    : 'bg-gray-900/50 border-white/10 hover:border-white/20'
                                }`}
                            >
                                <span className={`font-bold text-sm tracking-wide truncate pr-2 ${isSelected ? 'text-black' : 'text-gray-300'}`}>
                                    {vibe}
                                </span>
                                {isSelected && (
                                    <div className="bg-black/20 rounded-full p-1 flex-shrink-0">
                                        <Check size={12} className="text-black" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                    
                    {/* Add Custom Button */}
                    {!isAdding ? (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="p-4 rounded-xl border border-dashed border-white/20 hover:border-cyan-500/50 hover:bg-cyan-900/10 flex items-center justify-center gap-2 text-gray-400 hover:text-cyan-400 transition-all"
                        >
                            <Plus size={16} />
                            <span className="font-bold text-sm">Add Custom</span>
                        </button>
                    ) : (
                        <div className="col-span-2 p-1">
                             <div className="flex gap-2">
                                 <input 
                                    autoFocus
                                    type="text" 
                                    placeholder="e.g. Chess Buddy"
                                    className="flex-1 bg-gray-800 border border-cyan-500/50 rounded-xl px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    value={customVibe}
                                    onChange={(e) => setCustomVibe(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCustomVibe()}
                                 />
                                 <button 
                                    onClick={addCustomVibe}
                                    className="px-4 bg-cyan-600 rounded-xl text-white font-bold"
                                 >
                                    <Check size={16} />
                                 </button>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-auto pt-4">
                <Button 
                    fullWidth 
                    variant="primary" 
                    onClick={() => onContinue(selected)}
                    disabled={selected.length === 0}
                    className="h-16 text-lg"
                >
                    {selected.length === 0 ? "Select a Vibe" : `Find ${selected.length} Vibes`}
                </Button>
                <button 
                    onClick={() => onContinue([])} 
                    className="w-full py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                    Skip for now
                </button>
            </div>
        </div>
    </div>
  );
};