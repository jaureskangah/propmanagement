import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "sonner";

export interface DashboardPreferences {
  id?: string;
  widget_order: string[];
  hidden_sections: string[];
  custom_filters: Record<string, any>;
}

export const useDashboardPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["dashboard-preferences"],
    queryFn: async () => {
      console.log("Fetching dashboard preferences...");
      const { data, error } = await supabase
        .from("dashboard_preferences")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching preferences:", error);
        throw error;
      }

      console.log("Dashboard preferences:", data);
      return data as DashboardPreferences | null;
    },
    enabled: !!user,
  });

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: Partial<DashboardPreferences>) => {
      if (!user) throw new Error("No user logged in");

      const { data: existing } = await supabase
        .from("dashboard_preferences")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("dashboard_preferences")
          .update(newPreferences)
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("dashboard_preferences")
          .insert([{ user_id: user.id, ...newPreferences }]);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard-preferences"] });
      toast.success("Dashboard preferences updated");
    },
    onError: (error) => {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update dashboard preferences");
    },
  });

  return {
    preferences: preferences || {
      widget_order: [],
      hidden_sections: [],
      custom_filters: {},
    },
    isLoading,
    updatePreferences,
  };
};