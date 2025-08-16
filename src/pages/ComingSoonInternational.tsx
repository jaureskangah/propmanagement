import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { useLocale } from '@/components/providers/LocaleProvider';

export default function ComingSoonInternational() {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !country) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: `${t('dbRecordName')} - ${country}`,
          email,
          message: `${t('dbRecordMessage')} ${country}`,
          status: 'pending'
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: t('successTitle'),
        description: t('successDescription'),
      });
    } catch (error) {
      toast({
        title: t('errorTitle'),
        description: t('errorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('thankYou')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('registeredMessage')}
            </p>
            <Link to="/">
              <Button variant="outline" className="w-full">
                {t('backToHomeButton')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{t('pageTitle')}</CardTitle>
          <CardDescription className="text-lg">
            {t('pageDescription')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {t('currentlyAvailableTitle')}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {t('currentlyAvailableDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                {t('countryLabel')}
              </label>
              <Input
                id="country"
                type="text"
                placeholder={t('countryPlaceholder')}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                {t('emailLabel')}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t('submittingButton') : t('submitButton')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {t('canadaQuestion')}
            </p>
            <Link to="/">
              <Button variant="outline" size="sm">
                {t('accessCanadianPlatform')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}