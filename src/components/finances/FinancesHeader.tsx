
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocale } from "@/components/providers/LocaleProvider";
import { YearFilter } from "./YearFilter";
import { FileBarChart, Loader2 } from "lucide-react";

interface FinancesHeaderProps {
  properties: any[];
  isLoadingProperties: boolean;
  selectedPropertyId: string | null;
  selectedYear: number;
  onPropertyChange: (value: string) => void;
  onYearChange: (year: number) => void;
}

export const FinancesHeader = ({
  properties,
  isLoadingProperties,
  selectedPropertyId,
  selectedYear,
  onPropertyChange,
  onYearChange,
}: FinancesHeaderProps) => {
  const { t } = useLocale();

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-background to-muted/30 backdrop-blur-sm p-6 rounded-xl border border-border/40 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileBarChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('Finances')}
              </h1>
              <p className="text-muted-foreground mt-1">{t('financialOverview')}</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <Card className="w-full md:w-64">
              <CardContent className="p-3">
                {isLoadingProperties ? (
                  <div className="flex items-center justify-center h-9 gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">{t('loading', { fallback: 'Loading...' })}</span>
                  </div>
                ) : (
                  <Select 
                    value={selectedPropertyId || ""} 
                    onValueChange={onPropertyChange}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder={t('selectProperty')} />
                    </SelectTrigger>
                    <SelectContent>
                      {properties?.length ? (
                        properties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          {t('noPropertiesAvailable')}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>
            
            <Card className="w-full sm:w-auto">
              <CardContent className="p-3">
                <YearFilter selectedYear={selectedYear} onYearChange={onYearChange} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
