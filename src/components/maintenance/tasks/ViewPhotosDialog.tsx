
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewPhotosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
}

export const ViewPhotosDialog = ({ isOpen, onClose, photos }: ViewPhotosDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl animate-fade-in">
        <DialogHeader>
          <DialogTitle>Photos de la tâche</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] w-full rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {photos.map((url, index) => (
              <div 
                key={index} 
                className="relative transition-transform hover:scale-105 duration-200"
              >
                <img
                  src={url}
                  alt={`Photo de la tâche ${index + 1}`}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
