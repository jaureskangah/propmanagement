import React from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    // Prepare expenses data
    const expensesData = expenses.map(expense => ({
      Category: expense.category,
      Amount: expense.amount,
      Date: new Date(expense.date).toLocaleDateString(),
    }));

    // Prepare maintenance data
    const maintenanceData = maintenance.map(item => ({
      Description: item.description,
      Cost: item.cost,
      Date: new Date(item.date).toLocaleDateString(),
    }));

    // Create sheets
    const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
    const maintenanceSheet = XLSX.utils.json_to_sheet(maintenanceData);

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, expensesSheet, "Expenses");
    XLSX.utils.book_append_sheet(workbook, maintenanceSheet, "Maintenance");

    // Export file
    XLSX.writeFile(workbook, "financial_report.xlsx");
  };

  const handlePDFExport = () => {
    console.log("Exporting to PDF...");
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Financial Report", 14, 20);

    // Cost Summary
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalMaintenance = maintenance.reduce((sum, maint) => sum + maint.cost, 0);
    const totalCosts = totalExpenses + totalMaintenance;

    doc.setFontSize(12);
    doc.text("Cost Summary", 14, 30);
    doc.text(`Total Expenses: $${totalExpenses.toLocaleString()}`, 14, 40);
    doc.text(`Total Maintenance: $${totalMaintenance.toLocaleString()}`, 14, 50);
    doc.text(`Total Cost: $${totalCosts.toLocaleString()}`, 14, 60);

    // Expenses table
    const expensesTableData = expenses.map(expense => [
      expense.category,
      `$${expense.amount.toLocaleString()}`,
      new Date(expense.date).toLocaleDateString()
    ]);

    doc.text("Expense Details", 14, 80);
    autoTable(doc, {
      startY: 85,
      head: [["Category", "Amount", "Date"]],
      body: expensesTableData,
    });

    // Maintenance table
    const maintenanceTableData = maintenance.map(item => [
      item.description,
      `$${item.cost.toLocaleString()}`,
      new Date(item.date).toLocaleDateString()
    ]);

    doc.addPage();
    doc.text("Maintenance Details", 14, 20);
    autoTable(doc, {
      startY: 25,
      head: [["Description", "Cost", "Date"]],
      body: maintenanceTableData,
    });

    // Save PDF
    doc.save("financial_report.pdf");
  };

  return (
    <div className="flex gap-2 mb-4">
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