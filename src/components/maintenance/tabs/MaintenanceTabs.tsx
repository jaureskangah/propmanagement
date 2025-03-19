
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "../charts/ChartContainer";
import { MaintenanceTable } from "../financials/tables/MaintenanceTable";
import { ExpensesTable } from "../financials/tables/ExpensesTable";
import { MaintenanceRequestItem } from "../request/MaintenanceRequestItem";
import { PreventiveMaintenance } from "../PreventiveMaintenance";
import { MaintenanceRequest } from "@/components/maintenance/types";

interface FinancialData {
  propertyId: string;
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
  maintenance: {
    description: string;
    cost: number;
    date: string;
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
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
        <TabsTrigger value="requests">{t('maintenanceRequests')}</TabsTrigger>
        <TabsTrigger value="preventive">{t('maintenanceTasks')}</TabsTrigger>
        <TabsTrigger value="financial">{t('financials')}</TabsTrigger>
        <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
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
      
      <TabsContent value="financial">
        <div className="grid grid-cols-1 gap-4">
          <MaintenanceTable maintenance={mockFinancialData.maintenance} />
          <ExpensesTable expenses={mockFinancialData.expenses} />
        </div>
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
            <ChartContainer propertyId={propertyId} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
