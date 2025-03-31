
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ActivityCardProps {
  title: string;
  isLoading: boolean;
  children: ReactNode;
}

export const ActivityCard = ({ title, isLoading, children }: ActivityCardProps) => {
  if (isLoading) {
    return (
      <Card className="dark:bg-gray-900 border dark:border-gray-700">
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin dark:text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="font-sans dark:bg-gray-900 border dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
