
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
import { CalendarIcon, DollarSign, Wallet, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { AddExpenseDialog } from "../dialogs/AddExpenseDialog";

interface ExpensesTableProps {
  expenses: {
    category: string;
    amount: number;
    date: string;
    description?: string;
    property_id?: string;
  }[];
  // Force propertyId as separate prop to guarantee button visibility
  propertyId: string;
}

export const ExpensesTable = ({ expenses, propertyId }: ExpensesTableProps) => {
  const { t, language } = useLocale();
  const locale = language === 'fr' ? fr : enUS;
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  console.log("ExpensesTable propertyId:", propertyId);
  console.log("ExpensesTable render, expenses length:", expenses.length);
  
  // Nouveau logging pour aider au débogage
  useEffect(() => {
    console.log("ExpensesTable monté/mis à jour avec propertyId:", propertyId);
    
    // Force le rendu du bouton même si propertyId est vide
    if (!propertyId) {
      console.warn("Warning: propertyId est vide dans ExpensesTable, mais le bouton sera affiché quand même");
    }
  }, [propertyId]);

  // Logging explicite pour l'état du dialogue
  useEffect(() => {
    console.log("État du dialogue AddExpense:", addDialogOpen ? "ouvert" : "fermé");
  }, [addDialogOpen]);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('expenses', { fallback: 'Expenses' })}</CardTitle>
          <CardDescription>{t('propertyExpenses', { fallback: 'Property expenses' })}</CardDescription>
        </div>
        {/* Affichage inconditionnel du bouton */}
        <button
          type="button"
          onClick={() => {
            console.log("Bouton Ajouter un coût cliqué, ouverture du dialogue avec propertyId:", propertyId);
            setAddDialogOpen(true);
          }}
          className="inline-flex items-center bg-[#ea384c] hover:bg-[#ea384c]/90 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
        >
          <Plus className="mr-1 h-4 w-4" />
          {t('addExpense', { fallback: 'Ajouter un coût' })}
        </button>
      </CardHeader>
      
      {expenses.length === 0 ? (
        <CardContent className="text-center py-8 text-muted-foreground">
          {t('noExpenseData', { fallback: 'No expense data available for this property' })}
        </CardContent>
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('category', { fallback: 'Category' })}</TableHead>
                <TableHead>{t('amount', { fallback: 'Amount' })}</TableHead>
                <TableHead>{t('date', { fallback: 'Date' })}</TableHead>
                <TableHead className="hidden md:table-cell">{t('description', { fallback: 'Description' })}</TableHead>
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
                    {expense.description ||
                      <span className="text-muted-foreground italic">
                        {t('noDescription', { fallback: 'No description' })}
                      </span>
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}

      {/* Rendre la boîte de dialogue inconditionnellement et vérifier si propertyId est défini */}
      <AddExpenseDialog
        isOpen={addDialogOpen}
        onClose={() => {
          console.log("Fermeture du dialogue AddExpense");
          setAddDialogOpen(false);
        }}
        propertyId={propertyId || 'default-property-id'} // Utiliser une valeur par défaut si propertyId est vide
      />
    </Card>
  );
};
