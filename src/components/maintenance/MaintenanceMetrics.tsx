import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle } from "lucide-react";

interface MaintenanceMetricsProps {
  total: number;
  pending: number;
  resolved: number;
}

export const MaintenanceMetrics = ({ total, pending, resolved }: MaintenanceMetricsProps) => {
  const metrics = [
    {
      title: "Total Requests",
      value: total,
      icon: ClipboardList,
      color: "text-blue-500",
    },
    {
      title: "Pending",
      value: pending,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      title: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  return (
    <>
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};