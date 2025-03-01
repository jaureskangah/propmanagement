
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

interface MaintenancePhotoGalleryProps {
  photos: string[];
}

export const MaintenancePhotoGallery = ({ photos }: MaintenancePhotoGalleryProps) => {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t } = useLocale();

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {photos.slice(0, 3).map((photo, index) => (
          <div 
            key={index} 
            className="relative aspect-square cursor-pointer overflow-hidden rounded-md bg-muted"
            onClick={() => {
              setCurrentIndex(index);
              setOpen(true);
            }}
          >
            <img
              src={photo}
              alt={t('maintenancePhoto') + ' ' + (index + 1)}
              className="object-cover h-full w-full transition-all hover:scale-105"
            />
            {index === 2 && photos.length > 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                <span>+{photos.length - 3}</span>
              </div>
            )}
            <div className="absolute bottom-1 right-1">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-6 w-6 rounded-full opacity-70 hover:opacity-100"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0">
          <div className="relative h-full overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10 rounded-full bg-black/20 hover:bg-black/40 text-white"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="relative w-full h-[50vh] overflow-hidden">
              <img
                src={photos[currentIndex]}
                alt={t('maintenancePhoto') + ' ' + (currentIndex + 1)}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
            
            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNext}
                className="rounded-full bg-black/20 hover:bg-black/40 text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5">
                {photos.map((_, index) => (
                  <button
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === index ? "bg-white w-4" : "bg-white/40 w-1.5"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
