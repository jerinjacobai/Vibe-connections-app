import React, { useState, useEffect, useRef } from 'react';
import { Match, Message, UserProfile } from '../types';
import { ArrowLeft, Send, Sparkles, Star, X, MoreVertical, Phone, Video } from 'lucide-react';
import { generateIcebreaker } from '../services/geminiService';
import { GlassCard } from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

interface MatchesScreenProps {
    matches: Match[];
    onUpdateMatch: (matchId: string, data: Partial<Match> | { profile: Partial<UserProfile> }) => void;
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({ matches, onUpdateMatch }) => {
    const [activeMatch, setActiveMatch] = useState<Match | null>(null);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [inputText, setInputText] = useState('');
    const [loadingIcebreaker, setLoadingIcebreaker] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [ratedSession, setRatedSession] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeMatch]);

    const handleOpenChat = async (match: Match) => {
        setActiveMatch(match);
        setShowRatingModal(false);
        setRatedSession(false);
        if (match.unread) {
            onUpdateMatch(match.id, { unread: false });
        }
    };

    const handleSendMessage = () => {
        if (!inputText.trim() || !activeMatch) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'me',
            timestamp: new Date()
        };

        setMessages(prev => ({
            ...prev,
            [activeMatch.id]: [...(prev[activeMatch.id] || []), newMessage]
        }));

        onUpdateMatch(activeMatch.id, {
            lastMessage: inputText,
            timestamp: new Date().toISOString()
        });

        setInputText('');

        setTimeout(() => {
            const response: Message = {
                id: (Date.now() + 1).toString(),
                text: "That's a vibe! Tell me more ✨",
                sender: 'them',
                timestamp: new Date()
            };
            setMessages(prev => ({
                ...prev,
                [activeMatch.id]: [...(prev[activeMatch.id] || []), response]
            }));
        }, 2000);
    };

    const handleAIHelp = async () => {
        if (!activeMatch) return;
        setLoadingIcebreaker(true);
        const help = await generateIcebreaker(activeMatch.profile);
        setInputText(help);
        setLoadingIcebreaker(false);
    }

    const handleRateUser = (score: number) => {
        if (!activeMatch) return;
        const currentRating = activeMatch.profile.rating || 0;
        const count = activeMatch.profile.ratingCount || 1;
        const newRating = ((currentRating * count) + score) / (count + 1);

        onUpdateMatch(activeMatch.id, {
            profile: {
                rating: Number(newRating.toFixed(1)),
                ratingCount: count + 1
            }
        });

        setRatedSession(true);
        setShowRatingModal(false);
    };

    // Chat View
    if (activeMatch) {
        const currentMessages = messages[activeMatch.id] || [];
        const currentActiveMatch = matches.find(m => m.id === activeMatch.id) || activeMatch;

        return (
            <div className="flex flex-col h-full bg-void relative font-outfit">
                {/* Detail/Rating Modal Overlay */}
                <AnimatePresence>
                    {showRatingModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
                        >
                            <GlassCard className="w-full max-w-sm p-6" variant="neon">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-white tracking-wide">Vibe Check</h3>
                                    <button onClick={() => setShowRatingModal(false)}><X className="text-gray-400 hover:text-white" /></button>
                                </div>
                                <p className="text-gray-300 text-sm mb-6 text-center">How was the energy with {activeMatch.profile.name}?</p>
                                <div className="grid grid-cols-5 gap-3">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                        <button
                                            key={score}
                                            onClick={() => handleRateUser(score)}
                                            className={`aspect-square rounded-xl font-bold text-sm transition-all border border-white/10 ${score >= 8 ? 'bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]' :
                                                    score >= 5 ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white' :
                                                        'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white'
                                                }`}
                                        >
                                            {score}
                                        </button>
                                    ))}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-midnight/80 backdrop-blur-xl border-b border-white/5 z-20 shadow-lg">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveMatch(null)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors">
                            <ArrowLeft size={20} className="text-gray-300" />
                        </button>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden">
                                <img src={currentActiveMatch.profile.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-cyan rounded-full border-2 border-midnight shadow-[0_0_8px_rgba(0,240,255,0.8)]"></div>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base leading-tight flex items-center gap-2">
                                {currentActiveMatch.profile.name}
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-yellow-500/10 rounded text-[10px] text-yellow-400 border border-yellow-500/20">
                                    <Star size={8} fill="currentColor" />
                                    {currentActiveMatch.profile.rating}
                                </div>
                            </h3>
                            <span className="text-xs text-neon-cyan/80 font-medium tracking-wide">Online Now</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <Phone size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <Video size={18} />
                        </button>
                        <button
                            onClick={() => !ratedSession && setShowRatingModal(true)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${ratedSession ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24 hide-scrollbar">
                    {currentMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center mt-12 animate-in fade-in zoom-in duration-500">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-neon-cyan blur-2xl opacity-20 animate-pulse"></div>
                                <div className="w-24 h-24 rounded-full border-2 border-neon-cyan p-1 relative z-10">
                                    <img src={currentActiveMatch.profile.imageUrl} alt="" className="w-full h-full rounded-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-2 border border-white/10">
                                    <Sparkles size={20} className="text-neon-purple" />
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 text-center max-w-[200px]">
                                You matched with <span className="text-white font-bold">{currentActiveMatch.profile.name}</span>! <br /> Their vibe matches yours.
                            </p>
                            <button
                                onClick={handleAIHelp}
                                disabled={loadingIcebreaker}
                                className="group relative px-6 py-3 bg-white/5 hover:bg-white/10 border border-neon-cyan/30 rounded-full transition-all hover:scale-105 active:scale-95"
                            >
                                <div className="absolute inset-0 bg-neon-cyan/5 blur-lg group-hover:bg-neon-cyan/10 transition-colors"></div>
                                <span className="relative z-10 flex items-center gap-2 text-xs font-bold text-neon-cyan tracking-wider uppercase">
                                    <Sparkles size={14} className={loadingIcebreaker ? "animate-spin" : ""} />
                                    {loadingIcebreaker ? "Scanning..." : "Generate Icebreaker"}
                                </span>
                            </button>
                        </div>
                    )}

                    {currentMessages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${msg.sender === 'me'
                                    ? 'bg-gradient-to-br from-neon-blue to-neon-purple text-white rounded-tr-sm shadow-neon-purple/20'
                                    : 'bg-white/5 backdrop-blur-md border border-white/5 text-gray-100 rounded-tl-sm shadow-black/20'
                                }`}>
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent pb-6">
                    <GlassCard className="flex items-center gap-2 p-1.5 rounded-full" variant="light">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-none px-4 py-3 text-white placeholder-gray-500 focus:outline-none text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="w-10 h-10 rounded-full bg-neon-cyan text-black flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                        >
                            <Send size={18} className="ml-0.5" />
                        </button>
                    </GlassCard>
                </div>
            </div>
        );
    }

    // List View
    return (
        <div className="h-full flex flex-col p-6 bg-void font-outfit pb-24 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[80%] h-[30%] bg-neon-purple/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <h1 className="text-3xl font-black italic tracking-tighter text-white">CONNECTIONS</h1>
                    <div className="flex items-center gap-2 px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                        <span className="text-neon-cyan font-bold text-xs">{matches.filter(m => m.unread).length} New</span>
                    </div>
                </div>

                {/* Horizontal Scroll - New Matches */}
                <div className="mb-8">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 pl-1">Recent Vibes</p>
                    <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
                        {matches.length === 0 && (
                            <div className="w-full py-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-gray-500">
                                <Sparkles className="mb-2 opacity-50" />
                                <span className="text-xs font-medium">No matches yet</span>
                            </div>
                        )}
                        {matches.map(match => (
                            <div key={match.id} className="flex flex-col items-center gap-3 cursor-pointer group min-w-[72px] snap-start" onClick={() => handleOpenChat(match)}>
                                <div className="relative">
                                    <div className="w-[72px] h-[72px] rounded-full p-[2px] bg-gradient-to-tr from-neon-cyan via-neon-blue to-neon-purple group-hover:scale-105 transition-transform duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                                        <div className="w-full h-full rounded-full border-2 border-black overflow-hidden relative bg-gray-900">
                                            <img src={match.profile.imageUrl} alt={match.profile.name} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    {match.unread && (
                                        <div className="absolute top-0 right-0 w-4 h-4 bg-neon-cyan rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_rgba(0,240,255,1)]"></div>
                                    )}
                                </div>
                                <span className={`text-xs font-bold tracking-wide transition-colors ${match.unread ? 'text-white' : 'text-gray-500 group-hover:text-neon-cyan'}`}>
                                    {match.profile.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vertical Scroll - Messages */}
                <div className="flex-1 flex flex-col min-h-0">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 pl-1">Messages</p>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 hide-scrollbar pb-4">
                        {matches.map((match, i) => (
                            <GlassCard
                                key={match.id}
                                variant={match.unread ? "neon" : "dark"}
                                className={`cursor-pointer transition-all border border-white/5 hover:border-white/10 group active:scale-95`}
                                onClick={() => handleOpenChat(match)}
                                delay={i}
                            >
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden relative shadow-lg">
                                        <img src={match.profile.imageUrl} alt={match.profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className={`font-bold text-base truncate pr-2 ${match.unread ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                                {match.profile.name}
                                            </h3>
                                            <span className="text-[10px] text-gray-600 font-medium whitespace-nowrap">2m ago</span>
                                        </div>
                                        <p className={`text-sm truncate transition-colors ${match.unread ? 'text-neon-cyan font-medium' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                            {match.lastMessage || <span className="opacity-50 italic">Start the conversation...</span>}
                                        </p>
                                    </div>
                                    {match.unread && (
                                        <div className="w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_rgba(0,240,255,1)]"></div>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};