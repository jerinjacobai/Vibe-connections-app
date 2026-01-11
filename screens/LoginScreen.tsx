import React, { useState } from 'react';
import { Mail, Lock, CheckSquare, Square, Zap, ChevronRight } from 'lucide-react';
import { NeonButton } from '../components/NeonButton';
import { FloatingInput } from '../components/FloatingInput';
import { GlassCard } from '../components/GlassCard';
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

  // Add success state
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // If Confirm Email is disabled in Supabase, we get a session immediately
        if (data.session) {
          onLogin();
        } else {
          setSuccessMsg('Confirmation link sent to your email!');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin();
      }
    } catch (e: any) {
      let msg = e.message;
      // Map common Supabase errors to helpful messages
      if (msg.includes('Email logins are disabled')) {
        msg = "Email Login is disabled in Supabase. Go to Auth > Providers > Enable Email.";
      } else if (msg.includes('Invalid login credentials')) {
        msg = "Wrong email or password. Please try again.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 bg-void text-white overflow-hidden font-outfit">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-neon-purple/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-neon-cyan/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.com/noise.svg')] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">

        {/* Brand Logo */}
        <div className="mb-12 flex flex-col items-center animate-float">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-neon-cyan blur-2xl opacity-40 animate-pulse"></div>
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-midnight to-black border border-white/10 flex items-center justify-center relative z-10 shadow-2xl ring-1 ring-white/20">
              <Zap size={48} className="text-neon-cyan fill-neon-cyan/20 drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
            </div>

            {/* Orbiting particles */}
            <div className="absolute inset-0 animate-spin opacity-50" style={{ animationDuration: '10s' }}>
              <div className="absolute -top-1 left-1/2 w-2 h-2 bg-neon-purple rounded-full blur-[1px]"></div>
            </div>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-lg glitch-text">
            vibe
          </h1>
          <p className="text-xs font-bold text-neon-cyan tracking-[0.6em] uppercase mt-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
            Find your frequency
          </p>
        </div>

        <GlassCard className="w-full p-8" variant="dark">
          {step === 'age' ? (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
              <div className="flex justify-center mb-6 text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,153,0.5)]">
                <Lock size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 text-center tracking-tight">Access Restricted</h2>
              <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed font-light">
                Vibe is an exclusive community for adults only.<br />Please verify your age to continue.
              </p>

              <FloatingInput
                label="Birth Year (YYYY)"
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                type="number"
                placeholder="1999"
                className="text-center"
              />

              <div
                onClick={() => setConfirmed18(!confirmed18)}
                className="flex items-start gap-4 cursor-pointer p-4 rounded-xl hover:bg-white/5 transition-colors group mb-6 border border-transparent hover:border-white/5"
              >
                {confirmed18 ? (
                  <CheckSquare className="text-neon-cyan flex-shrink-0 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" size={24} />
                ) : (
                  <Square className="text-gray-600 flex-shrink-0 group-hover:text-gray-400 transition-colors" size={24} />
                )}
                <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors leading-relaxed">
                  I verify that I am at least 18 years of age and I agree to the <span className="text-white underline decoration-white/30">Terms of Service</span>.
                </span>
              </div>

              <NeonButton fullWidth onClick={handleAgeVerify} icon={<ChevronRight size={18} />}>
                Enter Vibe
              </NeonButton>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right-4 fade-in duration-500 space-y-6">
              <div className="text-center mb-8">
                <p className="text-xl text-white font-bold mb-1 tracking-tight">
                  {isSignUp ? 'Join the Frequency' : 'Welcome Back'}
                </p>
                <p className="text-gray-500 text-sm font-light">
                  {isSignUp ? 'Create an account to start matching.' : 'Sign in to sync your connections.'}
                </p>
              </div>

              <div className="space-y-4">
                <FloatingInput
                  label="Email Address"
                  icon={<Mail size={18} />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
                <FloatingInput
                  label="Password"
                  icon={<Lock size={18} />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                />
              </div>

              <NeonButton
                fullWidth
                onClick={handleAuth}
                isLoading={loading}
                variant="primary"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </NeonButton>

              <div className="flex items-center justify-between pt-4">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="px-4 text-xs text-gray-600 font-medium">OR</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors py-2 font-medium tracking-wide flex items-center justify-center gap-2 group"
              >
                {isSignUp ? 'Already member?' : 'New here?'}
                <span className="text-neon-cyan group-hover:underline decoration-neon-cyan/50 underline-offset-4">
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </span>
              </button>
            </div>
          )}

        </GlassCard>

        {error && (
          <div className="absolute -bottom-24 left-0 right-0 animate-slide-up bg-black/50 rounded-2xl backdrop-blur">
            <GlassCard className="p-4 flex items-center justify-center gap-3 border-red-500/30 bg-red-500/10">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <p className="text-xs uppercase font-bold tracking-wider text-red-400">{error}</p>
            </GlassCard>
          </div>
        )}

        {successMsg && (
          <div className="absolute -bottom-24 left-0 right-0 animate-slide-up bg-black/50 rounded-2xl backdrop-blur">
            <GlassCard className="p-4 flex items-center justify-center gap-3 border-green-500/30 bg-green-500/10">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-xs uppercase font-bold tracking-wider text-green-400">{successMsg}</p>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};