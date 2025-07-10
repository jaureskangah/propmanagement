import React from 'react';
import { cn } from "@/lib/utils";

interface AuthCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCardContent({ children, className }: AuthCardContentProps) {
  return (
    <div className={cn("relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/[0.05] shadow-2xl", className)}>
      {/* Subtle card inner patterns */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}