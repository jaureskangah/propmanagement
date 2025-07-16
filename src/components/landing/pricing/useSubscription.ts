
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export const useSubscription = (t: (key: string) => string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) {
      navigate("/dashboard");
      return;
    }

    if (!user) {
      toast({
        title: t('authRequired'),
        description: t('pleaseSignInToSubscribe'),
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: t('processing'),
        description: t('preparingPaymentSession'),
      });

      console.log('Creating checkout session for price:', priceId);
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: t('error'),
          description: error.message || t('failedToCreateSession'),
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        console.log('Opening checkout URL in new tab:', data.url);
        window.open(data.url, '_blank');
      } else {
        console.error('No checkout URL received');
        toast({
          title: t('error'),
          description: t('failedToCreateSessionNoUrl'),
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: t('error'),
        description: error.message || t('generalError'),
        variant: "destructive",
      });
    }
  };

  return { handleSubscribe };
};
