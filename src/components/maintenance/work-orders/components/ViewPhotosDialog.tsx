
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ViewPhotosDialogProps {
  photos: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const ViewPhotosDialog = ({ photos, isOpen, onClose }: ViewPhotosDialogProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return null;
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Photos ({currentIndex + 1}/{photos.length})</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="relative">
          <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            <img
              src={photos[currentIndex]}
              alt={`Photo ${currentIndex + 1}`}
              className="h-full w-full object-contain"
            />
          </AspectRatio>
          
          {photos.length > 1 && (
            <>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        
        {photos.length > 1 && (
          <div className="flex justify-center gap-1 mt-2 overflow-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                className={`h-12 w-12 rounded-md overflow-hidden border-2 ${
                  index === currentIndex ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setCurrentIndex(index)}
              >
                <img
                  src={photo}
                  alt={`Miniature ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
