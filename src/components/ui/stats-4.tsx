
"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as RechartsPrimitive from "recharts";
import { ExternalLink } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Chart related components and types
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  );
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  );

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .join("
")}
}
`
          )
          .join("
"),
      }}
    />
  );
};

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"];
}) {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

interface StatsCardProps {
  name: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  percentageChange?: string;
  changeType?: "positive" | "negative" | "neutral";
  chartData: Array<{ value: number }>;
  color: string;
  className?: string;
}

const sanitizeName = (name: string) => {
  return name
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_")
    .toLowerCase();
};

export function StatsCard({ 
  name, 
  value, 
  icon, 
  change, 
  percentageChange, 
  changeType = "neutral", 
  chartData, 
  color,
  className 
}: StatsCardProps) {
  const sanitizedName = sanitizeName(name);
  const gradientId = `gradient-${sanitizedName}`;

  return (
    <Card className={cn("p-0 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg", className)}>
      <CardContent className="p-4 pb-0">
        <div>
          <dt className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            {icon}
            {name}
          </dt>
          <div className="flex items-baseline justify-between">
            <dd className="text-2xl font-bold text-foreground">
              {value}
            </dd>
            {change && (
              <dd className="flex items-center space-x-1 text-sm">
                <span
                  className={cn(
                    changeType === "positive"
                      ? "text-green-600 dark:text-green-500"
                      : changeType === "negative"
                      ? "text-red-600 dark:text-red-500"
                      : "text-muted-foreground"
                  )}
                >
                  {change}
                  {percentageChange && ` (${percentageChange})`}
                </span>
              </dd>
            )}
          </div>
        </div>

        <div className="mt-3 h-12 overflow-hidden">
          <ChartContainer
            className="w-full h-full"
            config={{
              [name]: {
                label: name,
                color: color,
              },
            }}
          >
            <RechartsPrimitive.AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id={gradientId}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={color}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <RechartsPrimitive.XAxis dataKey="date" hide={true} />
              <RechartsPrimitive.Area
                dataKey="value"
                stroke={color}
                fill={`url(#${gradientId})`}
                fillOpacity={0.4}
                strokeWidth={1.5}
                type="monotone"
              />
            </RechartsPrimitive.AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
