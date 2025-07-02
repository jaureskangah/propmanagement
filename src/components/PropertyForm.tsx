
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyFormData } from "@/hooks/useProperties";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Condo",
  "Office",
  "Commercial Space"
] as const;

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: PropertyFormData;
}

export function PropertyForm({ onSubmit, onCancel, isSubmitting, initialData }: PropertyFormProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const { t } = useLocale();
  
  const form = useForm<PropertyFormData>({
    defaultValues: initialData || {
      name: "",
      address: "",
      units: 0,
      type: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('property_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(fileName);

      form.setValue('image', publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const getPropertyTypeTranslation = (type: string) => {
    switch (type) {
      case 'Commercial Space':
        return t('commercialspace');
      case 'Office':
        return t('propertyOffice');
      case 'Apartment':
        return t('apartment');
      case 'House':
        return t('house');
      case 'Condo':
        return t('condo');
      default:
        return type;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('propertyName')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enterName')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('propertyAddress')}</FormLabel>
              <FormControl>
                <Input placeholder={t('enterAddress')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('propertyUnits')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('propertyType')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectPropertyType')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getPropertyTypeTranslation(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('propertyImage')}</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                  />
                  {isUploadingImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t('uploadingImage')}</span>
                    </div>
                  )}
                  {field.value && (
                    <img
                      src={field.value}
                      alt={t('propertyImage')}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploadingImage}>
            {isSubmitting ? t('saving') : initialData ? t('update') : t('create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
