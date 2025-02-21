
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import AppSidebar from "@/components/AppSidebar";

const Dashboard = () => {
  // Données statiques pour les propriétés
  const mockPropertiesData = [
    {
      id: "1",
      name: "Résidence Les Oliviers",
      units: 12,
      created_at: "2024-01-15",
      type: "Appartement",
      address: "123 rue des Oliviers"
    },
    {
      id: "2",
      name: "Villa Méditerranée",
      units: 8,
      created_at: "2024-02-01",
      type: "Maison",
      address: "45 avenue de la Mer"
    }
  ];

  // Données statiques pour la maintenance
  const mockMaintenanceData = [
    {
      id: "m1",
      issue: "Fuite robinet cuisine",
      status: "Pending",
      created_at: "2024-03-15",
      priority: "Medium"
    },
    {
      id: "m2",
      issue: "Problème chauffage",
      status: "In Progress",
      created_at: "2024-03-10",
      priority: "High"
    },
    {
      id: "m3",
      issue: "Peinture hall entrée",
      status: "Completed",
      created_at: "2024-03-05",
      priority: "Low"
    }
  ];

  // Données statiques pour les locataires
  const mockTenantsData = [
    {
      id: "t1",
      name: "Marie Dupont",
      unit_number: "A101",
      created_at: "2024-01-20",
      rent_amount: 800,
      tenant_payments: [
        { id: "p1", amount: 800, payment_date: "2024-03-01" },
        { id: "p2", amount: 800, payment_date: "2024-02-01" }
      ]
    },
    {
      id: "t2",
      name: "Jean Martin",
      unit_number: "B202",
      created_at: "2024-02-01",
      rent_amount: 950,
      tenant_payments: [
        { id: "p3", amount: 950, payment_date: "2024-03-01" }
      ]
    }
  ];

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
