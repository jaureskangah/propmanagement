
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (template: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export const TemplateSelector = ({
  selectedTemplate,
  onTemplateChange,
  onGenerate,
  isGenerating,
}: TemplateSelectorProps) => {
  const templates = [
    { id: "lease", name: "Lease Agreement" },
    { id: "receipt", name: "Rent Receipt" },
    { id: "notice", name: "Notice to Vacate" },
  ];

  return (
    <div className="space-y-4">
      <Select value={selectedTemplate} onValueChange={onTemplateChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select document template" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={onGenerate}
        disabled={!selectedTemplate || isGenerating}
        className="w-full"
      >
        <FileText className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating..." : "Generate Document"}
      </Button>
    </div>
  );
};
