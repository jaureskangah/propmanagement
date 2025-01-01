import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  existingFiles?: string[];
}

export const FileUploadField = ({
  form,
  name,
  label,
  accept,
  multiple,
  existingFiles,
}: FileUploadFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onChange(files);
              }}
              {...field}
            />
          </FormControl>
          {existingFiles && existingFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-2">Fichiers existants:</p>
              <div className="grid grid-cols-2 gap-2">
                {existingFiles.map((file, index) => (
                  <AspectRatio key={index} ratio={16 / 9}>
                    <img
                      src={file}
                      alt={`Fichier ${index + 1}`}
                      className="rounded-md object-cover w-full h-full"
                    />
                  </AspectRatio>
                ))}
              </div>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};