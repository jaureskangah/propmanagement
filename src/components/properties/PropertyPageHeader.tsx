
import React from "react";
import { Building, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PropertyPageHeaderProps {
  propertiesCount: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  setIsAddModalOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const PropertyPageHeader = ({
  propertiesCount,
  showFilters,
  setShowFilters,
  setIsAddModalOpen,
  isMobile
}: PropertyPageHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
            <Building className="h-6 w-6 md:h-7 md:w-7 text-primary/80" />
            {t('propertiesManagement')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('propertiesSubtitle')}
          </p>
        </div>
        <div className="flex items-center justify-between lg:justify-end gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1.5">
            <Info className="h-4 w-4 mr-1.5" />
            {propertiesCount} {propertiesCount === 1 ? t('property') : t('properties')}
          </Badge>
          
          {isMobile ? (
            <Button 
              size="sm" 
              className="flex items-center gap-1.5" 
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              {t('addProperty')}
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="flex items-center gap-1.5" 
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              {t('addProperty')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyPageHeader;
