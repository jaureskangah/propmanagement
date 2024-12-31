import { DashboardMetric } from "@/components/DashboardMetric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Building2,
  Users,
  Wrench,
  DollarSign,
} from "lucide-react";

const revenueData = [
  { month: "Jan", amount: 12000 },
  { month: "Feb", amount: 12500 },
  { month: "Mar", amount: 13200 },
  { month: "Apr", amount: 12800 },
  { month: "May", amount: 13500 },
  { month: "Jun", amount: 14200 },
];

const Dashboard = () => {
  console.log("Rendering Dashboard");
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Properties"
          value="12"
          icon={<Building2 className="h-4 w-4 text-blue-600" />}
          description="2 new this month"
        />
        <DashboardMetric
          title="Tenants"
          value="48"
          icon={<Users className="h-4 w-4 text-green-600" />}
          description="92% occupancy rate"
        />
        <DashboardMetric
          title="Maintenance"
          value="8"
          icon={<Wrench className="h-4 w-4 text-amber-600" />}
          description="3 pending requests"
        />
        <DashboardMetric
          title="Monthly Revenue"
          value="$14,200"
          icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
          description="+5% vs last month"
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New Tenant</p>
                <p className="text-sm text-muted-foreground">
                  Mary Smith - Apartment 4B
                </p>
              </div>
              <p className="text-sm text-muted-foreground">2h ago</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="rounded-full bg-emerald-100 p-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Payment Received</p>
                <p className="text-sm text-muted-foreground">
                  $850 - Studio 2A
                </p>
              </div>
              <p className="text-sm text-muted-foreground">5h ago</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
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
    </div>
  );
};

export default Dashboard;