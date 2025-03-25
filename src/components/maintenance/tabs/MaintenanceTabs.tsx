
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MaintenanceTable } from "../financials/tables/MaintenanceTable";
import { ExpensesTable } from "../financials/tables/ExpensesTable";
import { MaintenanceRequestItem } from "../request/MaintenanceRequestItem";
import { PreventiveMaintenance } from "../PreventiveMaintenance";
import { MaintenanceRequest } from "@/components/maintenance/types";
import { MaintenanceCharts } from "../charts/MaintenanceCharts";

interface FinancialData {
  propertyId: string;
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
  maintenance: {
    title: string;
    description: string;
    cost: number;
    date: string;
    status?: string;
    unit_number?: string;
    vendors?: {
      name: string;
      specialty: string;
    };
  }[];
}

interface MaintenanceTabsProps {
  propertyId: string;
  mockFinancialData: FinancialData;
  filteredRequests: MaintenanceRequest[];
  onRequestClick: (request: MaintenanceRequest) => void;
}

export const MaintenanceTabs = ({ 
  propertyId, 
  mockFinancialData,
  filteredRequests,
  onRequestClick
}: MaintenanceTabsProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState("requests");
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4">
        <TabsTrigger value="requests">{t('maintenanceRequests')}</TabsTrigger>
        <TabsTrigger value="preventive">{t('maintenanceTasks')}</TabsTrigger>
        <TabsTrigger value="analytics">{t('maintenanceAnalytics')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="requests">
        <Card>
          <CardHeader>
            <CardTitle>{t('maintenanceRequests')}</CardTitle>
            <CardDescription>
              {t('manageMaintenanceRequests')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {t('noMaintenanceRequests')}
                  </p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <MaintenanceRequestItem 
                    key={request.id} 
                    request={request} 
                    onClick={onRequestClick}
                  />
                ))
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm">
              {t('exportData')}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="preventive">
        <PreventiveMaintenance />
      </TabsContent>
      
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>{t('maintenanceAnalytics')}</CardTitle>
            <CardDescription>
              {t('maintenanceAnalyticsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tables de données financières d'abord */}
            <div className="space-y-6 mb-8">
              <MaintenanceTable maintenance={mockFinancialData.maintenance} />
              <ExpensesTable expenses={mockFinancialData.expenses} />
            </div>
            
            {/* Graphiques de maintenance en dessous */}
            <div className="space-y-6 mt-8 pt-4 border-t border-border/40">
              <h3 className="text-lg font-medium">{t('maintenanceRequestsTrends')}</h3>
              <MaintenanceCharts propertyId={propertyId} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {t('dataBasedOnMaintenanceRecords')}
            </div>
            <Button variant="outline" size="sm">
              {t('exportData')}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
