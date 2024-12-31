import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface DocumentUploadProps {
  tenantId: string;
  onUploadComplete: () => void;
}

export const DocumentUpload = ({ tenantId, onUploadComplete }: DocumentUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('tenant_documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tenant_documents')
        .getPublicUrl(fileName);

      // Save document reference in the database
      const { error: dbError } = await supabase
        .from('tenant_documents')
        .insert({
          tenant_id: tenantId,
          name: file.name,
          file_url: publicUrl
        });

      if (dbError) throw dbError;

      toast({
        title: "Document téléchargé",
        description: "Le document a été téléchargé avec succès",
      });

      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
        variant="outline"
      >
        <Upload className="mr-2 h-4 w-4" />
        Charger un document
      </Button>
    </div>
  );
};