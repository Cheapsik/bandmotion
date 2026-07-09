import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  className = '',
  ...props
}: ButtonProps) {
  const sizes = {
    sm: 'h-10 px-4 text-[13px]',
    md: 'h-12 px-6 text-[14px]',
    lg: 'h-[52px] px-8 text-[15px]',
  };

  const variants = {
    primary: 'btn-cta',
    secondary: 'btn-secondary',
    ghost: 'text-white/45 hover:text-white/70 bg-transparent border-transparent shadow-none',
  };

  const base =
    'inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-[0.98] disabled:opacity-35 disabled:pointer-events-none select-none tracking-wide';

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
