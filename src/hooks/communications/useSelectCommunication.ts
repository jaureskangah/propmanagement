import { useState } from "react";
import { Communication } from "@/types/tenant";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useSelectCommunication = (onCommunicationUpdate?: () => void) => {
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
  const { toast } = useToast();

  const handleCommunicationSelect = async (comm: Communication | null) => {
    // Si comm est null, on réinitialise juste la sélection
    if (!comm) {
      setSelectedComm(null);
      return;
    }

    try {
      console.log("Fetching communication details for ID:", comm.id);
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('id', comm.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching communication details:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails du message. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        console.log('No communication found with ID:', comm.id);
        toast({
          title: "Non trouvé",
          description: "Le message sélectionné n'a pas été trouvé.",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched communication details:', data);
      setSelectedComm(data);

      // Marquer comme lu si nécessaire
      if (data.status === 'unread') {
        console.log("Marking communication as read:", comm.id);
        const { error: updateError } = await supabase
          .from('tenant_communications')
          .update({ status: 'read' })
          .eq('id', comm.id);

        if (updateError) {
          console.error('Error updating message status:', updateError);
        } else {
          console.log("Communication marked as read successfully");
          onCommunicationUpdate?.();
        }
      }
    } catch (error) {
      console.error('Error in handleCommunicationSelect:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return {
    selectedComm,
    setSelectedComm,
    handleCommunicationSelect
  };
};