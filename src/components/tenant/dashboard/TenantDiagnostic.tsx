
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, CheckCircle, AlertCircle, User, Database, Link } from 'lucide-react';

interface DiagnosticInfo {
  profileExists: boolean;
  isTenantUser: boolean;
  linkedTenantId: string | null;
  tenantExists: boolean;
  tenantEmail: string | null;
  linkingIssue: string | null;
}

export const TenantDiagnostic = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<DiagnosticInfo | null>(null);

  const runDiagnostic = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log("=== RUNNING TENANT DIAGNOSTIC ===");
      
      // 1. Vérifier le profil utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, is_tenant_user')
        .eq('id', user.id)
        .maybeSingle();

      // 2. Chercher un locataire lié
      const { data: linkedTenant } = await supabase
        .from('tenants')
        .select('id, email, name')
        .eq('tenant_profile_id', user.id)
        .maybeSingle();

      // 3. Chercher un locataire par email
      const { data: tenantByEmail } = await supabase
        .from('tenants')
        .select('id, email, name, tenant_profile_id')
        .eq('email', user.email)
        .maybeSingle();

      const diagnostic: DiagnosticInfo = {
        profileExists: !!profile,
        isTenantUser: profile?.is_tenant_user || user.user_metadata?.is_tenant_user || false,
        linkedTenantId: linkedTenant?.id || null,
        tenantExists: !!tenantByEmail,
        tenantEmail: tenantByEmail?.email || null,
        linkingIssue: null
      };

      // Déterminer les problèmes de liaison
      if (tenantByEmail && !linkedTenant) {
        if (tenantByEmail.tenant_profile_id && tenantByEmail.tenant_profile_id !== user.id) {
          diagnostic.linkingIssue = "Locataire lié à un autre compte";
        } else if (!tenantByEmail.tenant_profile_id) {
          diagnostic.linkingIssue = "Locataire non lié";
        }
      } else if (!tenantByEmail && diagnostic.isTenantUser) {
        diagnostic.linkingIssue = "Aucun locataire trouvé pour cet email";
      }

      setDiagnosticInfo(diagnostic);
      console.log("Diagnostic result:", diagnostic);

    } catch (error) {
      console.error("Diagnostic error:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'exécuter le diagnostic.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const attemptManualLinking = async () => {
    if (!user || !diagnosticInfo) return;

    setLoading(true);
    try {
      console.log("Attempting manual linking...");

      const { data: tenant } = await supabase
        .from('tenants')
        .select('id')
        .eq('email', user.email)
        .is('tenant_profile_id', null)
        .maybeSingle();

      if (!tenant) {
        toast({
          title: "Impossible",
          description: "Aucun locataire disponible pour liaison.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('tenants')
        .update({ tenant_profile_id: user.id })
        .eq('id', tenant.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Liaison manuelle réussie! Rechargez la page.",
      });

      // Rafraîchir le diagnostic
      await runDiagnostic();

    } catch (error) {
      console.error("Manual linking error:", error);
      toast({
        title: "Erreur",
        description: "Échec de la liaison manuelle.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5" />
          <span>Diagnostic du profil locataire</span>
        </CardTitle>
        <CardDescription>
          Diagnostic des problèmes de liaison entre votre compte et votre profil locataire.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button onClick={runDiagnostic} disabled={loading}>
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Exécuter le diagnostic
          </Button>
        </div>

        {diagnosticInfo && (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Statut du profil */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Profil utilisateur</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profil existe:</span>
                    <Badge variant={diagnosticInfo.profileExists ? "default" : "destructive"}>
                      {diagnosticInfo.profileExists ? "Oui" : "Non"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Utilisateur locataire:</span>
                    <Badge variant={diagnosticInfo.isTenantUser ? "default" : "secondary"}>
                      {diagnosticInfo.isTenantUser ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Statut de liaison */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Link className="h-4 w-4" />
                  <span className="font-medium">Liaison locataire</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Locataire lié:</span>
                    <Badge variant={diagnosticInfo.linkedTenantId ? "default" : "destructive"}>
                      {diagnosticInfo.linkedTenantId ? "Oui" : "Non"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Locataire existe:</span>
                    <Badge variant={diagnosticInfo.tenantExists ? "default" : "destructive"}>
                      {diagnosticInfo.tenantExists ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations détaillées */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Informations détaillées:</h4>
              <div className="text-sm space-y-1">
                <p><strong>ID utilisateur:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {diagnosticInfo.linkedTenantId && (
                  <p><strong>ID locataire lié:</strong> {diagnosticInfo.linkedTenantId}</p>
                )}
                {diagnosticInfo.tenantEmail && (
                  <p><strong>Email locataire:</strong> {diagnosticInfo.tenantEmail}</p>
                )}
              </div>
            </div>

            {/* Problèmes et solutions */}
            {diagnosticInfo.linkingIssue && (
              <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Problème détecté</span>
                </div>
                <p className="text-sm text-orange-700 mb-3">{diagnosticInfo.linkingIssue}</p>
                
                {diagnosticInfo.linkingIssue === "Locataire non lié" && (
                  <Button 
                    onClick={attemptManualLinking} 
                    disabled={loading}
                    size="sm"
                    variant="outline"
                  >
                    Tenter une liaison manuelle
                  </Button>
                )}
              </div>
            )}

            {/* Statut OK */}
            {diagnosticInfo.linkedTenantId && !diagnosticInfo.linkingIssue && (
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Profil correctement configuré</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Votre compte est correctement lié à votre profil locataire.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
