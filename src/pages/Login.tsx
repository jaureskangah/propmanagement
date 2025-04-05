
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignInForm from '@/components/auth/SignInForm';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const [activeTab, setActiveTab] = useState<'signin'>('signin');

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
              onValueChange={(value) => setActiveTab(value as 'signin')} 
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="signin">{t('signInCta')}</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="mt-0">
                <SignInForm />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
