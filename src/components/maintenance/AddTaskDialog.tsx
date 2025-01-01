import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Add a new task</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)] px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                required
                className="rounded-md border"
              />
            </div>
            <div className="space-y-2">
              <Label>Task type</Label>
              <Select value={type} onValueChange={(value: "regular" | "inspection" | "seasonal") => setType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular task</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="seasonal">Seasonal task</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Add task</Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};