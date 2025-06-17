
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { MaintenanceRequests } from "../tabs/MaintenanceRequests";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export const MaintenanceRequestsSection = () => {
  const { t } = useLocale();
  const navigate = useNavigate();

  // Fetch maintenance requests
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['maintenance_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleViewAllRequests = () => {
    navigate('/maintenance-requests');
  };

  const handleRequestClick = () => {
    navigate('/maintenance-requests');
  };

  return (
    <div className="space-y-6">
      {/* Section Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Demandes de maintenance</h2>
          <p className="text-muted-foreground">
            Gérez toutes les demandes de maintenance
          </p>
        </div>
        <Button 
          onClick={() => navigate('/add-maintenance-request')}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Requests List */}
      <MaintenanceRequests 
        requests={requests}
        onRequestClick={handleRequestClick}
        onViewAllRequests={handleViewAllRequests}
      />
    </div>
  );
};
