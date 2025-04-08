
import { useRef, useState, useEffect } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/button";
import { BaseDialog } from "./BaseDialog";

interface SignatureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureDataUrl: string) => void;
}

export function SignatureDialog({ isOpen, onClose, onSave }: SignatureDialogProps) {
  const { t } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize canvas when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(initCanvas, 100);
    }
  }, [isOpen]);

  // Initialize canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000";
        clearCanvas();
      }
    }
  };

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setIsDrawing(true);
        
        let x, y;
        if ('touches' in e) {
          // Touch event
          const rect = canvas.getBoundingClientRect();
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          // Mouse event
          x = e.nativeEvent.offsetX;
          y = e.nativeEvent.offsetY;
        }
        
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let x, y;
        if ('touches' in e) {
          // Touch event
          const rect = canvas.getBoundingClientRect();
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
          e.preventDefault(); // Prevent scrolling on touch
        } else {
          // Mouse event
          x = e.nativeEvent.offsetX;
          y = e.nativeEvent.offsetY;
        }
        
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Handle save
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl);
      onClose();
    }
  };

  const customFooter = (
    <div className="flex justify-between w-full">
      <Button variant="outline" onClick={clearCanvas} type="button">
        {t('clear') || "Effacer"}
      </Button>
      <Button onClick={handleSave}>
        {t('saveSignature') || "Enregistrer la signature"}
      </Button>
    </div>
  );

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('addSignature') || "Ajouter une signature"}
      footer={customFooter}
      size="md"
      showCancelButton={false}
    >
      <div className="border rounded-md p-1 bg-white">
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="border border-gray-300 rounded touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </BaseDialog>
  );
}
