import React from 'react';
import { Variants } from 'framer-motion';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  // Client component will handle the motion
  return <div className={className}>{children}</div>;
}

export function Logo({ className = "", name = "AURA" }: { className?: string; name?: string }) {
  return (
    <div className={`font-black tracking-tighter ${className} flex items-center`}>
      <span className="text-[var(--primary)] text-[28px] uppercase">{name}</span>
    </div>
  );
}


