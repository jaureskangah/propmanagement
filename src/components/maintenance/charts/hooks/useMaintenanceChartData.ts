
import { useState, useEffect } from "react";
import { getMaintenanceChartData, MaintenanceChartData } from "../utils/chartUtils";

export const useMaintenanceChartData = (propertyId: string) => {
  const [data, setData] = useState<MaintenanceChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // In a real application, this would be an async API call
        const chartData = getMaintenanceChartData(propertyId);
        setData(chartData);
        setError(null);
      } catch (err) {
        console.error("Error fetching maintenance chart data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error fetching chart data"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [propertyId]);

  return { data, isLoading, error };
};
