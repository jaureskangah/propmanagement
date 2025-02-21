import { useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import AppSidebar from "@/components/AppSidebar";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { loading, isAuthenticated } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to auth page");
      navigate("/auth");
    }
  }, [loading, isAuthenticated, navigate]);

  // Données statiques pour les propriétés
  const mockPropertiesData = [
    {
      id: "1",
      name: "Résidence Les Oliviers",
      units: 12,
      created_at: "2024-01-15",
      type: "Appartement",
      address: "123 rue des Oliviers",
      user_id: "1" // Ajout du user_id requis
    },
    {
      id: "2",
      name: "Villa Méditerranée",
      units: 8,
      created_at: "2024-02-01",
      type: "Maison",
      address: "45 avenue de la Mer",
      user_id: "1" // Ajout du user_id requis
    }
  ];

  // Données statiques pour la maintenance
  const mockMaintenanceData = [
    {
      id: "m1",
      issue: "Fuite robinet cuisine",
      status: "Pending",
      created_at: "2024-03-15",
      priority: "Medium",
      title: "Fuite robinet cuisine", // Ajout du titre requis
      description: "Réparation urgente nécessaire"
    },
    {
      id: "m2",
      issue: "Problème chauffage",
      status: "In Progress",
      created_at: "2024-03-10",
      priority: "High",
      title: "Problème chauffage",
      description: "Le chauffage ne fonctionne pas"
    },
    {
      id: "m3",
      issue: "Peinture hall entrée",
      status: "Completed",
      created_at: "2024-03-05",
      priority: "Low",
      title: "Peinture hall entrée",
      description: "Rafraîchissement de la peinture"
    }
  ];

  // Données statiques pour les locataires avec tous les champs requis
  const mockTenantsData = [
    {
      id: "t1",
      name: "Marie Dupont",
      unit_number: "A101",
      created_at: "2024-01-20",
      rent_amount: 800,
      email: "marie.dupont@email.com",
      lease_start: "2024-01-01",
      lease_end: "2025-01-01",
      property_id: "1",
      user_id: "1",
      tenant_payments: [
        { 
          id: "p1", 
          amount: 800, 
          payment_date: "2024-03-01",
          status: "completed",
          tenant_id: "t1",
          created_at: "2024-03-01"
        },
        { 
          id: "p2", 
          amount: 800, 
          payment_date: "2024-02-01",
          status: "completed",
          tenant_id: "t1",
          created_at: "2024-02-01"
        }
      ],
      tenant_communications: []
    },
    {
      id: "t2",
      name: "Jean Martin",
      unit_number: "B202",
      created_at: "2024-02-01",
      rent_amount: 950,
      email: "jean.martin@email.com",
      lease_start: "2024-02-01",
      lease_end: "2025-02-01",
      property_id: "2",
      user_id: "1",
      tenant_payments: [
        { 
          id: "p3", 
          amount: 950, 
          payment_date: "2024-03-01",
          status: "completed",
          tenant_id: "t2",
          created_at: "2024-03-01"
        }
      ],
      tenant_communications: []
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 space-y-6 p-8 font-sans">
        <DashboardHeader 
          title="Dashboard" 
          trend={{
            value: 15,
            label: "vs last month"
          }}
        />
        <DashboardContent
          dateRange={{
            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          }}
          onDateRangeChange={() => {}}
          propertiesData={mockPropertiesData}
          maintenanceData={mockMaintenanceData}
          tenantsData={mockTenantsData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
