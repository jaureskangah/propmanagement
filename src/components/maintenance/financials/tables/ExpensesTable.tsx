import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExpensesFilters } from "../filters/ExpensesFilters";
import { startOfMonth, startOfQuarter, startOfYear, parseISO, isAfter } from "date-fns";

interface ExpensesTableProps {
  expenses: {
    category: string;
    amount: number;
    date: string;
  }[];
}

export const ExpensesTable = ({ expenses }: ExpensesTableProps) => {
  const [period, setPeriod] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedExpenses = useMemo(() => {
    console.log("Filtering and sorting expenses with:", { period, sortBy, searchQuery });
    
    // Filtrer par période
    let filtered = [...expenses];
    const now = new Date();
    
    if (period !== "all") {
      let startDate;
      switch (period) {
        case "month":
          startDate = startOfMonth(now);
          break;
        case "quarter":
          startDate = startOfQuarter(now);
          break;
        case "year":
          startDate = startOfYear(now);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        filtered = filtered.filter(expense => 
          isAfter(parseISO(expense.date), startDate)
        );
      }
    }

    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.category.toLowerCase().includes(query)
      );
    }

    // Trier
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });
  }, [expenses, period, sortBy, searchQuery]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dépenses</CardTitle>
        <CardDescription>Suivi des dépenses par propriété</CardDescription>
      </CardHeader>
      <CardContent>
        <ExpensesFilters
          period={period}
          setPeriod={setPeriod}
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Catégorie</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedExpenses.map((expense, index) => (
              <TableRow key={index}>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.amount.toLocaleString()}€</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};