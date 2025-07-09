import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, MoreHorizontal, Grid, Table } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PropertyActionsBarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
}

const PropertyActionsBar = ({
  selectedCount,
  onBulkDelete,
  onSelectAll,
  onClearSelection,
  viewMode,
  onViewModeChange
}: PropertyActionsBarProps) => {
  const { t } = useLocale();

  return (
    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
      <div className="flex items-center gap-3">
        {selectedCount > 0 ? (
          <>
            <Badge variant="secondary" className="font-medium">
              {selectedCount} {selectedCount === 1 ? 'propriété sélectionnée' : 'propriétés sélectionnées'}
            </Badge>
            <Button
              size="sm"
              variant="destructive"
              onClick={onBulkDelete}
              className="h-8"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClearSelection}
              className="h-8"
            >
              Désélectionner
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={onSelectAll}
            className="h-8"
          >
            Tout sélectionner
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-md border bg-background">
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "ghost"}
            onClick={() => onViewModeChange("grid")}
            className="h-8 px-3 rounded-r-none border-r"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "table" ? "default" : "ghost"}
            onClick={() => onViewModeChange("table")}
            className="h-8 px-3 rounded-l-none"
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyActionsBar;