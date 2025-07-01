
import React from "react";
import { TubelightNavBar } from "@/components/ui/tubelight-navbar";
import { Clock, CheckCircle, XCircle, Calendar, Mail } from "lucide-react";

interface InvitationFiltersProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
  invitationsCount?: {
    all: number;
    pending: number;
    expired: number;
    completed: number;
    cancelled: number;
  };
}

export const InvitationFilters = ({ 
  activeTab, 
  onTabChange, 
  children,
  invitationsCount = {
    all: 0,
    pending: 0,
    expired: 0,
    completed: 0,
    cancelled: 0
  }
}: InvitationFiltersProps) => {
  const navItems = [
    { 
      name: "Toutes", 
      value: "all", 
      icon: Mail,
      count: invitationsCount.all 
    },
    { 
      name: "En attente", 
      value: "pending", 
      icon: Clock,
      count: invitationsCount.pending 
    },
    { 
      name: "Expirées", 
      value: "expired", 
      icon: Calendar,
      count: invitationsCount.expired 
    },
    { 
      name: "Acceptées", 
      value: "completed", 
      icon: CheckCircle,
      count: invitationsCount.completed 
    },
    { 
      name: "Annulées", 
      value: "cancelled", 
      icon: XCircle,
      count: invitationsCount.cancelled 
    },
  ];

  return (
    <div>
      <TubelightNavBar
        items={navItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
};
