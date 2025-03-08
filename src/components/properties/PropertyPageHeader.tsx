
import React, { useState } from "react";
import { Building, Info, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PropertyPageHeaderProps {
  propertiesCount: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  setIsAddModalOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PropertyPageHeader = ({
  propertiesCount,
  showFilters,
  setShowFilters,
  setIsAddModalOpen,
  isMobile,
  searchQuery,
  setSearchQuery
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
      
      <div className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('searchProperties')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={`transition-colors duration-200 ${
            showFilters ? "bg-primary/10 text-primary" : ""
          }`}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PropertyPageHeader;
