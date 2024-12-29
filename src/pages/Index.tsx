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
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-100 shadow-sm">
        <h1 className="text-3xl font-bold mb-2 text-slate-800">Welcome to RentEase</h1>
        <p className="text-slate-600">
          Here's an overview of your rental properties
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Total Properties"
          value={mockData.properties.toString()}
          icon={<Building2 className="h-4 w-4 text-blue-600" />}
        />
        <DashboardMetric
          title="Occupancy Rate"
          value={mockData.occupancyRate}
          icon={<Users className="h-4 w-4 text-blue-600" />}
        />
        <DashboardMetric
          title="Pending Payments"
          value={mockData.pendingPayments}
          icon={<DollarSign className="h-4 w-4 text-blue-600" />}
        />
        <DashboardMetric
          title="Maintenance Requests"
          value={mockData.maintenanceRequests.toString()}
          icon={<Wrench className="h-4 w-4 text-blue-600" />}
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Monthly Rent Collection</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockData.rentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;