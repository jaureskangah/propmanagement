import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export default function ComingSoonInternational() {
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !country) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: `International Interest - ${country}`,
          email,
          message: `Intérêt pour l'expansion internationale depuis ${country}`,
          status: 'pending'
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: 'Merci pour votre intérêt !',
        description: 'Nous vous contacterons dès que nous serons disponibles dans votre région.',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue. Veuillez réessayer.',
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
            <h2 className="text-2xl font-bold mb-2">Merci !</h2>
            <p className="text-muted-foreground mb-6">
              Votre intérêt a été enregistré. Nous vous contacterons dès que nous étendrons nos services à votre région.
            </p>
            <Link to="/">
              <Button variant="outline" className="w-full">
                Retour à l'accueil
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
          <CardTitle className="text-2xl">Bientôt disponible dans votre région</CardTitle>
          <CardDescription className="text-lg">
            PropertyPilot se concentre actuellement sur le marché canadien. Nous prévoyons d'étendre nos services internationalement prochainement.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🇨🇦 Actuellement disponible au Canada
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Nous offrons une plateforme complète de gestion immobilière adaptée aux lois et réglementations canadiennes, avec support en français et anglais.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Votre pays/région
              </label>
              <Input
                id="country"
                type="text"
                placeholder="Ex: France, Belgique, États-Unis..."
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Envoi...' : 'Être notifié du lancement'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Vous êtes au Canada ?
            </p>
            <Link to="/">
              <Button variant="outline" size="sm">
                Accéder à la plateforme canadienne
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}