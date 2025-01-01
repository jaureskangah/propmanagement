import { Users, DollarSign, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentActivity = () => {
  return (
    <Card className="font-sans">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
            <div className="rounded-full bg-blue-100 p-2">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">New Tenant</p>
              <p className="text-sm text-muted-foreground">
                John Smith - Apartment 4B
              </p>
            </div>
            <p className="text-sm text-muted-foreground">2h ago</p>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
            <div className="rounded-full bg-emerald-100 p-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Payment Received</p>
              <p className="text-sm text-muted-foreground">
                850€ - Studio 2A
              </p>
            </div>
            <p className="text-sm text-muted-foreground">5h ago</p>
          </div>
          <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
            <div className="rounded-full bg-amber-100 p-2">
              <Wrench className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Maintenance Completed</p>
              <p className="text-sm text-muted-foreground">
                Plumbing - Apartment 1C
              </p>
            </div>
            <p className="text-sm text-muted-foreground">1d ago</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};