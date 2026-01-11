import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'light' | 'dark' | 'neon';
    delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    variant = 'dark',
    delay = 0
}) => {
    const baseStyles = "relative overflow-hidden backdrop-blur-xl border border-white/10 rounded-3xl transition-all duration-300";

    const variants = {
        light: "bg-surface-light hover:bg-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]",
        dark: "bg-surface-dark hover:bg-black/80 shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
        neon: "bg-black/60 border-neon-cyan/30 shadow-[0_0_15px_rgba(0,240,255,0.15)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:border-neon-cyan/50"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    );
};
