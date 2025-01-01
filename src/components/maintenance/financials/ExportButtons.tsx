import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Download } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ExportButtonsProps {
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
  maintenance: {
    description: string;
    cost: number;
    date: string;
  }[];
}

export const ExportButtons = ({ expenses, maintenance }: ExportButtonsProps) => {
  const handleExcelExport = () => {
    console.log("Exporting to Excel...");
    const workbook = XLSX.utils.book_new();

    // Préparer les données des dépenses
    const expensesData = expenses.map(expense => ({
      Catégorie: expense.category,
      Montant: expense.amount,
      Date: new Date(expense.date).toLocaleDateString(),
    }));

    // Préparer les données de maintenance
    const maintenanceData = maintenance.map(item => ({
      Description: item.description,
      Coût: item.cost,
      Date: new Date(item.date).toLocaleDateString(),
    }));

    // Créer les feuilles
    const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
    const maintenanceSheet = XLSX.utils.json_to_sheet(maintenanceData);

    // Ajouter les feuilles au classeur
    XLSX.utils.book_append_sheet(workbook, expensesSheet, "Dépenses");
    XLSX.utils.book_append_sheet(workbook, maintenanceSheet, "Maintenance");

    // Exporter le fichier
    XLSX.writeFile(workbook, "rapport_financier.xlsx");
  };

  const handlePDFExport = () => {
    console.log("Exporting to PDF...");
    const doc = new jsPDF();

    // Titre
    doc.setFontSize(16);
    doc.text("Rapport Financier", 14, 20);

    // Résumé des coûts
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalMaintenance = maintenance.reduce((sum, maint) => sum + maint.cost, 0);
    const totalCosts = totalExpenses + totalMaintenance;

    doc.setFontSize(12);
    doc.text("Résumé des Coûts", 14, 30);
    doc.text(`Total des Dépenses: ${totalExpenses.toLocaleString()}€`, 14, 40);
    doc.text(`Total Maintenance: ${totalMaintenance.toLocaleString()}€`, 14, 50);
    doc.text(`Coût Total: ${totalCosts.toLocaleString()}€`, 14, 60);

    // Tableau des dépenses
    const expensesTableData = expenses.map(expense => [
      expense.category,
      `${expense.amount.toLocaleString()}€`,
      new Date(expense.date).toLocaleDateString()
    ]);

    doc.text("Détail des Dépenses", 14, 80);
    (doc as any).autoTable({
      startY: 85,
      head: [["Catégorie", "Montant", "Date"]],
      body: expensesTableData,
    });

    // Tableau de maintenance
    const maintenanceTableData = maintenance.map(item => [
      item.description,
      `${item.cost.toLocaleString()}€`,
      new Date(item.date).toLocaleDateString()
    ]);

    doc.addPage();
    doc.text("Détail de la Maintenance", 14, 20);
    (doc as any).autoTable({
      startY: 25,
      head: [["Description", "Coût", "Date"]],
      body: maintenanceTableData,
    });

    // Sauvegarder le PDF
    doc.save("rapport_financier.pdf");
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button 
        variant="outline" 
        onClick={handleExcelExport}
        className="flex items-center gap-2"
      >
        <FileSpreadsheet className="h-4 w-4" />
        Exporter Excel
      </Button>
      <Button 
        variant="outline" 
        onClick={handlePDFExport}
        className="flex items-center gap-2"
      >
        <FileText className="h-4 w-4" />
        Exporter PDF
      </Button>
    </div>
  );
};