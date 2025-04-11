
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin, Wrench, ChevronDown, ChevronUp, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaintenanceTableProps {
  maintenance: {
    title: string;
    description: string;
    cost: number;
    date: string;
    status?: string;
    unit_number?: string;
    properties?: {
      name: string;
    };
    vendors?: {
      name: string;
      specialty: string;
    };
  }[];
}

export const MaintenanceTable = ({ maintenance }: MaintenanceTableProps) => {
  const { t } = useLocale();
  const [showAll, setShowAll] = useState(false);
  
  const getStatusColor = (status?: string) => {
    switch(status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Limit displayed maintenance items to 5 if showAll is false
  const displayedMaintenance = showAll ? maintenance : maintenance.slice(0, 5);
  const hasMoreItems = maintenance.length > 5;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('maintenanceTitle')}</CardTitle>
        <CardDescription>{t('maintenanceAndRepairs')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('columnTitle')}</TableHead>
              <TableHead>{t('columnCost')}</TableHead>
              <TableHead className="hidden sm:table-cell">{t('columnDate')}</TableHead>
              <TableHead>Propriété / Unité</TableHead>
              <TableHead className="hidden lg:table-cell">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedMaintenance.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  Aucune intervention de maintenance trouvée
                </TableCell>
              </TableRow>
            ) : (
              displayedMaintenance.map((item, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span>{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">${item.cost?.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {item.properties?.name && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">{item.properties.name}</span>
                        </div>
                      )}
                      {item.unit_number && (
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-indigo-500" />
                          <span className="text-sm">Unité {item.unit_number}</span>
                        </div>
                      )}
                      {!item.properties?.name && !item.unit_number && (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {item.status ? (
                      <Badge variant="outline" className={`${getStatusColor(item.status)}`}>
                        {item.status}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {hasMoreItems && (
        <CardFooter className="flex justify-center pb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
          >
            {showAll ? (
              <>
                <span>Voir moins</span>
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Voir tout</span> 
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
