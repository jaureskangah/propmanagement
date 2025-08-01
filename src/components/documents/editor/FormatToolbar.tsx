
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Bold, Italic, List, Image, Table, Signature } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DynamicFieldsMenu } from "./DynamicFieldsMenu";

interface FormatToolbarProps {
  onInsertFormat: (format: string) => void;
  onInsertImage: (url: string) => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertSignature: () => void;
  onInsertDynamicField: (field: string) => void;
}

export function FormatToolbar({
  onInsertFormat,
  onInsertImage,
  onInsertTable,
  onInsertSignature,
  onInsertDynamicField
}: FormatToolbarProps) {
  const { t } = useLocale();
  const [imageUrl, setImageUrl] = useState("");
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  return (
    <div className="toolbar-grid md:flex md:flex-wrap gap-1 p-2 mb-2 border rounded-md bg-muted/30 mobile-tabs-scroll overflow-x-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertFormat("**text**")}
        title={t('bold') || "Gras"}
        className="mobile-touch-target flex-shrink-0"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertFormat("*text*")}
        title={t('italic') || "Italique"}
        className="mobile-touch-target flex-shrink-0"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertFormat("\n- Item 1\n- Item 2\n- Item 3")}
        title={t('bulletList') || "Liste à puces"}
        className="mobile-touch-target flex-shrink-0"
      >
        <List className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title={t('insertImage') || "Insérer une image"} className="mobile-touch-target flex-shrink-0">
            <Image className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">{t('insertImage') || "Insérer une image"}</h4>
            <Input
              type="text"
              placeholder={t('imageUrlPlaceholder') || "Entrez l'URL de l'image"}
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button 
              onClick={() => {
                onInsertImage(imageUrl);
                setImageUrl("");
              }}
              disabled={!imageUrl}
              className="w-full"
            >
              {t('insert') || "Insérer"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title={t('insertTable') || "Insérer un tableau"} className="mobile-touch-target flex-shrink-0">
            <Table className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">{t('insertTable') || "Insérer un tableau"}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">{t('rows') || "Lignes"}</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 2)}
                />
              </div>
              <div>
                <label className="text-sm">{t('columns') || "Colonnes"}</label>
                <Input
                  type="number"
                  min="1" 
                  max="10"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value) || 2)}
                />
              </div>
            </div>
            <Button 
              onClick={() => {
                onInsertTable(rows, cols);
              }}
              className="w-full"
            >
              {t('insert') || "Insérer"}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertSignature}
        title={t('addSignature') || "Ajouter une signature"}
        className="mobile-touch-target flex-shrink-0"
      >
        <Signature className="h-4 w-4" />
      </Button>

      <DynamicFieldsMenu onInsertField={onInsertDynamicField} />
    </div>
  );
}
