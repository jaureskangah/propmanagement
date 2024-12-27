import { DashboardMetric } from "@/components/DashboardMetric";
import { Building2, DollarSign, Users, Wrench } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = {
  properties: 5,
  occupancyRate: "92%",
  pendingPayments: "$3,450",
  maintenanceRequests: 3,
  rentData: [
    { month: "Jan", amount: 12000 },
    { month: "Feb", amount: 12000 },
    { month: "Mar", amount: 15000 },
    { month: "Apr", amount: 15000 },
    { month: "May", amount: 15000 },
    { month: "Jun", amount: 18000 },
  ],
};

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to RentEase</h1>
        <p className="text-muted-foreground">
          Here's an overview of your rental properties
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Total Properties"
          value={mockData.properties.toString()}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardMetric
          title="Occupancy Rate"
          value={mockData.occupancyRate}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardMetric
          title="Pending Payments"
          value={mockData.pendingPayments}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardMetric
          title="Maintenance Requests"
          value={mockData.maintenanceRequests.toString()}
          icon={<Wrench className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="h-[400px]">
        <h2 className="text-xl font-semibold mb-4">Monthly Rent Collection</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData.rentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#1E40AF" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;