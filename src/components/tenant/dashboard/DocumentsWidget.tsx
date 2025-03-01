
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { File, FileText, ArrowUpRight, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TenantDocument } from "@/types/tenant";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useNavigate } from "react-router-dom";

interface DocumentsWidgetProps {
  documents: TenantDocument[];
}

export const DocumentsWidget = ({ documents }: DocumentsWidgetProps) => {
  const { t } = useLocale();
  const navigate = useNavigate();
  
  return (
    <Card className="shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          {t('documents')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-center py-6">
            <File className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">{t('noDocuments')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.slice(0, 3).map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center p-2 rounded-md hover:bg-muted transition-colors"
              >
                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm flex-1 truncate">{doc.name}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {documents.length > 3 && (
              <div className="text-sm text-center text-muted-foreground">
                {t('andMoreDocuments', { count: (documents.length - 3).toString() })}
              </div>
            )}
          </div>
        )}
        
        <Button 
          className="w-full mt-2"
          variant="outline"
          onClick={() => navigate('/tenant/documents')}
        >
          {t('viewAllDocuments')}
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
