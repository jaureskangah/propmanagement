
"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.ComponentProps<"div"> {}
function Card({ className, ...props }: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}
Card.displayName = "Card";

interface CardContentProps extends React.ComponentProps<"div"> {}
function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
  );
}
CardContent.displayName = "CardContent";

interface StatsCardProps {
  name: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: React.ReactNode;
  index: number;
  total: number;
}

export function StatsCard({ 
  name, 
  value, 
  change, 
  changeType = "neutral", 
  icon,
  index,
  total 
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "rounded-none border-0 shadow-none py-0 transition-all duration-300 hover:bg-muted/50",
        index === 0 && "rounded-l-xl",
        index === total - 1 && "rounded-r-xl"
      )}
    >
      <CardContent className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 p-4 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          {name}
        </div>
        {change && (
          <div
            className={cn(
              "text-xs font-medium",
              changeType === "positive"
                ? "text-green-800 dark:text-green-400"
                : changeType === "negative"
                ? "text-red-800 dark:text-red-400"
                : "text-muted-foreground"
            )}
          >
            {change}
          </div>
        )}
        <div className="w-full flex-none text-3xl font-medium tracking-tight text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
}

export function StatsGrid({ children }: StatsGridProps) {
  return (
    <div className="mx-auto grid grid-cols-1 gap-px rounded-xl bg-border sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
