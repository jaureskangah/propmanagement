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
  const [isUploading, setIsUploading] = React.useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    setIsUploading(true);
    console.log("Starting upload for file:", file.name);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${tenantId}/${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading to storage with path:", fileName);

      const { error: uploadError, data } = await supabase.storage
        .from('tenant_documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

      console.log("File uploaded successfully, getting public URL");

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('tenant_documents')
        .getPublicUrl(fileName);

      console.log("Got public URL:", publicUrl);

      // Save document reference in the database
      const { error: dbError } = await supabase
        .from('tenant_documents')
        .insert({
          tenant_id: tenantId,
          name: file.name,
          file_url: publicUrl
        });

      if (dbError) {
        console.error("Database insert error:", dbError);
        throw dbError;
      }

      console.log("Document reference saved in database");

      toast({
        title: "Document chargé",
        description: "Le document a été chargé avec succès",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
        disabled={isUploading}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? "Chargement en cours..." : "Charger un document"}
      </Button>
    </div>
  );
};