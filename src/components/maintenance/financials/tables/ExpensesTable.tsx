
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocale } from "@/components/providers/LocaleProvider";
import { CalendarIcon, DollarSign, Wallet, Plus, UserCircle } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { AddExpenseDialog } from "../dialogs/AddExpenseDialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { DataExport, TableColumn } from "@/components/common/DataExport";

interface ExpensesTableProps {
  expenses: {
    category: string;
    amount: number;
    date: string;
    description?: string;
    property_id?: string;
    vendor_id?: string;
    vendors?: {
      name: string;
    };
  }[];
  propertyId: string;
}

export const ExpensesTable = ({ expenses, propertyId }: ExpensesTableProps) => {
  const { t, language } = useLocale();
  const locale = language === 'fr' ? fr : enUS;
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  console.log("ExpensesTable propertyId:", propertyId);
  console.log("ExpensesTable render, expenses length:", expenses.length);
  
  useEffect(() => {
    console.log("ExpensesTable monté/mis à jour avec propertyId:", propertyId);
    
    if (!propertyId) {
      console.warn("Warning: propertyId est vide dans ExpensesTable, mais le bouton sera affiché quand même");
    }
  }, [propertyId]);

  const handleExpenseAdded = () => {
    console.log("Expense added successfully, refreshing data...");
    // Invalidate the relevant queries to refresh the expenses data
    queryClient.invalidateQueries({ queryKey: ["maintenance_expenses", propertyId] });
    setAddDialogOpen(false);
  };
  
  // Columns configuration for export
  const exportColumns: TableColumn[] = [
    { header: "Catégorie", accessor: "category" },
    { header: "Montant", accessor: "amount", format: (value) => `$${Number(value).toLocaleString()}` },
    { header: "Date", accessor: "date", format: (value) => format(parseISO(value), 'PPP', { locale }) },
    { header: "Fournisseur", accessor: "vendorName", format: (value) => value || 'Non spécifié' },
    { header: "Description", accessor: "description", format: (value) => value || 'Aucune description' },
  ];
  
  // Format data for export
  const exportData = expenses.map(expense => ({
    ...expense,
    vendorName: expense.vendors?.name || '',
  }));
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{language === 'fr' ? "Dépenses" : t('expenses')}</CardTitle>
          <CardDescription>{language === 'fr' ? "Dépenses de la propriété" : t('propertyExpenses')}</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <DataExport
            data={exportData}
            columns={exportColumns}
            filename="depenses_propriete"
            pdfTitle={language === 'fr' ? "Rapport de dépenses" : "Expense Report"}
            pdfSubtitle={`Généré le ${format(new Date(), 'dd/MM/yyyy')}`}
          />
          <Button
            type="button"
            onClick={() => {
              console.log("Bouton Ajouter un coût cliqué, ouverture du dialogue avec propertyId:", propertyId);
              setAddDialogOpen(true);
            }}
            className="inline-flex items-center bg-[#ea384c] hover:bg-[#ea384c]/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            {language === 'fr' ? "Ajouter une dépense" : t('addExpense')}
          </Button>
        </div>
      </CardHeader>
      
      {expenses.length === 0 ? (
        <CardContent className="text-center py-8 text-muted-foreground">
          {language === 'fr' ? "Aucune dépense disponible pour cette propriété" : t('noExpenseData')}
        </CardContent>
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'fr' ? "Catégorie" : t('category')}</TableHead>
                <TableHead>{language === 'fr' ? "Montant" : t('amount')}</TableHead>
                <TableHead>{language === 'fr' ? "Date" : t('date')}</TableHead>
                <TableHead className="hidden md:table-cell">{language === 'fr' ? "Fournisseur" : "Vendor"}</TableHead>
                <TableHead className="hidden md:table-cell">{language === 'fr' ? "Description" : t('description')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <span>{expense.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-500" />
                      <span className="font-medium">${expense.amount.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-blue-500" />
                      {format(parseISO(expense.date), 'PPP', { locale })}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-purple-500" />
                      {expense.vendors?.name || 
                        <span className="text-muted-foreground italic">
                          {language === 'fr' ? "Non spécifié" : "Not specified"}
                        </span>
                      }
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {expense.description ||
                      <span className="text-muted-foreground italic">
                        {language === 'fr' ? "Aucune description" : t('noDescription')}
                      </span>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}

      <AddExpenseDialog
        isOpen={addDialogOpen}
        onClose={() => {
          console.log("Fermeture du dialogue AddExpense");
          setAddDialogOpen(false);
        }}
        propertyId={propertyId || 'default-property-id'} 
        onSuccess={handleExpenseAdded}
      />
    </Card>
  );
};
