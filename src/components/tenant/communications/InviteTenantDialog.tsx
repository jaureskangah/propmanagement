import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

interface InviteTenantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  defaultEmail?: string;
}

export const InviteTenantDialog = ({
  isOpen,
  onClose,
  tenantId,
  defaultEmail = ""
}: InviteTenantDialogProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Reset email when dialog opens with new defaultEmail
  React.useEffect(() => {
    if (isOpen) {
      setEmail(defaultEmail);
    }
  }, [isOpen, defaultEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send invitations",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Generate a unique token
      const token = crypto.randomUUID();
      
      // Set expiration to 7 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const { error } = await supabase
        .from('tenant_invitations')
        .insert({
          tenant_id: tenantId,
          email,
          token,
          expires_at: expiresAt.toISOString(),
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Invitation sent",
        description: "The tenant will receive an email with instructions",
      });

      onClose();
      setEmail("");
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Tenant to Communications</DialogTitle>
          <DialogDescription>
            Send an invitation to your tenant to join the communications platform.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Tenant Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tenant@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};