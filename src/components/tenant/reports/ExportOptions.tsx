
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { useLocale } from "@/components/providers/LocaleProvider";

interface Payment {
  amount: number;
  status: string;
  payment_date: string;
}

interface ExportOptionsProps {
  payments: Payment[];
}

export const ExportOptions = ({ payments }: ExportOptionsProps) => {
  const { t, language } = useLocale();
  const locale = language === 'fr' ? fr : enUS;
  
  const handleExcelExport = () => {
    console.log("Exporting to Excel...");
    const workbook = XLSX.utils.book_new();
    
    const data = payments.map(payment => ({
      [t('date', { fallback: 'Date' })]: format(new Date(payment.payment_date), 'PPP', { locale }),
      [t('amount', { fallback: 'Amount' })]: payment.amount,
      [t('status', { fallback: 'Status' })]: payment.status === 'paid' ? t('paid') : 
                     payment.status === 'late' ? t('late', { fallback: 'Late' }) : 
                     t('pending')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, t('paymentHistory'));
    XLSX.writeFile(workbook, `${t('paymentHistory', { fallback: 'payment_history' })}.xlsx`);
  };

  const handlePDFExport = () => {
    console.log("Exporting to PDF...");
    const doc = new jsPDF();

    const tableData = payments.map(payment => [
      format(new Date(payment.payment_date), 'PPP', { locale }),
      `$${payment.amount.toLocaleString()}`,
      payment.status === 'paid' ? t('paid') : 
      payment.status === 'late' ? t('late', { fallback: 'Late' }) : 
      t('pending')
    ]);

    doc.text(t('paymentHistory'), 14, 15);
    
    autoTable(doc, {
      head: [[t('date', { fallback: 'Date' }), t('amount', { fallback: 'Amount' }), t('status', { fallback: 'Status' })]],
      body: tableData,
      startY: 20,
    });

    doc.save(`${t('paymentHistory', { fallback: 'payment_history' })}.pdf`);
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button
        variant="outline"
        onClick={handleExcelExport}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        {t('exportExcel', { fallback: 'Export Excel' })}
      </Button>
      <Button
        variant="outline"
        onClick={handlePDFExport}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        {t('exportPDF', { fallback: 'Export PDF' })}
      </Button>
    </div>
  );
};
