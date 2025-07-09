import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Share2 } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { toast } from "sonner";

interface GlobalExportOptionsProps {
  data: any;
  type: string;
  filename?: string;
}

export const GlobalExportOptions = ({ data, type, filename }: GlobalExportOptionsProps) => {
  const { t } = useLocale();

  const handleExcelExport = () => {
    try {
      const workbook = XLSX.utils.book_new();
      const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm');
      
      // Create sheets based on data type
      if (type === 'analytics' && data) {
        // Properties sheet
        if (data.properties?.length > 0) {
          const propertiesData = data.properties.map((property: any) => ({
            [t('name', { fallback: 'Nom' })]: property.name,
            [t('address', { fallback: 'Adresse' })]: property.address,
            [t('type', { fallback: 'Type' })]: property.type,
            [t('units', { fallback: 'Unités' })]: property.units,
            [t('createdAt', { fallback: 'Créé le' })]: format(new Date(property.created_at), 'dd/MM/yyyy')
          }));
          const propertiesSheet = XLSX.utils.json_to_sheet(propertiesData);
          XLSX.utils.book_append_sheet(workbook, propertiesSheet, t('properties', { fallback: 'Propriétés' }));
        }

        // Tenants sheet
        if (data.tenants?.length > 0) {
          const tenantsData = data.tenants.map((tenant: any) => ({
            [t('name', { fallback: 'Nom' })]: tenant.name,
            [t('email', { fallback: 'Email' })]: tenant.email,
            [t('rentAmount', { fallback: 'Loyer' })]: tenant.rent_amount,
            [t('leaseStart', { fallback: 'Début bail' })]: format(new Date(tenant.lease_start), 'dd/MM/yyyy'),
            [t('leaseEnd', { fallback: 'Fin bail' })]: format(new Date(tenant.lease_end), 'dd/MM/yyyy')
          }));
          const tenantsSheet = XLSX.utils.json_to_sheet(tenantsData);
          XLSX.utils.book_append_sheet(workbook, tenantsSheet, t('tenants', { fallback: 'Locataires' }));
        }

        // Payments sheet
        if (data.payments?.length > 0) {
          const paymentsData = data.payments.map((payment: any) => ({
            [t('amount', { fallback: 'Montant' })]: payment.amount,
            [t('status', { fallback: 'Statut' })]: payment.status,
            [t('date', { fallback: 'Date' })]: format(new Date(payment.payment_date), 'dd/MM/yyyy')
          }));
          const paymentsSheet = XLSX.utils.json_to_sheet(paymentsData);
          XLSX.utils.book_append_sheet(workbook, paymentsSheet, t('payments', { fallback: 'Paiements' }));
        }
      }

      const exportFilename = filename || `${type}_report_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, exportFilename);
      
      toast.success(t('exportSuccess', { fallback: 'Export Excel réussi' }));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('exportError', { fallback: 'Erreur lors de l\'export' }));
    }
  };

  const handlePDFExport = () => {
    try {
      const doc = new jsPDF();
      const timestamp = format(new Date(), 'dd/MM/yyyy HH:mm');
      
      // Title
      doc.setFontSize(20);
      doc.text(t('advancedReport', { fallback: 'Rapport Avancé' }), 14, 20);
      
      doc.setFontSize(12);
      doc.text(`${t('generatedOn', { fallback: 'Généré le' })}: ${timestamp}`, 14, 30);

      let yPosition = 50;

      if (type === 'analytics' && data) {
        // Summary section
        doc.setFontSize(16);
        doc.text(t('summary', { fallback: 'Résumé' }), 14, yPosition);
        yPosition += 10;

        doc.setFontSize(12);
        doc.text(`${t('totalProperties', { fallback: 'Propriétés totales' })}: ${data.properties?.length || 0}`, 14, yPosition);
        yPosition += 8;
        doc.text(`${t('totalTenants', { fallback: 'Locataires totaux' })}: ${data.tenants?.length || 0}`, 14, yPosition);
        yPosition += 8;
        
        const totalRevenue = data.payments?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0) || 0;
        doc.text(`${t('totalRevenue', { fallback: 'Revenus totaux' })}: €${totalRevenue.toLocaleString()}`, 14, yPosition);
        yPosition += 20;

        // Properties table
        if (data.properties?.length > 0) {
          doc.setFontSize(14);
          doc.text(t('properties', { fallback: 'Propriétés' }), 14, yPosition);
          yPosition += 10;

          const propertiesTableData = data.properties.slice(0, 10).map((property: any) => [
            property.name,
            property.type,
            property.units.toString(),
            format(new Date(property.created_at), 'dd/MM/yyyy')
          ]);

          autoTable(doc, {
            startY: yPosition,
            head: [[
              t('name', { fallback: 'Nom' }),
              t('type', { fallback: 'Type' }),
              t('units', { fallback: 'Unités' }),
              t('createdAt', { fallback: 'Créé le' })
            ]],
            body: propertiesTableData,
            margin: { left: 14 },
            styles: { fontSize: 10 }
          });

          yPosition = (doc as any).lastAutoTable.finalY + 20;
        }
      }

      const exportFilename = filename || `${type}_report_${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`;
      doc.save(exportFilename);
      
      toast.success(t('exportSuccess', { fallback: 'Export PDF réussi' }));
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(t('exportError', { fallback: 'Erreur lors de l\'export PDF' }));
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('advancedReport', { fallback: 'Rapport Avancé' }),
          text: t('shareReportText', { fallback: 'Consultez ce rapport détaillé' }),
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('linkCopied', { fallback: 'Lien copié dans le presse-papier' }));
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleExcelExport} className="flex items-center gap-2">
        <FileSpreadsheet className="h-4 w-4" />
        {t('exportExcel', { fallback: 'Export Excel' })}
      </Button>
      <Button variant="outline" onClick={handlePDFExport} className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        {t('exportPDF', { fallback: 'Export PDF' })}
      </Button>
      <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        {t('share', { fallback: 'Partager' })}
      </Button>
    </div>
  );
};