
"use client"

import React from "react"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  value: string
  icon?: LucideIcon
  count?: number
}

interface TubelightNavBarProps {
  items: NavItem[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
}

export function TubelightNavBar({ items, activeTab, onTabChange, className }: TubelightNavBarProps) {
  return (
    <div className={cn("flex justify-center mb-6", className)}>
      <div className="flex items-center gap-1 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.value

          return (
            <button
              key={item.value}
              onClick={() => onTabChange(item.value)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-2",
                "text-foreground/80 hover:text-primary",
                isActive && "text-primary",
              )}
            >
              {Icon && <Icon size={16} strokeWidth={2.5} />}
              <span>{item.name}</span>
              {item.count !== undefined && (
                <span className={cn(
                  "ml-1 px-2 py-0.5 text-xs rounded-full",
                  isActive 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {item.count}
                </span>
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
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
