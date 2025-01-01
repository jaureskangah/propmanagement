import { DashboardMetric } from "@/components/DashboardMetric";
import { Building2, Users, Wrench, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  console.log("Rendering Dashboard");
  
  return (
    <div className="space-y-6 p-8 font-sans">
      <DashboardHeader />

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Properties"
          value="12"
          icon={<Building2 className="h-4 w-4 text-blue-600" />}
          description={
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>2 new this month</span>
            </div>
          }
        />
        <DashboardMetric
          title="Tenants"
          value="48"
          icon={<Users className="h-4 w-4 text-indigo-600" />}
          description={
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>92% occupancy rate</span>
            </div>
          }
        />
        <DashboardMetric
          title="Maintenance"
          value="8"
          icon={<Wrench className="h-4 w-4 text-amber-600" />}
          description={
            <div className="flex items-center gap-1 text-red-600">
              <ArrowDownRight className="h-3 w-3" />
              <span>3 pending requests</span>
            </div>
          }
        />
        <DashboardMetric
          title="Monthly Revenue"
          value="14,200 €"
          icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
          description={
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+5% vs last month</span>
            </div>
          }
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
