import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
    label,
    icon,
    value,
    className = '',
    onFocus,
    onBlur,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value && value.toString().length > 0;
    const active = isFocused || hasValue;

    return (
        <div className={`relative mb-6 ${className}`}>
            <motion.div
                animate={{
                    borderColor: isFocused ? '#00F0FF' : 'rgba(255,255,255,0.1)',
                    backgroundColor: isFocused ? 'rgba(0,240,255,0.05)' : 'rgba(255,255,255,0.03)'
                }}
                className="flex items-center w-full rounded-xl border transition-colors duration-300 overflow-hidden"
            >
                {icon && (
                    <div className={`pl-4 ${isFocused ? 'text-neon-cyan' : 'text-gray-500'} transition-colors`}>
                        {icon}
                    </div>
                )}

                <div className="relative flex-1">
                    <motion.label
                        initial={false}
                        animate={{
                            y: active ? -8 : 0,
                            fontSize: active ? 10 : 14,
                            color: isFocused ? '#00F0FF' : active ? '#9CA3AF' : '#6B7280'
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none font-medium z-10 origin-left"
                    >
                        {label}
                    </motion.label>

                    <input
                        {...props}
                        value={value}
                        onFocus={(e) => {
                            setIsFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            onBlur?.(e);
                        }}
                        className="w-full bg-transparent text-white px-4 pt-5 pb-2 text-base outline-none z-0"
                    />
                </div>
            </motion.div>
        </div>
    );
};
