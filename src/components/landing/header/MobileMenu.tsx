
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { List, X } from "lucide-react";
import { useState } from "react";

interface MobileMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export const MobileMenu = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  children 
}: MobileMenuProps) => {
  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <List className="h-6 w-6" />}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80vw] sm:w-[385px] pt-16">
        <nav className="flex flex-col gap-4">
          {children}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
