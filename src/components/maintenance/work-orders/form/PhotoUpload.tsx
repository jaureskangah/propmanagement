import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";

interface PhotoUploadProps {
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photos: File[];
}

export const PhotoUpload = ({ handlePhotoChange, photos }: PhotoUploadProps) => {
  return (
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
      {photos.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {photos.length} photo(s) selected
        </p>
      )}
    </div>
  );
};