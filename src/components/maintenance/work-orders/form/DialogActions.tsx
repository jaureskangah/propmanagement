
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onClose: () => void;
  isPending: boolean;
}

export const DialogActions = ({
  onClose,
  isPending,
}: DialogActionsProps) => {
  return (
    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
      <Button 
        type="button" 
        variant="outline" 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
      >
        Annuler
      </Button>
      <Button 
        type="submit" 
        disabled={isPending}
        onClick={(e) => e.stopPropagation()}
      >
        {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
      </Button>
    </div>
  );
};
