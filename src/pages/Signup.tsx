
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const Signup = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<'signup'>('signup');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t('welcome')}
          </CardTitle>
          <CardDescription>
            {t('authDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-full pr-4">
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as 'signup')} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="signup">{t('signUpCta')}</TabsTrigger>
              </TabsList>
              <TabsContent value="signup" className="mt-0">
                <SignUpForm onSuccess={() => {}} />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
