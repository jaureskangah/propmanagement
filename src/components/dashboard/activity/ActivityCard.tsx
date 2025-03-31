
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ActivityCardProps {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
}

export function ActivityCard({ title, children, isLoading = false, className }: ActivityCardProps) {
  return (
    <Card className={cn("transition-all duration-300 animate-fade-in dark:bg-gray-800 dark:border-gray-700", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary dark:text-blue-400" />
          </div>
        ) : children}
      </CardContent>
    </Card>
  );
}
