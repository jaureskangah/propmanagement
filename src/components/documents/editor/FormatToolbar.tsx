
import { useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bold, Italic, List, Image, Table2, Pen, Calendar, User, Variable } from "lucide-react";

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number) => void;
}

const TableDialog = ({ isOpen, onClose, onInsert }: TableDialogProps) => {
  const { t } = useLocale();
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('insertTable')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows">{t('rows')}</Label>
              <Input
                id="rows"
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 2)}
              />
            </div>
            <div>
              <Label htmlFor="cols">{t('columns')}</Label>
              <Input
                id="cols"
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 2)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button onClick={() => onInsert(rows, cols)}>
            {t('insert')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface FormatToolbarProps {
  onInsertFormat: (text: string) => void;
  onInsertImage: (url: string) => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertSignature: () => void;
  onInsertDynamicField?: (field: string) => void;
}

export function FormatToolbar({
  onInsertFormat,
  onInsertImage,
  onInsertTable,
  onInsertSignature,
  onInsertDynamicField
}: FormatToolbarProps) {
  const { t } = useLocale();
  const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);

  const handleInsertImage = () => {
    if (imageUrl) {
      onInsertImage(imageUrl);
      setImageUrl("");
      setIsImagePopoverOpen(false);
    }
  };

  const dynamicFields = [
    { id: 'date', label: t('currentDate'), value: '{{currentDate}}', icon: Calendar },
    { id: 'tenant_name', label: t('tenantName'), value: '{{tenant.name}}', icon: User },
    { id: 'tenant_email', label: t('tenantEmail'), value: '{{tenant.email}}', icon: User },
    { id: 'tenant_phone', label: t('tenantPhone'), value: '{{tenant.phone}}', icon: User },
    { id: 'property_name', label: t('propertyName'), value: '{{property.name}}', icon: User },
    { id: 'unit_number', label: t('unitNumber'), value: '{{tenant.unit_number}}', icon: User },
    { id: 'lease_start', label: t('leaseStart'), value: '{{tenant.lease_start}}', icon: Calendar },
    { id: 'lease_end', label: t('leaseEnd'), value: '{{tenant.lease_end}}', icon: Calendar },
    { id: 'rent_amount', label: t('rentAmount'), value: '{{tenant.rent_amount}}', icon: User },
  ];

  return (
    <div className="flex items-center flex-wrap gap-2 p-2 border rounded-md bg-background/50">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsertFormat("**text**")}
        title={t('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsertFormat("*text*")}
        title={t('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onInsertFormat("- Item\n- Item\n- Item")}
        title={t('bulletList')}
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" title={t('insertImage')}>
            <Image className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">{t('insertImage')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('imageUrlPlaceholder')}
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="image-url"
                value={imageUrl}
                className="col-span-4"
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Button size="sm" onClick={handleInsertImage}>
              {t('insert')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsTableDialogOpen(true)}
        title={t('insertTable')}
      >
        <Table2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onInsertSignature}
        title={t('addSignature')}
      >
        <Pen className="h-4 w-4" />
      </Button>
      
      {onInsertDynamicField && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title={t('insertDynamicField')}>
              <Variable className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{t('dynamicFields')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {dynamicFields.map(field => (
                <DropdownMenuItem 
                  key={field.id}
                  onClick={() => onInsertDynamicField(field.value)}
                  className="flex items-center"
                >
                  <field.icon className="mr-2 h-4 w-4" />
                  <span>{field.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      <TableDialog
        isOpen={isTableDialogOpen}
        onClose={() => setIsTableDialogOpen(false)}
        onInsert={onInsertTable}
      />
    </div>
  );
}
