
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Edit, Check } from "lucide-react";

interface ActionButtonsProps {
  isEditing: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onSaveEdit?: () => void;
}

export function ActionButtons({ 
  isEditing, 
  onClose, 
  onEdit, 
  onSaveEdit
}: ActionButtonsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onClose}>
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
      
      {isEditing ? (
        <Button onClick={onSaveEdit}>
          <Check className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      ) : (
        <>
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </>
      )}
    </div>
  );
}
