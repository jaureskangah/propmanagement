
import { useState, useEffect } from "react";

interface FinancesFilters {
  selectedPropertyId: string | null;
  selectedYear: number;
}

const SELECTED_PROPERTY_KEY = "finances_selected_property_id";
const SELECTED_YEAR_KEY = "finances_selected_year";

export const useFinancesFilters = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Load saved filters from localStorage on initial render
  useEffect(() => {
    const savedPropertyId = localStorage.getItem(SELECTED_PROPERTY_KEY);
    const savedYear = localStorage.getItem(SELECTED_YEAR_KEY);
    
    if (savedPropertyId) {
      setSelectedPropertyId(savedPropertyId);
    }
    
    if (savedYear) {
      setSelectedYear(parseInt(savedYear, 10));
    }
  }, []);

  // Save property ID to localStorage when it changes
  useEffect(() => {
    if (selectedPropertyId) {
      localStorage.setItem(SELECTED_PROPERTY_KEY, selectedPropertyId);
    }
  }, [selectedPropertyId]);
  
  // Save selected year to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(SELECTED_YEAR_KEY, selectedYear.toString());
  }, [selectedYear]);

  const handleYearChange = (year: number) => {
    console.log("Year changed to:", year);
    setSelectedYear(year);
  };

  const handlePropertyChange = (value: string) => {
    setSelectedPropertyId(value || null);
  };

  return {
    selectedPropertyId,
    selectedYear,
    handleYearChange,
    handlePropertyChange,
  };
};
