
import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

export function useSupabaseError() {
  const { toast } = useToast();

  const handleError = (error: PostgrestError | Error | null, customMessage?: string) => {
    if (!error) return;

    console.error("Erreur Supabase:", error);

    let errorMessage = customMessage || "Une erreur inattendue s'est produite";

    // Gestion des erreurs Supabase spécifiques
    if ('code' in error) {
      switch (error.code) {
        case "42501":
          errorMessage = "Vous n'avez pas les permissions nécessaires pour cette action";
          break;
        case "23505":
          errorMessage = "Cette entrée existe déjà";
          break;
        case "23503":
          errorMessage = "Cette opération n'est pas possible car elle est liée à d'autres données";
          break;
        case "PGRST116":
          errorMessage = "La session a expiré, veuillez vous reconnecter";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
    }

    toast({
      title: "Erreur",
      description: errorMessage,
      variant: "destructive",
    });

    return errorMessage;
  };

  return { handleError };
}
