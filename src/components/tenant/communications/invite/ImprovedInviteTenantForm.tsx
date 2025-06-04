
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useInvitations } from "@/hooks/tenant/useInvitations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, User, Building2 } from "lucide-react";

interface ImprovedInviteTenantFormProps {
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  propertyName?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ImprovedInviteTenantForm = ({
  tenantId,
  tenantName,
  tenantEmail,
  propertyName,
  onSuccess,
  onCancel,
}: ImprovedInviteTenantFormProps) => {
  const { t } = useLocale();
  const { sendInvitation, isLoading } = useInvitations();
  const [email, setEmail] = useState(tenantEmail);
  const [personalMessage, setPersonalMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await sendInvitation(tenantId, email);
    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Tenant Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Informations du locataire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{tenantName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{email}</span>
          </div>
          
          {propertyName && (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-500" />
              <span>{propertyName}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Badge variant="outline">Expire dans 7 jours</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Invitation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Détails de l'invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email du locataire</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                L'invitation sera envoyée à cette adresse email
              </p>
            </div>

            <div>
              <Label htmlFor="message">Message personnel (optionnel)</Label>
              <Textarea
                id="message"
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Ajoutez un message personnel à votre invitation..."
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ce message sera inclus dans l'email d'invitation
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Ce que votre locataire pourra faire :</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Consulter les détails de son bail</li>
                <li>• Suivre ses paiements de loyer</li>
                <li>• Faire des demandes de maintenance</li>
                <li>• Communiquer avec vous directement</li>
                <li>• Accéder à ses documents</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Envoi en cours..." : "Envoyer l'invitation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
