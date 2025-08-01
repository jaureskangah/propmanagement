import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileOptimizedDialog = DialogPrimitive.Root;

const MobileOptimizedDialogTrigger = DialogPrimitive.Trigger;

const MobileOptimizedDialogPortal = DialogPrimitive.Portal;

const MobileOptimizedDialogClose = DialogPrimitive.Close;

const MobileOptimizedDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
MobileOptimizedDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const MobileOptimizedDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  
  return (
    <MobileOptimizedDialogPortal>
      <MobileOptimizedDialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          // Classes spécifiques pour mobile
          isMobile 
            ? "mobile-modal-full h-full w-full rounded-none" 
            : "max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
          // Touch target plus grand sur mobile
          isMobile && "mobile-touch-target h-10 w-10"
        )}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </MobileOptimizedDialogPortal>
  );
});
MobileOptimizedDialogContent.displayName = DialogPrimitive.Content.displayName;

const MobileOptimizedDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
MobileOptimizedDialogHeader.displayName = "MobileOptimizedDialogHeader";

const MobileOptimizedDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const isMobile = useIsMobile();
  
  return (
    <div
      className={cn(
        "flex justify-end space-x-2",
        // Stack buttons on mobile
        isMobile && "mobile-stack gap-2",
        className
      )}
      {...props}
    />
  );
};
MobileOptimizedDialogFooter.displayName = "MobileOptimizedDialogFooter";

const MobileOptimizedDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
MobileOptimizedDialogTitle.displayName = DialogPrimitive.Title.displayName;

const MobileOptimizedDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
MobileOptimizedDialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  MobileOptimizedDialog,
  MobileOptimizedDialogPortal,
  MobileOptimizedDialogOverlay,
  MobileOptimizedDialogClose,
  MobileOptimizedDialogTrigger,
  MobileOptimizedDialogContent,
  MobileOptimizedDialogHeader,
  MobileOptimizedDialogFooter,
  MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription,
};