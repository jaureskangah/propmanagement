import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PropertyForm } from "./PropertyForm";
import { useProperties, PropertyFormData } from "@/hooks/useProperties";

export function AddPropertyModal() {
  const [open, setOpen] = useState(false);
  const { addProperty, isLoading } = useProperties();

  const handleSubmit = async (data: PropertyFormData) => {
    const success = await addProperty(data);
    if (success) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        <PropertyForm 
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}