import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface Payment {
  amount: number;
  status: string;
  payment_date: string;
}

interface ExportOptionsProps {
  payments: Payment[];
}

export const ExportOptions = ({ payments }: ExportOptionsProps) => {
  const handleExcelExport = () => {
    console.log("Exporting to Excel...");
    const workbook = XLSX.utils.book_new();
    
    const data = payments.map(payment => ({
      Date: format(new Date(payment.payment_date), 'PPP', { locale: enUS }),
      Amount: payment.amount,
      Status: payment.status === 'paid' ? 'Paid' : payment.status === 'late' ? 'Late' : 'Pending'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payment_history.xlsx");
  };

  const handlePDFExport = () => {
    console.log("Exporting to PDF...");
    const doc = new jsPDF();

    const tableData = payments.map(payment => [
      format(new Date(payment.payment_date), 'PPP', { locale: enUS }),
      `$${payment.amount.toLocaleString()}`,
      payment.status === 'paid' ? 'Paid' : payment.status === 'late' ? 'Late' : 'Pending'
    ]);

    doc.text("Payment History", 14, 15);
    
    autoTable(doc, {
      head: [["Date", "Amount", "Status"]],
      body: tableData,
      startY: 20,
    });

    doc.save("payment_history.pdf");
  };

  return (
    <div className="flex gap-4 mt-6">
      <Button
        variant="outline"
        onClick={handleExcelExport}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Export Excel
      </Button>
      <Button
        variant="outline"
        onClick={handlePDFExport}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Export PDF
      </Button>
    </div>
  );
};