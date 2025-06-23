
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const TenantUserCard = () => {
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="text-blue-800">Compte Locataire</CardTitle>
        <CardDescription className="text-blue-700">
          Vous êtes connecté en tant que locataire. Certaines options sont limitées à votre profil.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
