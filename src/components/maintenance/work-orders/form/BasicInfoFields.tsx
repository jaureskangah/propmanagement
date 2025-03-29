
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Bookmark } from "lucide-react";

interface BasicInfoFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
}

export const BasicInfoFields = ({
  title,
  setTitle,
  description,
  setDescription,
}: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center text-base font-medium">
          <Bookmark className="h-4 w-4 mr-2 text-blue-500" />
          Titre
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Réparation plomberie salle de bain"
          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center text-base font-medium">
          <FileText className="h-4 w-4 mr-2 text-blue-500" />
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez le travail à effectuer..."
          className="min-h-[150px] border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
    </div>
  );
};
