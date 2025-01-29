import { useState } from "react";
import { Communication } from "@/types/tenant";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useSelectCommunication = (onCommunicationUpdate?: () => void) => {
  const [selectedComm, setSelectedComm] = useState<Communication | null>(null);
  const { toast } = useToast();

  const handleCommunicationSelect = async (comm: Communication) => {
    try {
      const { data, error } = await supabase
        .from('tenant_communications')
        .select('*')
        .eq('id', comm.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching communication details:', error);
        toast({
          title: "Error",
          description: "Failed to load communication details. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        console.log('No communication found with ID:', comm.id);
        toast({
          title: "Not Found",
          description: "The selected communication could not be found.",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched communication details:', data);
      setSelectedComm(data);

      if (data.status === 'unread') {
        const { error: updateError } = await supabase
          .from('tenant_communications')
          .update({ status: 'read' })
          .eq('id', comm.id);

        if (updateError) {
          console.error('Error updating message status:', updateError);
        } else {
          onCommunicationUpdate?.();
        }
      }
    } catch (error) {
      console.error('Error in handleCommunicationSelect:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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