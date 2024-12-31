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
  ArrowUp,
  ArrowDown,
} from "lucide-react";

const revenueData = [
  { month: "Jan", amount: 12000 },
  { month: "Fév", amount: 12500 },
  { month: "Mar", amount: 13200 },
  { month: "Avr", amount: 12800 },
  { month: "Mai", amount: 13500 },
  { month: "Juin", amount: 14200 },
];

const Dashboard = () => {
  console.log("Rendering Dashboard");
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardMetric
          title="Propriétés"
          value="12"
          icon={<Building2 className="h-4 w-4 text-blue-600" />}
          description="2 nouvelles ce mois-ci"
        />
        <DashboardMetric
          title="Locataires"
          value="48"
          icon={<Users className="h-4 w-4 text-green-600" />}
          description="Taux d'occupation 92%"
        />
        <DashboardMetric
          title="Maintenance"
          value="8"
          icon={<Wrench className="h-4 w-4 text-amber-600" />}
          description="3 requêtes en attente"
        />
        <DashboardMetric
          title="Revenus mensuels"
          value="14 200 €"
          icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
          description="+5% vs mois dernier"
        />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus mensuels</CardTitle>
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
                  tickFormatter={(value) => `${value}€`}
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
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="rounded-full bg-blue-100 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Nouveau locataire</p>
                <p className="text-sm text-muted-foreground">
                  Marie Dupont - Appartement 4B
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Il y a 2h</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="rounded-full bg-emerald-100 p-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Paiement reçu</p>
                <p className="text-sm text-muted-foreground">
                  850€ - Studio 2A
                </p>
              </div>
              <p className="text-sm text-muted-foreground">Il y a 5h</p>
            </div>
            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div className="rounded-full bg-amber-100 p-2">
                <Wrench className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Maintenance terminée</p>
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