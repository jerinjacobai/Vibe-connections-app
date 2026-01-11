import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    fullWidth = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "relative overflow-hidden rounded-xl font-outfit font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-[0_0_15px_rgba(112,0,255,0.4)] hover:shadow-[0_0_30px_rgba(112,0,255,0.6)] hover:scale-[1.02] border border-white/20",
        secondary: "bg-surface-light border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.1)]",
        danger: "bg-gradient-to-r from-red-600 to-red-900 border border-red-500/30 text-white shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(255,0,0,0.5)]",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
    };

    const sizes = "py-4 px-6 text-sm sm:text-base";

    return (
        <button
            className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${fullWidth ? 'w-full' : 'w-auto'} 
        ${sizes}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Shine Effect */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            )}

            <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : icon ? (
                    <span className="group-hover:scale-110 transition-transform">{icon}</span>
                ) : null}
                {children}
            </span>
        </button>
    );
};
