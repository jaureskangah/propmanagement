import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FileText } from "lucide-react";

interface FileUploadFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
}

export const FileUploadField = ({
  form,
  name,
  label,
  accept = "*",
  multiple = false,
}: FileUploadFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {label}
          </FormLabel>
          <FormControl>
            <Input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => {
                const files = e.target.files;
                if (multiple) {
                  onChange(Array.from(files || []));
                } else {
                  onChange(files?.[0] || null);
                }
              }}
              {...field}
              className="cursor-pointer"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};