
'use client'
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { AuthCardBackground } from './auth/AuthCardBackground';
import { AuthCardBorder } from './auth/AuthCardBorder';
import { AuthCardContent } from './auth/AuthCardContent';

interface ModernAuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernAuthCard({ children, className }: ModernAuthCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // For 3D card effect - simplified for better scroll compatibility
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [1, -1]); // Further reduced rotation
  const rotateY = useTransform(mouseX, [-300, 300], [-1, 1]); // Further reduced rotation

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="w-full bg-black relative overflow-y-scroll" style={{ height: '120vh' }}>
      <AuthCardBackground />

      {/* Simple centered container */}
      <div className="flex items-center justify-center px-4 py-16" style={{ minHeight: '120vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md relative z-10"
        >
          <motion.div
            className="relative"
            style={{ 
              rotateX, 
              rotateY
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ z: 5 }}
          >
            <div className="relative group">
              <AuthCardBorder />
              <AuthCardContent className={className}>
                {children}
              </AuthCardContent>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
