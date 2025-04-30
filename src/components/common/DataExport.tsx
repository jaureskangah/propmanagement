
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface TableColumn {
  header: string;
  accessor: string;
  format?: (value: any) => string;
}

interface DataExportProps {
  data: any[];
  columns: TableColumn[];
  filename: string;
  pdfTitle?: string;
  pdfSubtitle?: string;
}

export const DataExport = ({
  data,
  columns,
  filename,
  pdfTitle,
  pdfSubtitle
}: DataExportProps) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExcelExport = async () => {
    try {
      setIsExporting('excel');
      
      const exportData = data.map(item => {
        const row: Record<string, any> = {};
        columns.forEach(column => {
          if (column.format) {
            row[column.header] = column.format(item[column.accessor]);
          } else {
            row[column.header] = item[column.accessor];
          }
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      
      // Format workbook
      const maxWidths: Record<string, number> = {};
      columns.forEach((col, index) => {
        const headerLength = col.header.length;
        maxWidths[XLSX.utils.encode_col(index)] = headerLength + 2;
      });
      
      worksheet['!cols'] = Object.keys(maxWidths).map(key => ({ wch: maxWidths[key] }));
      
      XLSX.writeFile(workbook, `${filename}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
      
      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès au format Excel.",
      });
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur s'est produite lors de l'exportation des données.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handlePDFExport = async () => {
    try {
      setIsExporting('pdf');
      
      const doc = new jsPDF();
      const title = pdfTitle || filename;
      
      // Add title
      doc.setFontSize(16);
      doc.text(title, 14, 15);
      
      // Add subtitle if provided
      if (pdfSubtitle) {
        doc.setFontSize(12);
        doc.text(pdfSubtitle, 14, 25);
      }
      
      const tableColumn = columns.map(col => col.header);
      const tableRows = data.map(item => {
        return columns.map(column => {
          if (column.format) {
            return column.format(item[column.accessor]);
          }
          return item[column.accessor]?.toString() || '';
        });
      });
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: pdfSubtitle ? 30 : 25,
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        },
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
      });
      
      doc.save(`${filename}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: "Export réussi",
        description: "Les données ont été exportées avec succès au format PDF.",
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "Erreur d'exportation",
        description: "Une erreur s'est produite lors de l'exportation des données.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Exporter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={handleExcelExport}
          disabled={isExporting !== null}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          <span>Exporter en Excel</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handlePDFExport}
          disabled={isExporting !== null}
          className="flex items-center gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4 text-red-600" />
          <span>Exporter en PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
