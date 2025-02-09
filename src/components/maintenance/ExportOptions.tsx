
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, FileSpreadsheet } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from "date-fns";
import { Task } from "./types";

interface ExportOptionsProps {
  tasks: Task[];
}

export const ExportOptions = ({ tasks }: ExportOptionsProps) => {
  const handleExcelExport = () => {
    console.log("Exporting to Excel...");
    const workbook = XLSX.utils.book_new();
    
    const data = tasks.map(task => ({
      Date: format(new Date(task.date), 'PPP'),
      Title: task.title,
      Type: task.type,
      Status: task.completed ? 'Completed' : 'In Progress'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "maintenance_tasks.xlsx");
  };

  const handlePDFExport = () => {
    console.log("Exporting to PDF...");
    const doc = new jsPDF();

    const tableData = tasks.map(task => [
      format(new Date(task.date), 'PPP'),
      task.title,
      task.type,
      task.completed ? 'Completed' : 'In Progress'
    ]);

    doc.text("Maintenance Tasks List", 14, 15);
    
    autoTable(doc, {
      head: [["Date", "Title", "Type", "Status"]],
      body: tableData,
      startY: 20,
    });

    doc.save("maintenance_tasks.pdf");
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
