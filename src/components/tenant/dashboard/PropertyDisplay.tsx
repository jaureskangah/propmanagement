
import { Home } from "lucide-react";
import { DashboardMetric } from "@/components/DashboardMetric";
import { useLocale } from "@/components/providers/LocaleProvider";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface PropertyDisplayProps {
  propertyName?: string;
  unitNumber: string;
  propertyId?: string;
}

export const PropertyDisplay = ({ propertyName: propPropertyName, unitNumber, propertyId }: PropertyDisplayProps) => {
  const { t } = useLocale();
  const [displayPropertyName, setDisplayPropertyName] = useState<string>(propPropertyName || "Chargement...");
  
  useEffect(() => {
    const getPropertyName = async () => {
      // Si on a déjà le nom de la propriété, on l'utilise
      if (propPropertyName && propPropertyName !== "Sans propriété") {
        setDisplayPropertyName(propPropertyName);
        return;
      }
      
      // Sinon, on essaie de le récupérer avec l'ID
      if (propertyId) {
        try {
          const { data, error } = await supabase
            .from("properties")
            .select("name")
            .eq("id", propertyId)
            .single();
          
          if (error) {
            console.error("Error fetching property:", error);
            setDisplayPropertyName("Erreur propriété");
          } else if (data && data.name) {
            setDisplayPropertyName(data.name);
          } else {
            setDisplayPropertyName("Propriété introuvable");
          }
        } catch (err) {
          console.error("Exception fetching property:", err);
          setDisplayPropertyName("Erreur propriété");
        }
      } else {
        setDisplayPropertyName("Sans propriété");
      }
    };

    getPropertyName();
  }, [propPropertyName, propertyId]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <DashboardMetric
        title={t('property')}
        value={displayPropertyName}
        description={`Appartement ${unitNumber}`}
        icon={<Home className="h-5 w-5" />}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none shadow-md"
      />
    </motion.div>
  );
};
