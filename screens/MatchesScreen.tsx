import React, { useState } from 'react';
import { Match, Message } from '../types';
import { ArrowLeft, Send, Sparkles, Star, X } from 'lucide-react';
import { generateIcebreaker } from '../services/geminiService';

interface MatchesScreenProps {
  matches: Match[];
}

export const MatchesScreen: React.FC<MatchesScreenProps> = ({ matches }) => {
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputText, setInputText] = useState('');
  const [loadingIcebreaker, setLoadingIcebreaker] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratedSession, setRatedSession] = useState(false);

  const handleOpenChat = async (match: Match) => {
    setActiveMatch(match);
    setShowRatingModal(false);
    setRatedSession(false);
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
    setInputText('');

    setTimeout(() => {
        const response: Message = {
            id: (Date.now() + 1).toString(),
            text: "That's interesting! Tell me more :)",
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
      if(!activeMatch) return;
      setLoadingIcebreaker(true);
      const help = await generateIcebreaker(activeMatch.profile);
      setInputText(help);
      setLoadingIcebreaker(false);
  }

  const handleRateUser = (score: number) => {
      if (!activeMatch) return;
      // Simulate API call to update rating
      const currentRating = activeMatch.profile.rating || 0;
      const count = activeMatch.profile.ratingCount || 1;
      
      // Calculate new weighted average
      const newRating = ((currentRating * count) + score) / (count + 1);
      activeMatch.profile.rating = Number(newRating.toFixed(1));
      activeMatch.profile.ratingCount = count + 1;
      
      setRatedSession(true);
      setShowRatingModal(false);
  };

  // Rating Modal
  const RatingModal = () => (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-white/10 p-6 rounded-3xl w-full max-w-xs text-center shadow-2xl">
              <div className="flex justify-end mb-2">
                  <button onClick={() => setShowRatingModal(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rate Vibes</h3>
              <p className="text-gray-400 text-sm mb-6">How was your interaction with {activeMatch?.profile.name}?</p>
              
              <div className="grid grid-cols-5 gap-2 mb-6">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button 
                        key={score}
                        onClick={() => handleRateUser(score)}
                        className={`aspect-square rounded-xl font-bold text-sm transition-all ${
                            score >= 8 ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white' : 
                            score >= 5 ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white' : 
                            'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                          {score}
                      </button>
                  ))}
              </div>
          </div>
      </div>
  );

  // Chat View
  if (activeMatch) {
    const currentMessages = messages[activeMatch.id] || [];

    return (
        <div className="flex flex-col h-full bg-black relative">
            {showRatingModal && <RatingModal />}
            
            {/* Glass Header */}
            <div className="flex items-center justify-between p-4 glass-heavy z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveMatch(null)} className="text-gray-300 hover:text-white transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden relative">
                        <img src={activeMatch.profile.imageUrl} alt={activeMatch.profile.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                            {activeMatch.profile.name}
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-yellow-400 border border-white/5">
                                <Star size={8} fill="currentColor" />
                                {activeMatch.profile.rating}
                            </div>
                        </h3>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-gray-400">Online</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={() => !ratedSession && setShowRatingModal(true)}
                    disabled={ratedSession}
                    className={`p-2 rounded-full border transition-all ${
                        ratedSession 
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50'
                    }`}
                >
                    <Star size={20} fill={ratedSession ? "currentColor" : "none"} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {currentMessages.length === 0 && (
                    <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-4">
                        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden mb-4 border-2 border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                             <img src={activeMatch.profile.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-gray-400 text-sm mb-6">You matched with <span className="text-white font-bold">{activeMatch.profile.name}</span>!</p>
                        <button 
                            onClick={handleAIHelp}
                            disabled={loadingIcebreaker}
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold uppercase tracking-wider rounded-full px-6 py-3 hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 mx-auto"
                        >
                            <Sparkles size={14} />
                            {loadingIcebreaker ? "Generating..." : "Break the Ice"}
                        </button>
                    </div>
                )}
                {currentMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === 'me' 
                            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-tr-sm shadow-md' 
                            : 'bg-gray-800/80 backdrop-blur text-gray-100 rounded-tl-sm border border-white/5'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/80 backdrop-blur-xl border-t border-white/10 safe-bottom fixed bottom-0 left-0 right-0 z-20">
                <div className="flex gap-3 max-w-lg mx-auto">
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-900/50 border border-white/10 rounded-full px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:bg-gray-900 transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                        onClick={handleSendMessage}
                        className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                    >
                        <Send size={20} className="ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // Matches List View
  return (
    <div className="h-full flex flex-col p-6 bg-black pb-24">
      <div className="flex justify-between items-end mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Connections</h1>
          <span className="text-cyan-400 font-bold text-sm bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">{matches.length} New</span>
      </div>
      
      {/* Horizontal Scroll - New Matches */}
      <div className="mb-8">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">New Matches</p>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
            {matches.length === 0 && (
                 <div className="flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-gray-800 rounded-2xl">
                     <p className="text-gray-500 text-sm">No matches yet.</p>
                     <p className="text-gray-600 text-xs mt-1">Get swiping!</p>
                 </div>
            )}
            {matches.map(match => (
                <div key={match.id} className="flex flex-col items-center gap-3 cursor-pointer group min-w-[70px]" onClick={() => handleOpenChat(match)}>
                    <div className="w-18 h-18 rounded-full p-[3px] bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full rounded-full border-2 border-black overflow-hidden relative">
                             <img src={match.profile.imageUrl} alt={match.profile.name} className="w-full h-full object-cover" />
                             <div className="absolute bottom-0 inset-x-0 bg-black/60 h-4 flex items-center justify-center gap-0.5">
                                 <Star size={6} className="text-yellow-400 fill-yellow-400" />
                                 <span className="text-[8px] font-bold text-white">{match.profile.rating}</span>
                             </div>
                        </div>
                    </div>
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">{match.profile.name}</span>
                </div>
            ))}
        </div>
      </div>

      {/* Vertical Scroll - Conversations */}
      <div className="flex-1 flex flex-col">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Conversations</p>
        <div className="flex-1 overflow-y-auto space-y-2">
            {matches.map(match => (
                <div 
                    key={match.id} 
                    className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-white/5 group"
                    onClick={() => handleOpenChat(match)}
                >
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-800 shadow-lg relative">
                        <img src={match.profile.imageUrl} alt={match.profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{match.profile.name}</h3>
                            <span className="text-[10px] text-gray-500 font-medium">2m ago</span>
                        </div>
                        <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                            {match.lastMessage || <span className="text-blue-500 italic">Start chatting...</span>}
                        </p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};