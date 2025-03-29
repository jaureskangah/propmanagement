
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PhotoUploadProps {
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photos: File[];
}

export const PhotoUpload = ({ handlePhotoChange, photos }: PhotoUploadProps) => {
  return (
    <Card className="border-blue-100">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <Label htmlFor="photos" className="flex items-center text-base font-medium">
            <Image className="h-4 w-4 mr-2 text-blue-500" />
            Photos
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">Glissez et déposez des fichiers ou</p>
            <Input
              id="photos"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className="cursor-pointer border-0 p-0 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
            />
            {photos.length > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-blue-600">
                  {photos.length} photo{photos.length > 1 ? 's' : ''} sélectionnée{photos.length > 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {Array.from({ length: Math.min(3, photos.length) }).map((_, index) => (
                    <div key={index} className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <Image className="h-4 w-4 text-blue-600" />
                    </div>
                  ))}
                  {photos.length > 3 && (
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">+{photos.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
