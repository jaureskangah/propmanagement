import React, { useState } from "react";
import { Property } from "@/hooks/useProperties";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, DollarSign, Building2, Calendar, MapPin } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";

interface PropertyTableViewProps {
  properties: Property[];
  selectedIds: string[];
  onToggleSelection: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewFinancials: (id: string) => void;
  occupancyData: Record<string, number>;
}

const PropertyTableView = ({
  properties,
  selectedIds,
  onToggleSelection,
  onEdit,
  onDelete,
  onViewFinancials,
  occupancyData
}: PropertyTableViewProps) => {
  const { t } = useLocale();
  const [sortField, setSortField] = useState<keyof Property>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fonction pour traduire le type de propriété
  const getTranslatedPropertyType = (type: string) => {
    const typeMap: Record<string, string> = {
      'Apartment': t('apartment'),
      'House': t('house'), 
      'Condo': t('condo'),
      'Office': t('propertyOffice'),
      'Commercial Space': t('commercialspace')
    };
    return typeMap[type] || type;
  };

  const handleSort = (field: keyof Property) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProperties = [...properties].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const getOccupancyBadge = (propertyId: string, totalUnits: number) => {
    const occupancyRate = occupancyData[propertyId] || 0;
    const variant = occupancyRate > 80 ? 'default' : occupancyRate > 50 ? 'secondary' : 'destructive';
    
    return (
      <Badge variant={variant} className="text-xs">
        {occupancyRate}%
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border rounded-lg overflow-hidden bg-background"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedIds.length === properties.length && properties.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    properties.forEach(p => {
                      if (!selectedIds.includes(p.id)) {
                        onToggleSelection(p.id);
                      }
                    });
                  } else {
                    selectedIds.forEach(id => onToggleSelection(id));
                  }
                }}
              />
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {t('propertyName')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('address')}
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('address')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('type')}
            >
              {t('type')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50 text-center"
              onClick={() => handleSort('units')}
            >
              {t('units')}
            </TableHead>
            <TableHead className="text-center">{t('occupation')}</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('created_at')}
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('createdAt')}
              </div>
            </TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProperties.map((property) => (
            <TableRow 
              key={property.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(property.id)}
                  onCheckedChange={() => onToggleSelection(property.id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  {property.image_url && (
                    <img
                      src={property.image_url}
                      alt={property.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  {property.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {property.address}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getTranslatedPropertyType(property.type)}</Badge>
              </TableCell>
              <TableCell className="text-center font-medium">
                {property.units}
              </TableCell>
              <TableCell className="text-center">
                {getOccupancyBadge(property.id, property.units)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(property.created_at).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewFinancials(property.id)}
                    className="h-8 w-8 p-0"
                  >
                    <DollarSign className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(property.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(property.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default PropertyTableView;