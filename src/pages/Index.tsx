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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-slate-200/60 shadow-lg">
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="text-blue-600 font-medium">
          ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-xs text-slate-500">Monthly rent collection</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F0FB] via-[#E5DEFF] to-[#F1F0FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-slate-200/60 shadow-lg transition-all duration-300 hover:shadow-xl">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
            Welcome to RentEase
          </h1>
          <p className="text-slate-600 text-lg">
            Here's an overview of your rental properties
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardMetric
            title="Total Properties"
            value={mockData.properties.toString()}
            icon={<Building2 className="h-4 w-4 text-rose-500" />}
            description="Active rental properties"
          />
          <DashboardMetric
            title="Occupancy Rate"
            value={mockData.occupancyRate}
            icon={<Users className="h-4 w-4 text-emerald-500" />}
            description="Current occupancy"
          />
          <DashboardMetric
            title="Pending Payments"
            value={mockData.pendingPayments}
            icon={<DollarSign className="h-4 w-4 text-blue-500" />}
            description="Outstanding rent"
          />
          <DashboardMetric
            title="Maintenance Requests"
            value={mockData.maintenanceRequests.toString()}
            icon={<Wrench className="h-4 w-4 text-amber-500" />}
            description="Open requests"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl border border-slate-200/60 shadow-lg transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 text-slate-800">Monthly Rent Collection</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={mockData.rentData}
                className="animate-fade-in"
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#C7D2FE" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e2e8f0" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b"
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                  animationBegin={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;