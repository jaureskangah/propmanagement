import { Card, CardContent } from "@/components/ui/card";

export const UnlinkedTenantMessage = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-center text-muted-foreground">
          Your account needs to be linked to a tenant profile.
          Please contact your property manager.
        </p>
      </CardContent>
    </Card>
  );
};