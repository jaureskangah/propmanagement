
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyEnhancedForm } from '@/components/properties/PropertyEnhancedForm';
import { useProperties, PropertyFormData } from '@/hooks/useProperties';
import { toast } from '@/hooks/use-toast';

const AddProperty = () => {
  const navigate = useNavigate();
  const { addProperty } = useProperties();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    try {
      await addProperty(data);
      toast({
        title: 'Succès',
        description: 'Propriété ajoutée avec succès',
      });
      navigate('/properties');
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'ajout de la propriété',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/properties');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ajouter une propriété</h1>
        <PropertyEnhancedForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default AddProperty;
