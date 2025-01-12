import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to PropManagement
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-0">
              <SignInForm onSuccess={onClose} />
            </TabsContent>
            <TabsContent value="signup" className="mt-0">
              <SignUpForm onSuccess={onClose} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}