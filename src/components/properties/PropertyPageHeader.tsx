
import React from "react";
import { Info, Plus, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyPageHeaderProps {
  propertiesCount: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  setIsAddModalOpen: (isOpen: boolean) => void;
}

const PropertyPageHeader = ({
  propertiesCount,
  showFilters,
  setShowFilters,
  setIsAddModalOpen
}: PropertyPageHeaderProps) => {
  const { t } = useLocale();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-2"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {t('propertiesManagement')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('propertiesSubtitle')}
          </p>
        </div>
        <div className="flex items-center justify-end gap-4">
          <Badge variant="secondary" className="text-sm px-3 py-1.5 shadow-sm">
            <Info className="h-4 w-4 mr-1.5 text-primary" />
            {propertiesCount} {propertiesCount === 1 ? t('property') : t('properties')}
          </Badge>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="hidden md:flex"
            >
              <Filter className="h-4 w-4 mr-2" />
              {t('filters')}
            </Button>
            <Button 
              size="sm" 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-primary hover:bg-primary/90 transition-all duration-200 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addProperty')}
            </Button>
          </div>
        </div>
      </div>
      <Separator className="my-6" />
    </motion.div>
  );
};

export default PropertyPageHeader;
