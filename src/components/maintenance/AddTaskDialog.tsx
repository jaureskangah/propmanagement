import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Plus } from "lucide-react";
import { fr } from "date-fns/locale";

interface AddTaskDialogProps {
  onAddTask: (task: {
    title: string;
    date: Date;
    type: "regular" | "inspection" | "seasonal";
  }) => void;
}

export const AddTaskDialog = ({ onAddTask }: AddTaskDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>();
  const [type, setType] = useState<"regular" | "inspection" | "seasonal">("regular");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date && type) {
      onAddTask({ title, date, type });
      setOpen(false);
      setTitle("");
      setDate(undefined);
      setType("regular");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle tâche</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la tâche</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entrez le titre de la tâche"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              locale={fr}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Type de tâche</Label>
            <Select value={type} onValueChange={(value: "regular" | "inspection" | "seasonal") => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Tâche régulière</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
                <SelectItem value="seasonal">Tâche saisonnière</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Ajouter la tâche</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};