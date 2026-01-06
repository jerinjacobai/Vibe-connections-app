import React, { useState } from 'react';
import { Activity, Smartphone, Globe, Lock } from 'lucide-react';
import { Button } from '../components/Button';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'age' | 'auth'>('age');
  const [error, setError] = useState('');

  const handleAgeVerify = () => setStep('auth');
  const handleUnderage = () => setError("Strictly 18+ only.");

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
        <div className="mb-16 animate-in fade-in zoom-in duration-700 flex flex-col items-center">
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
               <h2 className="text-xl font-bold text-white mb-2 text-center">Age Verification</h2>
               <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">
                   Vibe is an 18+ community for casual connections. Please verify your age.
               </p>
               
               <div className="space-y-3">
                 <Button fullWidth variant="primary" onClick={handleAgeVerify}>
                    I am 18 or older
                 </Button>
                 <Button fullWidth variant="glass" onClick={handleUnderage} className="text-gray-400 hover:text-white">
                    Exit App
                 </Button>
               </div>
               {error && <p className="text-red-500 mt-4 text-center text-xs uppercase font-bold tracking-wider">{error}</p>}
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