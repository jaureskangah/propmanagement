
import { useState } from "react";

export const useFinancesFilters = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const handlePropertyChange = (propertyId: string) => {
    setSelectedPropertyId(propertyId === "none" ? null : propertyId);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  return {
    selectedPropertyId,
    selectedYear,
    handlePropertyChange,
    handleYearChange,
  };
};
