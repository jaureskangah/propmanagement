import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, FileText, Share2, Mail } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { toast } from "sonner";
import { parseDateSafe } from "@/lib/date";

interface GlobalExportOptionsProps {
  data: any;
  type: string;
  filename?: string;
}

export const GlobalExportOptions = ({ data, type, filename }: GlobalExportOptionsProps) => {
  const { t } = useLocale();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);

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
            [t('leaseStart', { fallback: 'Début bail' })]: format(parseDateSafe(tenant.lease_start), 'dd/MM/yyyy'),
            [t('leaseEnd', { fallback: 'Fin bail' })]: format(parseDateSafe(tenant.lease_end), 'dd/MM/yyyy')
          }));
          const tenantsSheet = XLSX.utils.json_to_sheet(tenantsData);
          XLSX.utils.book_append_sheet(workbook, tenantsSheet, t('tenants', { fallback: 'Locataires' }));
        }

        // Payments sheet
        if (data.payments?.length > 0) {
          const paymentsData = data.payments.map((payment: any) => ({
            [t('amount', { fallback: 'Montant' })]: payment.amount,
            [t('status', { fallback: 'Statut' })]: payment.status,
            [t('date', { fallback: 'Date' })]: format(parseDateSafe(payment.payment_date), 'dd/MM/yyyy')
          }));
          const paymentsSheet = XLSX.utils.json_to_sheet(paymentsData);
          XLSX.utils.book_append_sheet(workbook, paymentsSheet, t('payments', { fallback: 'Paiements' }));
        }
      }

      const exportFilename = filename || `${type}_report_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, exportFilename);
      
      toast.success(t('toasts.exportSuccess', { fallback: 'Export Excel réussi' }));
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('toasts.exportError', { fallback: 'Erreur lors de l\'export' }));
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
        doc.text(`${t('totalRevenue', { fallback: 'Revenus totaux' })}: $${totalRevenue.toLocaleString()}`, 14, yPosition);
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
      
      toast.success(t('toasts.exportSuccess', { fallback: 'Export PDF réussi' }));
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(t('toasts.exportError', { fallback: 'Erreur lors de l\'export PDF' }));
    }
  };

  const generateReportContent = () => {
    if (type === 'analytics' && data) {
      let content = `Rapport Analytics - ${format(new Date(), 'dd/MM/yyyy HH:mm')}\n\n`;
      
      // Summary
      content += `RÉSUMÉ\n`;
      content += `========\n`;
      content += `Propriétés totales: ${data.properties?.length || 0}\n`;
      content += `Locataires totaux: ${data.tenants?.length || 0}\n`;
      
      const totalRevenue = data.payments?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0) || 0;
      content += `Revenus totaux: $${totalRevenue.toLocaleString()}\n\n`;
      
      // Properties details
      if (data.properties?.length > 0) {
        content += `PROPRIÉTÉS\n`;
        content += `==========\n`;
        data.properties.slice(0, 10).forEach((property: any) => {
          content += `- ${property.name} (${property.type})\n`;
          content += `  Adresse: ${property.address}\n`;
          content += `  Unités: ${property.units}\n`;
          content += `  Créé le: ${format(new Date(property.created_at), 'dd/MM/yyyy')}\n\n`;
        });
      }
      
      // Tenants details
      if (data.tenants?.length > 0) {
        content += `LOCATAIRES\n`;
        content += `==========\n`;
        data.tenants.slice(0, 10).forEach((tenant: any) => {
          content += `- ${tenant.name}\n`;
          content += `  Email: ${tenant.email}\n`;
          content += `  Loyer: $${tenant.rent_amount}\n`;
          content += `  Bail: ${format(parseDateSafe(tenant.lease_start), 'dd/MM/yyyy')} - ${format(parseDateSafe(tenant.lease_end), 'dd/MM/yyyy')}\n\n`;
        });
      }
      
      return content;
    }
    
    return `Rapport ${type} - ${format(new Date(), 'dd/MM/yyyy HH:mm')}\n\nAucune donnée disponible.`;
  };

  const handleEmailShare = async () => {
    if (!recipientEmail.trim()) {
      toast.error("Veuillez saisir un email valide");
      return;
    }

    setIsSharing(true);
    
    try {
      const reportContent = generateReportContent();
      const reportTitle = `Rapport ${type} - ${format(new Date(), 'dd/MM/yyyy')}`;
      
      const { data: response, error } = await supabase.functions.invoke('share-document', {
        body: {
          recipientEmail: recipientEmail.trim(),
          documentContent: reportContent,
          documentTitle: reportTitle
        }
      });

      if (error) throw error;

      toast.success(t('toasts.shareEmailSuccess', { fallback: 'Rapport envoyé par email avec succès' }));
      setIsShareDialogOpen(false);
      setRecipientEmail("");
    } catch (error) {
      console.error('Email share error:', error);
      toast.error(t('toasts.shareEmailError', { fallback: 'Erreur lors de l\'envoi du rapport' }));
    } finally {
      setIsSharing(false);
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
      
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t('shareByEmail', { fallback: 'Partager par email' })}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('shareReport', { fallback: 'Partager le rapport' })}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                {t('recipientEmail', { fallback: 'Email du destinataire' })}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="exemple@email.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsShareDialogOpen(false)}
                disabled={isSharing}
              >
                {t('cancel', { fallback: 'Annuler' })}
              </Button>
              <Button
                onClick={handleEmailShare}
                disabled={isSharing || !recipientEmail.trim()}
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                    {t('sending', { fallback: 'Envoi...' })}
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    {t('send', { fallback: 'Envoyer' })}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};