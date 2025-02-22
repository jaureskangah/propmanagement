
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, HomeIcon, DollarSign, Download, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface AdminMetrics {
  total_users: number;
  active_users: number;
  total_revenue: number;
  total_properties: number;
  total_tenants: number;
  metric_date: string;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      console.log("Fetching admin metrics...");
      const { data, error } = await supabase
        .from('admin_metrics')
        .select('*')
        .order('metric_date', { ascending: true });

      if (error) throw error;

      const formattedData = data?.map(metric => ({
        ...metric,
        metric_date: format(new Date(metric.metric_date), 'dd/MM/yyyy'),
        total_revenue: Number(metric.total_revenue)
      })) || [];

      console.log("Fetched metrics:", formattedData);
      setMetrics(formattedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Convertir les données en CSV
      const headers = ["Date", "Total Users", "Active Users", "Total Revenue", "Total Properties", "Total Tenants"];
      const csvData = [
        headers.join(","),
        ...metrics.map(metric => [
          metric.metric_date,
          metric.total_users,
          metric.active_users,
          metric.total_revenue,
          metric.total_properties,
          metric.total_tenants
        ].join(","))
      ].join("\n");

      // Créer et télécharger le fichier
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `admin_metrics_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Les données ont été téléchargées avec succès",
      });
    } catch (err) {
      console.error('Error downloading data:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/admin`;
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Lien copié",
        description: "Le lien vers le tableau de bord a été copié dans le presse-papiers",
      });
    } catch (err) {
      console.error('Error sharing:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du partage",
        variant: "destructive",
      });
    }
  };

  const latestMetrics = metrics[metrics.length - 1] || {
    total_users: 0,
    active_users: 0,
    total_revenue: 0,
    total_properties: 0,
    total_tenants: 0
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2" />
            Télécharger les données
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2" />
            Partager
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetrics.total_users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetrics.active_users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestMetrics.total_properties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${latestMetrics.total_revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="metric_date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="total_users" 
                  stroke="#8884d8" 
                  name="Total Users"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="active_users" 
                  stroke="#82ca9d" 
                  name="Active Users"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="metric_date" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Total Revenue"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="total_revenue" 
                  stroke="#82ca9d" 
                  name="Total Revenue"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
