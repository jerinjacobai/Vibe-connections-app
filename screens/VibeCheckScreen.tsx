import React, { useState, useEffect } from 'react';
import { Activity, Check, Plus, X, Users, User, UserCheck, Zap } from 'lucide-react';
import { NeonButton } from '../components/NeonButton';
import { GlassCard } from '../components/GlassCard';

interface VibeCheckScreenProps {
    onContinue: (selectedVibes: string[], genderInterest: string) => void;
    initialVibes?: string[];
    initialGender?: string;
}

const DEFAULT_VIBES = [
    "Smoke Buddy", "Pluck Buddy", "Tennis Buddy",
    "Football Buddy", "FIFA Buddy", "CSGO Buddy",
    "Gym Buddy", "Drinking Buddy", "Study Buddy",
    "Travel Buddy", "Hiking Buddy", "Cuddle Buddy",
    "Gaming Buddy", "Rave Buddy", "FWB", "Hookup Buddy"
];

const GENDERS = ["Male", "Female", "Other", "All"];

export const VibeCheckScreen: React.FC<VibeCheckScreenProps> = ({ onContinue, initialVibes = [], initialGender = 'All' }) => {
    const [selected, setSelected] = useState<string[]>(initialVibes);
    const [genderInterest, setGenderInterest] = useState<string>(initialGender);
    const [customVibe, setCustomVibe] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setSelected(initialVibes);
    }, [initialVibes]);

    useEffect(() => {
        if (initialGender) setGenderInterest(initialGender);
    }, [initialGender]);

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

    const allDisplayVibes = Array.from(new Set([...DEFAULT_VIBES, ...selected]));

    return (
        <div className="h-full flex flex-col p-6 bg-void text-white relative overflow-hidden font-outfit">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-neon-cyan/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-neon-purple/10 rounded-full blur-[100px] animate-pulse-slow delay-700 pointer-events-none"></div>

            <div className="relative z-10 flex-1 flex flex-col min-h-0">
                {/* Header */}
                <div className="mt-4 mb-6 text-center flex-shrink-0 animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-tr from-midnight to-black border border-white/10 shadow-[0_0_20px_rgba(0,240,255,0.15)] relative">
                        <div className="absolute inset-0 bg-neon-cyan/20 blur-lg animate-pulse"></div>
                        <Activity size={28} className="text-neon-cyan relative z-10" />
                    </div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter mb-1 drop-shadow-lg">
                        VIBE CHECK
                    </h1>
                    <p className="text-gray-400 text-sm font-medium tracking-wide">What kind of energy covers you?</p>
                </div>

                {/* Selected Vibes Chips */}
                {selected.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 justify-center flex-shrink-0 max-h-32 overflow-y-auto hide-scrollbar">
                        {selected.map(vibe => (
                            <button
                                key={`selected-${vibe}`}
                                onClick={() => toggleVibe(vibe)}
                                className="group flex items-center gap-1 pl-3 pr-2 py-1.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan text-xs font-bold transition-all hover:bg-neon-cyan/20 hover:scale-105 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                            >
                                {vibe} <X size={12} className="group-hover:text-white transition-colors" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-1 hide-scrollbar min-h-0 mask-image-b">

                    {/* Gender Selection */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 pl-1 flex items-center gap-2">
                            <Users size={12} /> Interest
                        </h3>
                        <div className="grid grid-cols-4 gap-3">
                            {GENDERS.map((gender, idx) => {
                                const isActive = genderInterest === gender;
                                return (
                                    <GlassCard
                                        key={gender}
                                        variant={isActive ? 'neon' : 'dark'}
                                        delay={idx}
                                        className={`cursor-pointer transition-all duration-300 ${isActive ? 'scale-105' : 'hover:bg-white/5'}`}
                                    >
                                        <div
                                            onClick={() => setGenderInterest(gender)}
                                            className="py-4 flex flex-col items-center gap-2"
                                        >
                                            <div className={`transition-colors duration-300 ${isActive ? 'text-neon-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]' : 'text-gray-400'}`}>
                                                {gender === 'All' ? <Users size={20} /> :
                                                    gender === 'Male' ? <User size={20} /> :
                                                        gender === 'Female' ? <UserCheck size={20} /> :
                                                            <Activity size={20} />
                                                }
                                            </div>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                                {gender}
                                            </span>
                                        </div>
                                    </GlassCard>
                                )
                            })}
                        </div>
                    </div>

                    {/* Vibes Selection */}
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 pl-1 flex items-center gap-2">
                        <Zap size={12} /> Select Vibes
                    </h3>
                    <div className="grid grid-cols-2 gap-3 pb-20">
                        {allDisplayVibes.map((vibe, idx) => {
                            const isSelected = selected.includes(vibe);
                            return (
                                <button
                                    key={vibe}
                                    onClick={() => toggleVibe(vibe)}
                                    className={`relative group overflow-hidden p-4 rounded-2xl border transition-all duration-300 text-left flex items-center justify-between ${isSelected
                                            ? 'bg-neon-cyan/20 border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                                            : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                                        }`}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <span className={`font-bold text-sm tracking-wide truncate pr-2 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                        {vibe}
                                    </span>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${isSelected
                                            ? 'bg-neon-cyan border-neon-cyan'
                                            : 'border-white/20 group-hover:border-white/40'
                                        }`}>
                                        {isSelected && <Check size={12} className="text-black" />}
                                    </div>
                                </button>
                            );
                        })}

                        {/* Add Custom Button */}
                        {!isAdding ? (
                            <button
                                onClick={() => setIsAdding(true)}
                                className="p-4 rounded-2xl border border-dashed border-white/20 hover:border-neon-purple/50 hover:bg-neon-purple/10 flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-all group"
                            >
                                <Plus size={16} className="group-hover:text-neon-purple transition-colors" />
                                <span className="font-bold text-sm">Add Custom</span>
                            </button>
                        ) : (
                            <GlassCard className="col-span-2 p-2" variant="light">
                                <div className="flex gap-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. Chess Buddy"
                                        className="flex-1 bg-transparent border-none px-4 text-white text-sm focus:outline-none placeholder-gray-500"
                                        value={customVibe}
                                        onChange={(e) => setCustomVibe(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addCustomVibe()}
                                    />
                                    <button
                                        onClick={addCustomVibe}
                                        className="px-4 bg-neon-purple rounded-xl text-white font-bold hover:bg-neon-purple/80 transition-colors shadow-[0_0_10px_rgba(112,0,255,0.4)]"
                                    >
                                        <Check size={16} />
                                    </button>
                                </div>
                            </GlassCard>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-20">
                    <NeonButton
                        fullWidth
                        variant="primary"
                        onClick={() => onContinue(selected, genderInterest)}
                        disabled={selected.length === 0}
                        className="h-14 text-lg mb-3 shadow-lg"
                        icon={<Zap size={20} />}
                    >
                        {selected.length === 0 ? "Select a Vibe" : `Find ${selected.length} Vibes`}
                    </NeonButton>
                    <button
                        onClick={() => onContinue([], 'All')}
                        className="w-full text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors pb-2"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
};