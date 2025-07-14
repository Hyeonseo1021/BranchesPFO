import React from 'react';

export function Button({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  className = ''
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'icon';
  className?: string;
}) {
  const base = 'rounded px-3 py-1 font-medium focus:outline-none';
  const variants: Record<string, string> = {
    default: 'bg-green-600 text-white hover:bg-green-700',
    outline: 'border border-green-600 text-green-600 hover:bg-green-100'
  };
  const sizes: Record<string, string> = {
    sm: 'text-sm',
    md: 'text-base',
    icon: 'p-2'
  };

  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
}
