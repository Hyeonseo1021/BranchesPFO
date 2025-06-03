import React from 'react';

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg shadow-md bg-white ${className}`}>{children}</div>;
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
