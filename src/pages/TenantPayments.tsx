
import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { TenantPayment } from "@/types/tenant";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const TenantPayments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<TenantPayment[]>([]);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTenantId();
    }
  }, [user]);

  useEffect(() => {
    if (tenantId) {
      fetchPayments();
    }
  }, [tenantId]);

  const fetchTenantId = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('tenant_profile_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setTenantId(data.id);
      } else {
        toast({
          title: "Non lié",
          description: "Votre compte n'est pas lié à un profil locataire",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre identifiant de locataire",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('tenant_payments')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos paiements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'payé':
        return 'bg-green-500 hover:bg-green-600';
      case 'pending':
      case 'en attente':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'late':
      case 'en retard':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="flex">
      <AppSidebar isTenant={true} />
      <div className="flex-1 container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Mes paiements</CardTitle>
            <CardDescription>Historique de vos paiements</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : !tenantId ? (
              <p className="text-center text-muted-foreground py-8">
                Votre compte n'est pas encore lié à un profil locataire.
              </p>
            ) : payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Aucun paiement n'a été trouvé.
              </p>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{payment.description || "Paiement de loyer"}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(payment.payment_date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold">{payment.amount.toLocaleString()} €</p>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantPayments;
