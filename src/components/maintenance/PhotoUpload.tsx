
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PhotoUploadProps {
  photos: File[];
  setPhotos: (photos: File[]) => void;
  existingPhotos?: string[];
  onDeleteExisting?: (url: string) => void;
}

export const PhotoUpload = ({ 
  photos, 
  setPhotos, 
  existingPhotos,
  onDeleteExisting 
}: PhotoUploadProps) => {
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="photos">Photos</Label>
        <div className="flex items-center gap-2">
          <Input
            id="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="cursor-pointer"
          />
          <Image className="h-5 w-5 text-gray-500" />
        </div>
      </div>

      {(photos.length > 0 || (existingPhotos && existingPhotos.length > 0)) && (
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {existingPhotos?.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <img
                  src={url}
                  alt={`Existing photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                {onDeleteExisting && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteExisting(url)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            {photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Selected photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemovePhoto(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};
