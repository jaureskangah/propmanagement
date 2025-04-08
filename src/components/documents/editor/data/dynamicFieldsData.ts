
import { useLocale } from "@/components/providers/LocaleProvider";

export interface DynamicField {
  id: string;
  name: string;
  value: string;
}

export interface FieldCategory {
  category: string;
  fields: DynamicField[];
}

export const useDynamicFieldsData = (): FieldCategory[] => {
  const { t } = useLocale();

  return [
    {
      category: t('documentGenerator.tenant') || "Locataire",
      fields: [
        { id: "tenant-name", name: t('documentGenerator.tenantName') || "Nom du locataire", value: "{{name}}" },
        { id: "tenant-email", name: t('documentGenerator.tenantEmail') || "Email", value: "{{email}}" },
        { id: "tenant-phone", name: t('documentGenerator.tenantPhone') || "Téléphone", value: "{{phone}}" },
        { id: "tenant-unit", name: t('documentGenerator.unitNumber') || "Numéro d'unité", value: "{{unit_number}}" }
      ]
    },
    {
      category: t('documentGenerator.property') || "Propriété",
      fields: [
        { id: "property-name", name: t('documentGenerator.propertyName') || "Nom de la propriété", value: "{{properties.name}}" },
        { id: "property-address", name: t('documentGenerator.propertyAddress') || "Adresse de la propriété", value: "{{properties.address}}" }
      ]
    },
    {
      category: t('documentGenerator.lease') || "Bail",
      fields: [
        { id: "lease-start", name: t('documentGenerator.leaseStart') || "Début du bail", value: "{{lease_start}}" },
        { id: "lease-end", name: t('documentGenerator.leaseEnd') || "Fin du bail", value: "{{lease_end}}" },
        { id: "rent-amount", name: t('documentGenerator.rentAmount') || "Montant du loyer", value: "{{rent_amount}}" }
      ]
    },
    {
      category: t('documentGenerator.date') || "Date",
      fields: [
        { id: "current-date", name: t('documentGenerator.currentDate') || "Date actuelle", value: "{{currentDate}}" }
      ]
    }
  ];
};
