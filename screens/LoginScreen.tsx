import React, { useState } from 'react';
import { Activity, Smartphone, Globe, Lock, AlertCircle, CheckSquare, Square, Mail } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'age' | 'auth'>('age');
  const [birthYear, setBirthYear] = useState('');
  const [confirmed18, setConfirmed18] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auth State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

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

  const handleAuth = async () => {
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin();
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
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
            <div className="text-center mb-6">
              <p className="text-lg text-white font-medium mb-1">{isSignUp ? 'Create Account' : 'Welcome Back'}</p>
              <p className="text-gray-500 text-sm">Sign in to sync your vibes.</p>
            </div>

            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <Button fullWidth variant="primary" onClick={handleAuth} disabled={loading} className="justify-center h-12 text-sm font-bold">
              {loading ? <Activity className="animate-spin" /> : <Mail size={18} />}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>

            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-xs text-gray-500 hover:text-white transition-colors mt-4"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>

            {error && (
              <div className="flex items-center justify-center gap-2 mt-4 text-red-500">
                <AlertCircle size={14} />
                <p className="text-xs uppercase font-bold tracking-wider">{error}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};