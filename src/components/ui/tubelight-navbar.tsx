
"use client"

import React from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  value: string
  icon?: LucideIcon
  count?: number | string
}

interface TubelightNavBarProps {
  items: NavItem[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export function TubelightNavBar({ items, activeTab, onTabChange, className }: TubelightNavBarProps) {
  return (
    <motion.div 
      className={cn("flex justify-center mb-6", className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-1 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg overflow-x-auto mobile-tabs-scroll mobile-full-width max-w-full">
        {items.map((item, index) => {
          const Icon = item.icon
          const isActive = activeTab === item.value

          return (
            <motion.button
              key={item.value}
              onClick={() => onTabChange(item.value)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-3 sm:px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-1 sm:gap-2 mobile-touch-target whitespace-nowrap",
                "text-foreground/80 hover:text-primary hover:bg-primary/5",
                isActive && "text-primary",
              )}
            >
              {Icon && (
                <motion.div
                  animate={isActive ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </motion.div>
              )}
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sm:hidden text-xs">{item.name.split(' ')[0]}</span>
              {item.count !== undefined && (
                <motion.span 
                  className={cn(
                    "ml-1 px-2 py-0.5 text-xs rounded-full transition-colors duration-200",
                    isActive 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.count}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="tubelight"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <motion.div 
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </motion.div>
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
