
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Bold, Italic, List, Image, Table, Signature } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface FormatToolbarProps {
  onInsertFormat: (format: string) => void;
  onInsertImage: (url: string) => void;
  onInsertTable: (rows: number, cols: number) => void;
  onInsertSignature: () => void;
}

export function FormatToolbar({
  onInsertFormat,
  onInsertImage,
  onInsertTable,
  onInsertSignature
}: FormatToolbarProps) {
  const { t } = useLocale();
  const [imageUrl, setImageUrl] = useState("");
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);

  return (
    <div className="flex flex-wrap gap-1 p-2 mb-2 border rounded-md bg-muted/30">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertFormat("**text**")}
        title={t('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertFormat("*text*")}
        title={t('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertFormat("\n- Item 1\n- Item 2\n- Item 3")}
        title={t('bulletList')}
      >
        <List className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title={t('insertImage')}>
            <Image className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">{t('insertImage')}</h4>
            <Input
              type="text"
              placeholder={t('imageUrlPlaceholder')}
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
              {t('insert')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" title={t('insertTable')}>
            <Table className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium">{t('insertTable')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm">{t('rows')}</label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value) || 2)}
                />
              </div>
              <div>
                <label className="text-sm">{t('columns')}</label>
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
              {t('insert')}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="sm"
        onClick={onInsertSignature}
        title={t('addSignature')}
      >
        <Signature className="h-4 w-4" />
      </Button>
    </div>
  );
}
