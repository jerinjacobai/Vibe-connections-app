import React, { useState } from 'react';
import { Activity, Smartphone, Globe, Lock, AlertCircle, CheckSquare, Square } from 'lucide-react';
import { Button } from '../components/Button';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'age' | 'auth'>('age');
  const [birthYear, setBirthYear] = useState('');
  const [confirmed18, setConfirmed18] = useState(false);
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  const handleAgeVerify = () => {
    if (!confirmed18) {
      setError("Please confirm you are 18+.");
      return;
    }

    const year = parseInt(birthYear);
    if (!year || year < 1900 || year > currentYear) {
      setError("Please enter a valid year.");
      return;
    }
    
    const age = currentYear - year;
    if (age < 18) {
      setError("You must be 18+ to use Vibe.");
      return;
    }

    setStep('auth');
    setError('');
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden bg-black">
      
      {/* Background Ambience - Blue/Cyan */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-blue-900/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-cyan-900/30 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        
        {/* Simple Brand Logo */}
        <div className="mb-12 animate-in fade-in zoom-in duration-700 flex flex-col items-center">
           <div className="relative mb-6">
             <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20"></div>
             <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-900 to-black border border-white/10 flex items-center justify-center shadow-2xl">
                <Activity size={40} className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
             </div>
           </div>
           <h1 className="text-5xl font-bold text-white tracking-tight">vibe</h1>
           <p className="text-xs font-semibold text-blue-400 tracking-[0.4em] uppercase mt-3">Find your frequency</p>
        </div>

        {step === 'age' ? (
           <div className="w-full glass p-8 rounded-3xl border border-white/5 animate-in slide-in-from-bottom-8 duration-500">
               <div className="flex justify-center mb-6 text-blue-500">
                  <Lock size={32} />
               </div>
               <h2 className="text-xl font-bold text-white mb-2 text-center">Strictly 18+</h2>
               <p className="text-gray-400 text-center mb-6 text-sm leading-relaxed">
                   Vibe is for adults only. Verification required.
               </p>
               
               <div className="space-y-4">
                 <input 
                    type="number" 
                    placeholder="YYYY" 
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-center text-white text-lg tracking-widest focus:border-cyan-500 focus:outline-none transition-colors"
                 />
                 
                 <div 
                   onClick={() => setConfirmed18(!confirmed18)}
                   className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors"
                 >
                   {confirmed18 ? (
                     <CheckSquare className="text-cyan-500 flex-shrink-0" size={20} />
                   ) : (
                     <Square className="text-gray-500 flex-shrink-0" size={20} />
                   )}
                   <span className="text-xs text-gray-300 select-none">
                     I confirm that I am at least 18 years old and agree to the Terms of Service.
                   </span>
                 </div>
                 
                 <Button fullWidth variant="primary" onClick={handleAgeVerify}>
                    Verify Age
                 </Button>
               </div>
               {error && (
                 <div className="flex items-center justify-center gap-2 mt-4 text-red-500">
                    <AlertCircle size={14} />
                    <p className="text-xs uppercase font-bold tracking-wider">{error}</p>
                 </div>
               )}
           </div>
        ) : (
           <div className="w-full space-y-4 px-4 animate-in fade-in duration-500">
               <div className="text-center mb-8">
                   <p className="text-lg text-white font-medium mb-1">Welcome.</p>
                   <p className="text-gray-500 text-sm">Sign in to start matching.</p>
               </div>

               <Button fullWidth variant="secondary" onClick={onLogin} className="justify-center h-14 text-sm font-bold">
                   <Globe size={18} />
                   Continue with Google
               </Button>
               
               <Button fullWidth variant="glass" onClick={onLogin} className="justify-center h-14 text-sm font-bold bg-white/5 border-white/10 hover:bg-white/10">
                   <Smartphone size={18} />
                   Use Phone Number
               </Button>

               <p className="text-center text-[10px] text-gray-600 mt-8 leading-normal max-w-xs mx-auto">
                    By entering, you agree to our Terms & Privacy Policy.
               </p>
           </div>
        )}

      </div>
    </div>
  );
};