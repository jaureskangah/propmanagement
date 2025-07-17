import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ContactSupportProps {
  onBack: () => void;
}

export default function ContactSupport({ onBack }: ContactSupportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "medium",
    message: ""
  });
  const { toast } = useToast();

  const categories = [
    { value: "technical", label: "Problème technique" },
    { value: "billing", label: "Facturation" },
    { value: "feature", label: "Demande de fonctionnalité" },
    { value: "account", label: "Gestion de compte" },
    { value: "general", label: "Question générale" }
  ];

  const priorities = [
    { value: "low", label: "Faible", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "Moyen", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "Élevé", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800" }
  ];

  const expectedResponseTimes = {
    low: "2-3 jours ouvrables",
    medium: "1-2 jours ouvrables",
    high: "4-8 heures",
    urgent: "1-4 heures"
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          message: `
Catégorie: ${categories.find(c => c.value === formData.category)?.label || formData.category}
Priorité: ${priorities.find(p => p.value === formData.priority)?.label || formData.priority}
Sujet: ${formData.subject}

Message:
${formData.message}
          `,
          subject: formData.subject,
          category: formData.category,
          priority: formData.priority
        },
      });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: `Nous vous répondrons dans ${expectedResponseTimes[formData.priority as keyof typeof expectedResponseTimes]}.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        priority: "medium",
        message: ""
      });

      onBack();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPriority = priorities.find(p => p.value === formData.priority);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4 pl-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au centre de support
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-red-600" />
                <span>Contacter le support</span>
              </CardTitle>
              <p className="text-gray-600">
                Décrivez votre problème en détail et nous vous répondrons rapidement.
              </p>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                    className="mt-1"
                    placeholder="Résumé de votre demande"
                  />
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priorité</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <div className="flex items-center space-x-2">
                              <Badge className={priority.color}>
                                {priority.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Response Time Info */}
                {selectedPriority && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800">
                          <strong>Temps de réponse estimé:</strong> {expectedResponseTimes[formData.priority as keyof typeof expectedResponseTimes]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Message */}
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    className="mt-1 min-h-32"
                    placeholder="Décrivez votre problème en détail. Plus vous fournirez d'informations, plus nous pourrons vous aider efficacement."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum 10 caractères ({formData.message.length}/10)
                  </p>
                </div>

                {/* File Upload Placeholder */}
                <div>
                  <Label>Pièces jointes (optionnel)</Label>
                  <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Glissez-déposez des fichiers ici ou cliquez pour sélectionner
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, PDF jusqu'à 10MB
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.email || !formData.subject || !formData.category || formData.message.length < 10}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}