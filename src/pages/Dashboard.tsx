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
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const revenueData = [
  { month: "Jan", amount: 12000, expenses: 8000 },
  { month: "Feb", amount: 12500, expenses: 7800 },
  { month: "Mar", amount: 13200, expenses: 8200 },
  { month: "Apr", amount: 12800, expenses: 7900 },
  { month: "May", amount: 13500, expenses: 8100 },
  { month: "Jun", amount: 14200, expenses: 8300 },
];

const Dashboard = () => {
  console.log("Rendering Dashboard");
  
  return (
    <div className="space-y-6 p-8 font-sans">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">+12% ce mois</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Propriétés"
          value="12"
          icon={<Building2 className="h-4 w-4 text-blue-600" />}
          description={
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>2 nouvelles ce mois</span>
            </div>
          }
        />
        <DashboardMetric
          title="Locataires"
          value="48"
          icon={<Users className="h-4 w-4 text-indigo-600" />}
          description={
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>92% taux d'occupation</span>
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
              <span>3 requêtes en attente</span>
            </div>
          }
        />
        <DashboardMetric
          title="Revenus Mensuels"
          value="14 200 €"
          icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
          description={
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>+5% vs mois dernier</span>
            </div>
          }
        />
      </div>

      {/* Revenue Chart */}
      <Card className="font-sans">
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <CardTitle className="text-lg font-medium">Revenus & Dépenses</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Revenus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-200" />
              <span className="text-sm text-muted-foreground">Dépenses</span>
            </div>
          </div>
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
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#93C5FD" stopOpacity={0} />
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
                  tickFormatter={(value) => `${value}€`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value) => [`${value}€`]}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#93C5FD"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="font-sans">
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nouveau Locataire</p>
                <p className="text-sm text-muted-foreground">
                  Marie Dupont - Appartement 4B
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Il y a 2h</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
              <div className="rounded-full bg-emerald-100 p-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Paiement Reçu</p>
                <p className="text-sm text-muted-foreground">
                  850€ - Studio 2A
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Il y a 5h</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50">
              <div className="rounded-full bg-amber-100 p-2">
                <Wrench className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Maintenance Terminée</p>
                <p className="text-sm text-muted-foreground">
                  Plomberie - Appartement 1C
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Il y a 1j</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;