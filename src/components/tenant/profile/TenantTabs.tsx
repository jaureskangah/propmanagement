
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { DocumentGenerator } from "@/components/tenant/documents/DocumentGenerator";
import { Files, Wrench, FileText, CreditCard } from "lucide-react";
import { Tenant } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { TenantDocuments } from "@/components/tenant/TenantDocuments";
import { TenantPayments } from "@/components/tenant/TenantPayments";
import { TenantMaintenance } from "@/components/tenant/TenantMaintenance";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTenantPayments } from "@/hooks/useTenantPayments";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface TenantTabsProps {
  tenant: Tenant;
  isTenantUser: boolean;
  handleDataUpdate: () => void;
}

export const TenantTabs = ({ tenant, isTenantUser, handleDataUpdate }: TenantTabsProps) => {
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState('documents');
  const isMobile = useIsMobile();

  // Utiliser les mêmes hooks que les composants enfants pour obtenir les compteurs réels
  const { data: paymentsData = [] } = useTenantPayments(tenant.id);
  
  // Hook pour les documents du tenant
  const { data: documentsData = [] } = useQuery({
    queryKey: ["tenant_documents", tenant.id],
    queryFn: async () => {
      if (!tenant.id) return [];
      
      const { data, error } = await supabase
        .from('tenant_documents')
        .select('*')
        .eq('tenant_id', tenant.id);

      if (error) {
        console.error("Error fetching tenant documents:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!tenant.id,
  });

  // Hook pour les demandes de maintenance du tenant - données fraîches
  const { data: maintenanceData = [] } = useQuery({
    queryKey: ["tenant_maintenance", tenant.id],
    queryFn: async () => {
      if (!tenant.id) return [];
      
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('tenant_id', tenant.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching tenant maintenance:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!tenant.id,
  });

  // Calculate counts using real data from hooks
  const getCountForTab = (tabValue: string) => {
    switch (tabValue) {
      case 'documents':
        return documentsData.length;
      case 'payments':
        return paymentsData.length;
      case 'maintenance':
        return maintenanceData.length;
      case 'documentGenerator':
        return undefined; // No count needed for generator
      default:
        return undefined;
    }
  };

  const navItems = [
    { 
      name: t('documentsLabel'), 
      value: "documents", 
      icon: Files,
      count: getCountForTab('documents')
    },
    { 
      name: t('paymentsLabel'), 
      value: "payments", 
      icon: CreditCard,
      count: getCountForTab('payments')
    },
    { 
      name: "Maintenance", 
      value: "maintenance", 
      icon: Wrench,
      count: getCountForTab('maintenance')
    },
    { 
      name: t('documentGenerator.documentGenerator'), 
      value: "documentGenerator", 
      icon: FileText,
      count: getCountForTab('documentGenerator')
    },
  ];

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'documents':
        return (
          <TenantDocuments 
            documents={documentsData} 
            tenantId={tenant.id}
            onDocumentUpdate={handleDataUpdate}
            tenant={tenant}
          />
        );
      case 'payments':
        return (
          <TenantPayments 
            tenantId={tenant.id}
            onPaymentUpdate={handleDataUpdate}
          />
        );
      case 'maintenance':
        return (
          <TenantMaintenance 
            requests={maintenanceData}
            tenantId={tenant.id}
            onMaintenanceUpdate={handleDataUpdate}
          />
        );
      case 'documentGenerator': {
        // Ensure property name is present in the shape expected by the generator
        const props: any = (tenant as any)?.properties;
        let propertyName = '';
        if (props) {
          if (Array.isArray(props)) {
            propertyName = props[0]?.name || '';
          } else if (typeof props === 'object' && 'name' in props) {
            propertyName = String(props.name || '');
          }
        }
        const enrichedTenant: any = {
          ...tenant,
          // Normalize to a simple object with name so {{properties.name}} always resolves
          properties: { name: propertyName || '' },
          // Extra alias for our parser fallbacks
          property_name: propertyName || (tenant as any)?.property_name || ''
        };
        return <DocumentGenerator tenant={enrichedTenant} />;
      }
      default:
        return (
          <TenantDocuments 
            documents={documentsData} 
            tenantId={tenant.id}
            onDocumentUpdate={handleDataUpdate}
            tenant={tenant}
          />
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 pb-0">
        {/* TubelightNavBar */}
        <TubelightNavBar
          items={navItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-6"
        />
      </div>

      {/* Active Section Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[400px]"
      >
        <CardContent className={cn("p-0", isMobile ? "p-2" : "p-4")}>
          {renderActiveSection()}
        </CardContent>
      </motion.div>
    </Card>
  );
};
