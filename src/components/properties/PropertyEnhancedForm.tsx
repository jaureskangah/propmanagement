import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyFormData } from "@/types/property";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload, X, CheckCircle, MapPin, AlertTriangle } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CANADIAN_PROVINCES, formatCanadianPostalCode, validateCanadianPostalCode } from "@/types/canadianData";
import { canadianAddressSchema, NON_CANADIAN_ERROR_MESSAGE } from "@/utils/validations/canadianValidation";
import { useNavigate } from "react-router-dom";

const PROPERTY_TYPES = [
  "Apartment",
  "House", 
  "Condo",
  "Office",
  "Commercial Space"
] as const;

// Schéma de validation avec adresse canadienne
const propertySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  units: z.number().min(0, "Le nombre d'unités doit être positif").max(1000, "Maximum 1000 unités"),
  type: z.enum(PROPERTY_TYPES, { required_error: "Veuillez sélectionner un type" }),
  rent_amount: z.number().min(0, "Le loyer doit être positif"),
  image: z.string().optional(),
}).merge(canadianAddressSchema);

interface PropertyEnhancedFormProps {
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  initialData?: PropertyFormData;
}

export function PropertyEnhancedForm({ 
  onSubmit, 
  onCancel, 
  isSubmitting, 
  initialData 
}: PropertyEnhancedFormProps) {
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showNonCanadianAlert, setShowNonCanadianAlert] = useState(false);
  const navigate = useNavigate();
  const { t } = useLocale();
  
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialData || {
      name: "",
      address: "",
      city: "",
      province: "ON",
      postal_code: "",
      units: 0,
      type: "",
      rent_amount: 0,
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploadingImage(true);
      setUploadProgress(0);

      // Simulation du progrès pour une meilleure UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('property_images')
        .upload(fileName, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(fileName);

      form.setValue('image', publicUrl);
      
      // Animation de succès
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadProgress(0);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('image/')) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    form.setValue('image', '');
  };

  // Fonction pour détecter les codes postaux non-canadiens
  const isNonCanadianPostalCode = (postalCode: string): boolean => {
    if (!postalCode || postalCode.length < 3) return false;
    
    // Formats courants de codes postaux internationaux
    const patterns = [
      /^\d{5}(-\d{4})?$/, // USA (12345 ou 12345-6789)
      /^\d{5}$/, // France (75001)
      /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i, // UK (SW1A 1AA)
      /^\d{4}$/, // Allemagne (10115)
      /^\d{3}-\d{4}$/, // Japon (100-0001)
    ];
    
    return patterns.some(pattern => pattern.test(postalCode.trim())) || 
           !validateCanadianPostalCode(postalCode);
  };

  // Surveillance du code postal en temps réel
  const watchedPostalCode = form.watch('postal_code');
  
  useEffect(() => {
    if (watchedPostalCode && watchedPostalCode.length >= 3) {
      const isNonCanadian = isNonCanadianPostalCode(watchedPostalCode);
      setShowNonCanadianAlert(isNonCanadian);
    } else {
      setShowNonCanadianAlert(false);
    }
  }, [watchedPostalCode]);

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

  const watchedImage = form.watch('image');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mobile-form-spacing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 form-grid mobile-property-form">
          {/* Nom de la propriété */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {t('propertyName')}
                  {field.value && field.value.length >= 2 && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('enterName')} 
                    {...field}
                    className="transition-all duration-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type de propriété */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  {t('propertyType')}
                  {field.value && (
                    <Badge variant="secondary" className="text-xs">
                      {getPropertyTypeTranslation(field.value)}
                    </Badge>
                  )}
                </FormLabel>
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
        </div>

        {/* Section Adresse Canadienne */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Adresse de la propriété</h3>
            <Badge variant="outline" className="text-xs">🇨🇦 Canada</Badge>
          </div>
          
          {showNonCanadianAlert && (
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {NON_CANADIAN_ERROR_MESSAGE.description}
                <Button 
                  variant="link" 
                  className="p-0 h-auto ml-2"
                  onClick={() => navigate('/coming-soon-international')}
                >
                  {NON_CANADIAN_ERROR_MESSAGE.actionText}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Adresse civique */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse civique</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123 Rue Principale" 
                      {...field}
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ville */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Montréal, Toronto, Vancouver..." 
                      {...field}
                      className="transition-all duration-200"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Province */}
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province/Territoire</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CANADIAN_PROVINCES.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.nameFr} ({province.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code postal */}
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="A1A 1A1" 
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCanadianPostalCode(e.target.value);
                        field.onChange(formatted);
                      }}
                      className="transition-all duration-200 uppercase"
                      maxLength={7}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Format canadien requis (ex: H3A 1A1)
                  </p>
                </FormItem>
              )}
            />
          </div>
        </Card>

        {/* Nombre d'unités */}
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
                   max="1000"
                   {...field}
                   onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                   className="transition-all duration-200 mobile-touch-target mobile-select-large"
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Loyer */}
        <FormField
          control={form.control}
          name="rent_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('monthlyRent')}</FormLabel>
              <FormControl>
                 <Input 
                   type="number" 
                   min="0"
                   step="0.01"
                   {...field}
                   onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                   className="transition-all duration-200 mobile-touch-target mobile-select-large"
                   placeholder="0.00"
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Upload d'image amélioré */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('propertyImage')}</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {!watchedImage ? (
                     <div
                       className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 upload-area mobile-touch-target ${
                         dragActive 
                           ? 'border-primary bg-primary/5' 
                           : 'border-muted-foreground/25 hover:border-primary/50'
                       }`}
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploadingImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {t('dragImageHere')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('imageFormats')}
                          </p>
                        </div>
                      </div>

                      {isUploadingImage && (
                        <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                          <div className="space-y-3 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            <div className="w-48 bg-muted rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="bg-primary h-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Upload en cours... {uploadProgress}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Card className="relative overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative">
                          <img
                            src={watchedImage}
                            alt="Aperçu de la propriété"
                            className="w-full h-48 object-cover"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-2 right-2"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isUploadingImage}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {t('saving')}
              </>
            ) : (
              initialData ? t('updateProperty') : t('createProperty')
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}