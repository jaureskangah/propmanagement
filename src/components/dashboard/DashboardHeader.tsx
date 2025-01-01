import { TrendingUp } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1">
        <TrendingUp className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-600">+12% this month</span>
      </div>
    </div>
  );
};