
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocale } from '@/components/providers/LocaleProvider';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const { t } = useLocale();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t('welcome')}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            {t('authDescription')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4 h-[60vh]">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'signin' | 'signup')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">{t('signInCta')}</TabsTrigger>
              <TabsTrigger value="signup">{t('signUpCta')}</TabsTrigger>
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
